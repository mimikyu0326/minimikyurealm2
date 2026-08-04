// =========================================================
// CHARACTER CREATION SCREEN MODULE - HERO SETUP PHASE
// =========================================================

import { ScreenLifecycle } from './ScreenManager';
import { GameStateService } from '../services/GameStateService';

export class CharacterCreateScreen implements ScreenLifecycle {
  private selectedJobClass: 'WARRIOR' | 'MAGE' | 'ARCHER' | 'SAMURAI' = 'SAMURAI';
  private selectedGender: 'MALE' | 'FEMALE' = 'MALE';
  private gameState = GameStateService.getInstance();

  constructor(private onCreateComplete: () => void) {}

  public init(): void {
    ['warrior', 'mage', 'archer', 'samurai'].forEach(c => {
      const card = document.getElementById(`card-class-${c}`);
      if (card) {
        card.onclick = () => this.selectClass(c.toUpperCase() as any);
      }
    });

    const maleBtn = document.getElementById('create-gender-male');
    const femaleBtn = document.getElementById('create-gender-female');

    if (maleBtn) maleBtn.onclick = () => this.selectGender('MALE');
    if (femaleBtn) femaleBtn.onclick = () => this.selectGender('FEMALE');

    const form = document.querySelector('#screen-char-create form');
    if (form) {
      (form as HTMLFormElement).onsubmit = (e: Event) => this.handleCreate(e);
    }
  }

  public onEnter(): void {}
  public onLeave(): void {}

  public selectGender(gender: 'MALE' | 'FEMALE'): void {
    this.selectedGender = gender;
    const maleBtn = document.getElementById('create-gender-male');
    const femaleBtn = document.getElementById('create-gender-female');

    if (maleBtn && femaleBtn) {
      if (gender === 'MALE') {
        maleBtn.className = 'flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 border border-emerald-400';
        femaleBtn.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800';
      } else {
        femaleBtn.className = 'flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-pink-600 border border-pink-400';
        maleBtn.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800';
      }
    }
  }

  public selectClass(jobClass: 'WARRIOR' | 'MAGE' | 'ARCHER' | 'SAMURAI'): void {
    this.selectedJobClass = jobClass;
    ['warrior', 'mage', 'archer', 'samurai'].forEach(c => {
      const card = document.getElementById(`card-class-${c}`);
      if (card) {
        if (c === jobClass.toLowerCase()) {
          card.className = 'p-4 rounded-2xl bg-emerald-900/80 border-2 border-emerald-400 cursor-pointer text-center hover:bg-emerald-800 transition';
        } else {
          card.className = 'p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-800/40 cursor-pointer text-center hover:bg-emerald-800 transition';
        }
      }
    });
  }

  private handleCreate(e: Event): void {
    e.preventDefault();
    const nameEl = document.getElementById('create-char-name') as HTMLInputElement;
    if (!nameEl || !nameEl.value.trim()) return;

    const heroName = nameEl.value.trim();
    const isWarrior = this.selectedJobClass === 'WARRIOR';
    const isMage = this.selectedJobClass === 'MAGE';
    const isSamurai = this.selectedJobClass === 'SAMURAI';
    const baseHp = isWarrior ? 120 : isSamurai ? 110 : isMage ? 80 : 90;

    this.gameState.state.name = heroName;
    this.gameState.state.gender = this.selectedGender;
    this.gameState.state.jobClass = this.selectedJobClass;
    this.gameState.state.level = 1;
    this.gameState.state.exp = 0;
    this.gameState.state.maxExp = 100;
    this.gameState.state.hp = baseHp;
    this.gameState.state.maxHp = baseHp;
    this.gameState.state.statPoints = 5;
    this.gameState.state.str = isWarrior ? 10 : isSamurai ? 11 : 5;
    this.gameState.state.int = isMage ? 12 : 5;
    this.gameState.state.agi = isSamurai ? 14 : (!isWarrior && !isMage ? 12 : 5);
    this.gameState.state.vit = isWarrior ? 8 : isSamurai ? 7 : 5;
    this.gameState.state.gold = 1500;
    this.gameState.state.gems = 50;

    // Assign class-specific starter weapon
    const starterWeapon = this.gameState.getStarterWeaponForClass(this.selectedJobClass);
    const starterArmor = { id: 'starter-armor-1', name: 'Jade Guardian Armor', type: 'armor' as const, rarity: 'common' as const, icon: '🥋', cpBonus: 15, level: 1, count: 1, description: 'Starter armor crafted for new heroes.', isLocked: false };

    this.gameState.state.inventory = [starterWeapon, starterArmor];
    this.gameState.state.equippedWeapon = starterWeapon;
    this.gameState.state.equippedArmor = starterArmor;
    this.gameState.cleanNonClassWeapons();

    this.gameState.updateCP();
    this.gameState.saveToFirebase();
    this.gameState.listenToFirebase();
    this.gameState.notify();

    this.onCreateComplete();
  }
}
