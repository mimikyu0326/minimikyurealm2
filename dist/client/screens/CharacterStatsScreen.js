"use strict";
// =========================================================
// UNIFIED CHARACTER SCREEN MODULE - HERO PREVIEW & ATTRIBUTES
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterStatsScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class CharacterStatsScreen {
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    constructor() { }
    init() {
        ['str', 'int', 'agi', 'vit'].forEach(stat => {
            const btn = document.querySelector(`button[onclick="addStatPoint('${stat}')"]`);
            if (btn) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.allocate(stat);
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
        window.toggleAutoStatAllocation = () => this.toggleAutoStatAllocation();
    }
    toggleAutoStatAllocation() {
        this.gameState.state.isAutoAllocateStats = !this.gameState.state.isAutoAllocateStats;
        this.audio.playSound('click');
        if (this.gameState.state.isAutoAllocateStats) {
            this.gameState.autoAllocateStatPoints();
            this.ui.showToast('⚡ AUTO STAT ALLOCATION ACTIVATED!', 'success');
        }
        else {
            this.ui.showToast('⚡ Auto Stat Allocation turned OFF.', 'info');
        }
        this.gameState.notify();
        this.gameState.saveToFirebase();
    }
    onEnter() {
        this.gameState.notify();
    }
    setGender(gender) {
        this.gameState.state.gender = gender;
        this.audio.playSound('click');
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.ui.showToast(`Updated Character Gender: ${gender}!`, 'success');
    }
    allocate(stat) {
        if (this.gameState.state.statPoints <= 0) {
            this.ui.showToast('⚠️ No stat points available to allocate!', 'warning');
            return;
        }
        const input = document.getElementById('input-stat-alloc-amount');
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
exports.CharacterStatsScreen = CharacterStatsScreen;
