// =========================================================
// AUTO BATTLE SERVICE - HANDLES AUTO COMBAT STATE & METER BADGES
// =========================================================

export class AutoBattleService {
  private static instance: AutoBattleService;
  private isAutoBattle: boolean = false;

  private constructor() {}

  public static getInstance(): AutoBattleService {
    if (!AutoBattleService.instance) {
      AutoBattleService.instance = new AutoBattleService();
    }
    return AutoBattleService.instance;
  }

  public isAuto(): boolean {
    return this.isAutoBattle;
  }

  public setAuto(enabled: boolean): void {
    this.isAutoBattle = enabled;
    this.updateAutoBattleUI();
  }

  public toggle(): boolean {
    this.isAutoBattle = !this.isAutoBattle;
    this.updateAutoBattleUI();
    return this.isAutoBattle;
  }

  public updateAutoBattleUI(): void {
    const btn = document.getElementById('btn-toggle-autobattle');
    const icon = document.getElementById('autobattle-repeat-icon');
    const statusText = document.getElementById('autobattle-status-text');

    const auraBadge = document.getElementById('meter-auto-badge-aura');
    const petBadge = document.getElementById('meter-auto-badge-pet');
    const soulBadge = document.getElementById('meter-auto-badge-soul');

    if (this.isAutoBattle) {
      if (btn) {
        btn.className = 'px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl glass-panel border-2 border-amber-400 bg-gradient-to-r from-amber-600 via-amber-700 to-black text-amber-200 font-black text-xs md:text-sm flex items-center gap-1.5 shadow-[0_0_30px_rgba(251,191,36,0.9)] ring-4 ring-amber-400 transition hover:scale-105 active:scale-95 cursor-pointer';
      }
      if (icon) {
        icon.className = 'text-lg md:text-xl transition inline-block animate-spin text-amber-300';
      }
      if (statusText) {
        statusText.innerText = 'AUTO ⚡';
        statusText.className = 'tracking-wider text-amber-300 font-black';
      }

      // Display AUTO badge on Bankai, Pet Rush, and Soul Kill meters
      [auraBadge, petBadge, soulBadge].forEach(badge => {
        if (badge) badge.classList.remove('hidden');
      });
    } else {
      if (btn) {
        btn.className = 'px-3.5 py-2.5 md:px-4 md:py-3 rounded-2xl glass-panel border-2 border-emerald-500/80 bg-gradient-to-r from-slate-950 via-emerald-950 to-black text-emerald-300 font-black text-xs md:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition hover:scale-105 active:scale-95 cursor-pointer';
      }
      if (icon) {
        icon.className = 'text-lg md:text-xl transition inline-block text-emerald-300';
      }
      if (statusText) {
        statusText.innerText = 'AUTO';
        statusText.className = 'tracking-wider text-emerald-300 font-bold';
      }

      // Hide AUTO badge on Bankai, Pet Rush, and Soul Kill meters
      [auraBadge, petBadge, soulBadge].forEach(badge => {
        if (badge) badge.classList.add('hidden');
      });
    }
  }
}
