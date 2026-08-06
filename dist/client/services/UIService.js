"use strict";
// =========================================================
// UI SERVICE - CUSTOM RPG ALERTS, TOASTS & SYSTEM MODALS
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIService = void 0;
const AudioService_1 = require("./AudioService");
class UIService {
    static instance;
    audio = AudioService_1.AudioService.getInstance();
    constructor() {
        this.createSystemModalDOM();
        this.createToastContainerDOM();
    }
    static getInstance() {
        if (!UIService.instance) {
            UIService.instance = new UIService();
        }
        return UIService.instance;
    }
    createToastContainerDOM() {
        if (document.getElementById('rpg-toast-container'))
            return;
        const container = document.createElement('div');
        container.id = 'rpg-toast-container';
        container.className = 'fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-none max-w-xs w-full';
        document.body.appendChild(container);
    }
    createSystemModalDOM() {
        if (document.getElementById('rpg-modal-overlay'))
            return;
        const overlay = document.createElement('div');
        overlay.id = 'rpg-modal-overlay';
        overlay.className = 'hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300';
        overlay.innerHTML = `
      <div id="rpg-modal-card" class="glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-emerald-400 shadow-2xl text-center relative animate-scaleUp">
        <div id="rpg-modal-icon" class="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-400 inline-flex items-center justify-center text-3xl mb-3 shadow-lg">
          📜
        </div>
        <h3 id="rpg-modal-title" class="text-xl font-black text-white mb-2 tracking-wide">SYSTEM NOTICE</h3>
        <p id="rpg-modal-message" class="text-xs text-emerald-200 mb-6 leading-relaxed">System notification message.</p>
        <button id="rpg-modal-btn" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-xs font-black text-white rounded-xl shadow-xl border border-emerald-300/40 uppercase tracking-wider">
          OK / ACCEPT
        </button>
      </div>
    `;
        document.body.appendChild(overlay);
    }
    showAlert(title, message, icon = '⚔️', type = 'info') {
        this.audio.playSound(type === 'error' || type === 'warning' ? 'hit' : 'click');
        const overlay = document.getElementById('rpg-modal-overlay');
        const card = document.getElementById('rpg-modal-card');
        const iconEl = document.getElementById('rpg-modal-icon');
        const titleEl = document.getElementById('rpg-modal-title');
        const msgEl = document.getElementById('rpg-modal-message');
        const btn = document.getElementById('rpg-modal-btn');
        if (!overlay || !card || !titleEl || !msgEl || !btn || !iconEl)
            return;
        iconEl.innerText = icon;
        titleEl.innerText = title;
        msgEl.innerText = message;
        if (type === 'error' || type === 'warning') {
            card.className = 'glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-red-500/80 shadow-2xl text-center relative animate-scaleUp';
            btn.className = 'w-full py-3.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-xs font-black text-white rounded-xl shadow-xl border border-red-300/40 uppercase tracking-wider';
        }
        else if (type === 'success') {
            card.className = 'glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-emerald-400 shadow-2xl text-center relative animate-scaleUp';
            btn.className = 'w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-xs font-black text-white rounded-xl shadow-xl border border-emerald-300/40 uppercase tracking-wider';
        }
        else {
            card.className = 'glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-cyan-500 shadow-2xl text-center relative animate-scaleUp';
            btn.className = 'w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-xs font-black text-white rounded-xl shadow-xl border border-cyan-300/40 uppercase tracking-wider';
        }
        overlay.classList.remove('hidden');
        btn.onclick = () => {
            overlay.classList.add('hidden');
        };
    }
    shortenToastMsg(msg) {
        if (msg.includes('LEVEL UP! FULL HP RECOVERED'))
            return '💚 Level Up! HP Fully Restored';
        if (msg.includes('Auto-Equipped TOP 5 Companion Pet Squad!'))
            return '⚡ Auto-Equipped Top 5 Pet Squad';
        if (msg.includes('Auto-Equipped TOP Gear Loadout!'))
            return '⚡ Auto-Equipped Best Gear Loadout';
        if (msg.includes('AUTO Mode (Battle & Loot Collect) Activated!'))
            return '⚔️ Auto-Battle: ON 🔥';
        if (msg.includes('AUTO Mode Deactivated.'))
            return '⚔️ Auto-Battle: OFF';
        if (msg.includes('Equipped best item into loadout slot!'))
            return '⚡ Equipped Best Item';
        if (msg.includes('Unequipped Companion Pet.'))
            return '🐾 Unequipped Companion Pet';
        if (msg.includes('Sold all duplicate equipment & runes!'))
            return '🪙 Sold All Duplicate Items';
        if (msg.includes('ULTIMATE CUTSCENE EXECUTED! ALL ENEMIES ANNIHILATED!'))
            return '💥 Ultimate Cutscene Executed!';
        return msg;
    }
    showToast(msg, type = 'info') {
        const briefMsg = this.shortenToastMsg(msg);
        const icon = type === 'success' ? '✨' : type === 'warning' ? '⚠️' : '⚡';
        const formatted = `${icon} ${briefMsg}`;
        const latestEl = document.getElementById('feedback-log-latest-text');
        const historyEl = document.getElementById('feedback-log-history-list');
        if (latestEl) {
            latestEl.innerText = formatted;
            latestEl.className = type === 'success' ? 'text-emerald-300 font-bold truncate' :
                type === 'warning' ? 'text-amber-300 font-bold truncate' :
                    'text-cyan-300 font-bold truncate';
        }
        if (historyEl) {
            const item = document.createElement('div');
            item.className = type === 'success' ? 'text-emerald-200 font-mono' :
                type === 'warning' ? 'text-amber-200 font-mono' :
                    'text-cyan-200 font-mono';
            item.innerText = `• ${formatted}`;
            historyEl.prepend(item);
            while (historyEl.children.length > 15) {
                historyEl.removeChild(historyEl.lastChild);
            }
        }
    }
}
exports.UIService = UIService;
