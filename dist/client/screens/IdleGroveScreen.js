"use strict";
// =========================================================
// IDLE GROVE SCREEN MODULE - STORAGE VAULT RESTING PHASE
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdleGroveScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class IdleGroveScreen {
    updateTimer = null;
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    constructor() { }
    init() {
        window.handleClaimIdleVault = () => this.handleClaimVault();
        this.renderCampfireScene();
        const claimBtn = document.getElementById('btn-claim-idle-vault');
        if (claimBtn) {
            claimBtn.onclick = () => this.handleClaimVault();
        }
    }
    onEnter() {
        window.handleClaimIdleVault = () => this.handleClaimVault();
        this.renderCampfireScene();
        this.startVaultUIUpdate();
    }
    onLeave() {
        this.stopVaultUIUpdate();
    }
    startVaultUIUpdate() {
        if (this.updateTimer)
            return;
        this.updateTimer = setInterval(() => {
            this.updateVaultUI();
        }, 1000);
    }
    stopVaultUIUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }
    updateVaultUI() {
        const vault = this.gameState.state.idleVault;
        const timeEl = document.getElementById('idle-vault-time-text');
        const expEl = document.getElementById('idle-stored-exp');
        const goldEl = document.getElementById('idle-stored-gold');
        const claimBtn = document.getElementById('btn-claim-idle-vault');
        if (timeEl)
            timeEl.innerText = `⏱️ Accumulated: ${this.gameState.getIdleVaultDurationText()}`;
        if (expEl)
            expEl.innerText = `+${(vault?.accumulatedExp || 0).toLocaleString()} EXP`;
        if (goldEl)
            goldEl.innerText = `+${(vault?.accumulatedGold || 0).toLocaleString()} 🪙`;
        // LOCK / GRAY DISABLED BUTTON STATUS FOR CLAIM COOLDOWN (5s RESTRICTION ONLY)
        if (claimBtn) {
            const now = Date.now();
            const lastClaim = vault?.lastClaimTime || 0;
            const cooldownRemaining = 5000 - (now - lastClaim);
            if (cooldownRemaining > 0) {
                const secs = Math.ceil(cooldownRemaining / 1000);
                claimBtn.disabled = true;
                claimBtn.innerHTML = `⏳ CLAIM COOLDOWN (${secs}s)`;
                claimBtn.className = 'w-full py-3.5 bg-slate-800 text-slate-500 font-black text-xs rounded-2xl border border-slate-700 cursor-not-allowed opacity-60 shadow-none';
            }
            else {
                claimBtn.disabled = false;
                claimBtn.innerHTML = `🎁 CLAIM STORAGE VAULT`;
                claimBtn.className = 'w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-xs font-black text-white rounded-2xl shadow-2xl border border-emerald-300 animate-pulse transition hover:scale-105 cursor-pointer';
            }
        }
    }
    handleClaimVault() {
        const res = this.gameState.claimIdleVaultStorage();
        if (res.success) {
            this.audio.playSound('levelup');
            this.ui.showToast(res.message, 'success');
            this.updateVaultUI();
            this.showClaimRewardEffect(res.expGained, res.goldGained);
        }
        else {
            this.audio.playSound('hit');
            this.ui.showToast(res.message, 'warning');
        }
    }
    showClaimRewardEffect(exp, gold) {
        const btn = document.getElementById('btn-claim-idle-vault');
        if (btn) {
            btn.classList.add('scale-105', 'ring-4', 'ring-amber-300', 'bg-amber-400');
            setTimeout(() => {
                btn.classList.remove('scale-105', 'ring-4', 'ring-amber-300', 'bg-amber-400');
            }, 400);
        }
        const popup = document.createElement('div');
        popup.className = 'level-up-float-text';
        popup.innerHTML = `🎁 +${exp.toLocaleString()} EXP & +${gold.toLocaleString()} 🪙 CLAIMED! 🎁`;
        popup.style.left = `${window.innerWidth / 2}px`;
        popup.style.top = `${window.innerHeight / 2 - 80}px`;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1400);
    }
    renderCampfireScene() {
        const container = document.getElementById('idle-campfire-container');
        if (!container)
            return;
        const chibiHTML = this.gameState.getChibiHeroHTML('scale-90');
        container.innerHTML = `
      <div class="relative w-full flex flex-col justify-between items-center space-y-4 p-4">
        <!-- Top Camp Background: Forest Trees & Adventurer Tent -->
        <div class="flex justify-between items-center w-full z-10 px-4">
          <div class="text-5xl opacity-80 animate-pulse">🌲</div>
          <div class="flex flex-col items-center">
            <div class="text-6xl animate-pulse drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">⛺</div>
            <span class="text-[10px] text-emerald-400 font-extrabold uppercase mt-1">Adventurer Camp</span>
          </div>
          <div class="text-5xl opacity-80 animate-pulse">🌲</div>
        </div>

        <!-- Center Campfire with Glowing Embers -->
        <div class="flex flex-col items-center relative my-2 z-10">
          <div class="text-6xl animate-bounce drop-shadow-[0_0_30px_rgba(245,158,11,0.9)]">🔥</div>
          <div class="absolute -top-4 text-amber-300 text-sm animate-ping">✨</div>
          <span class="text-xs text-amber-300 font-black tracking-wider uppercase mt-1">Warm Campfire</span>
        </div>

        <!-- Bottom Foreground: Exact Chibi Character Resting (No Border / Window Layer) -->
        <div class="flex flex-col items-center z-20">
          ${chibiHTML}
          <span class="text-xs text-emerald-300 font-black mt-1">${this.gameState.state.name} Resting</span>
        </div>
      </div>
    `;
        this.updateVaultUI();
    }
}
exports.IdleGroveScreen = IdleGroveScreen;
