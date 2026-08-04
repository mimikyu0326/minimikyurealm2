// =========================================================
// UNIFIED CHARACTER SCREEN MODULE - HERO PREVIEW & ATTRIBUTES
// =========================================================

import { ScreenLifecycle } from './ScreenManager';
import { GameStateService } from '../services/GameStateService';
import { AudioService } from '../services/AudioService';
import { UIService } from '../services/UIService';

export class CharacterStatsScreen implements ScreenLifecycle {
  private gameState = GameStateService.getInstance();
  private audio = AudioService.getInstance();
  private ui = UIService.getInstance();

  constructor() {}

  public init(): void {
    ['str', 'int', 'agi', 'vit'].forEach(stat => {
      const btn = document.querySelector(`button[onclick="addStatPoint('${stat}')"]`);
      if (btn) {
        (btn as HTMLElement).onclick = (e) => {
          e.preventDefault();
          this.allocate(stat as any);
        };
      }
    });

    const genderMale = document.getElementById('btn-gender-male');
    const genderFemale = document.getElementById('btn-gender-female');

    if (genderMale) {
      genderMale.onclick = () => this.setGender('MALE');
    }
    if (genderFemale) {
      genderFemale.onclick = () => this.setGender('FEMALE');
    }

    (window as any).toggleAutoStatAllocation = () => this.toggleAutoStatAllocation();
  }

  public toggleAutoStatAllocation(): void {
    this.gameState.state.isAutoAllocateStats = !this.gameState.state.isAutoAllocateStats;
    this.audio.playSound('click');

    if (this.gameState.state.isAutoAllocateStats) {
      this.gameState.autoAllocateStatPoints();
      this.ui.showToast('⚡ AUTO STAT ALLOCATION ACTIVATED!', 'success');
    } else {
      this.ui.showToast('⚡ Auto Stat Allocation turned OFF.', 'info');
    }

    this.gameState.notify();
    this.gameState.saveToFirebase();
  }

  public onEnter(): void {
    this.gameState.notify();
  }

  public setGender(gender: 'MALE' | 'FEMALE'): void {
    this.gameState.state.gender = gender;
    this.audio.playSound('click');
    this.gameState.notify();
    this.gameState.saveToFirebase();
    this.ui.showToast(`Updated Character Gender: ${gender}!`, 'success');
  }

  public allocate(stat: 'str' | 'int' | 'agi' | 'vit'): void {
    if (this.gameState.state.statPoints <= 0) {
      this.ui.showToast('⚠️ No stat points available to allocate!', 'warning');
      return;
    }

    const input = document.getElementById('input-stat-alloc-amount') as HTMLInputElement;
    const requested = Math.max(1, parseInt(input?.value || '1', 10));
    const toAllocate = Math.min(this.gameState.state.statPoints, requested);

    this.gameState.state.statPoints -= toAllocate;
    this.gameState.state[stat] += toAllocate;

    if (stat === 'vit') {
      this.gameState.state.maxHp += 10 * toAllocate;
      this.gameState.state.hp = Math.min(this.gameState.state.maxHp, this.gameState.state.hp + 10 * toAllocate);
    }

    this.audio.playSound('levelup');
    this.gameState.triggerStatGlowEffect();
    this.gameState.updateCP();
    this.gameState.notify();
    this.gameState.saveToFirebase();
    this.ui.showToast(`Allocated +${toAllocate} to ${stat.toUpperCase()}!`, 'success');
  }
}
