"use strict";
// =========================================================
// SCREEN MANAGER - HANDLES GAME PHASE TRANSITIONS & VIEW LIFECYCLES
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenManager = void 0;
class ScreenManager {
    static instance;
    currentScreen = 'auth';
    registeredScreens = new Map();
    dungeonAfkTimer = null;
    constructor() { }
    static getInstance() {
        if (!ScreenManager.instance) {
            ScreenManager.instance = new ScreenManager();
        }
        return ScreenManager.instance;
    }
    registerScreen(id, screen) {
        this.registeredScreens.set(id, screen);
    }
    resetDungeonAfkTimer() {
        if (this.dungeonAfkTimer) {
            clearTimeout(this.dungeonAfkTimer);
            this.dungeonAfkTimer = null;
        }
        // Disable 5-second Idle AFK auto-transfer when Auto-Battle is ON or Cutscene is active!
        const dungeonScreen = this.registeredScreens.get('dungeon');
        if (dungeonScreen && (dungeonScreen.isAutoBattle || dungeonScreen.isCutsceneActive)) {
            return;
        }
        if (this.currentScreen === 'dungeon') {
            // 5-second Idle Auto-transfer to Grove (IDLE)
            this.dungeonAfkTimer = setTimeout(() => {
                if (this.currentScreen === 'dungeon') {
                    console.log('[AFK] 5 seconds of inactivity in Dungeon. Auto-transferring to Sanctuary Grove (IDLE)...');
                    this.showScreen('idle');
                }
            }, 5000);
        }
    }
    showScreen(screenId) {
        const prevScreen = this.currentScreen;
        if (this.dungeonAfkTimer) {
            clearTimeout(this.dungeonAfkTimer);
            this.dungeonAfkTimer = null;
        }
        // Call onLeave on previous screen
        if (this.registeredScreens.has(prevScreen)) {
            this.registeredScreens.get(prevScreen)?.onLeave?.();
        }
        this.currentScreen = screenId;
        // Hide all top-level screen containers
        const topScreens = ['screen-auth', 'screen-char-create', 'screen-game-world'];
        topScreens.forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.add('hidden');
        });
        if (screenId === 'auth') {
            const el = document.getElementById('screen-auth');
            if (el)
                el.classList.remove('hidden');
        }
        else if (screenId === 'char-create') {
            const el = document.getElementById('screen-char-create');
            if (el)
                el.classList.remove('hidden');
        }
        else {
            // Main Game World View
            const el = document.getElementById('screen-game-world');
            if (el)
                el.classList.remove('hidden');
            // Strictly hide all other sub-views, prioritize ONLY selected target view
            const views = ['dungeon', 'idle', 'tower', 'character', 'companion', 'inventory', 'gacha'];
            views.forEach(v => {
                const viewEl = document.getElementById(`view-${v}`);
                const tabEl = document.getElementById(`view-tab-${v}`);
                if (viewEl) {
                    if (v === screenId)
                        viewEl.classList.remove('hidden');
                    else
                        viewEl.classList.add('hidden');
                }
                if (tabEl) {
                    if (v === screenId) {
                        tabEl.classList.add('active');
                        tabEl.classList.remove('text-emerald-300', 'text-amber-300');
                    }
                    else {
                        tabEl.classList.remove('active');
                        tabEl.classList.add(v === 'gacha' ? 'text-amber-300' : 'text-emerald-300');
                    }
                }
            });
            // HIDE/SHOW PHASER GAME CANVAS (CHARACTER & ENEMIES) & FULLSCREEN PLACE BACKDROP BASED ON NAV SELECTION
            const gameContainer = document.getElementById('game-container');
            const placeBg = document.getElementById('place-fullscreen-bg');
            if (screenId === 'dungeon') {
                if (gameContainer)
                    gameContainer.style.display = 'block';
                if (placeBg)
                    placeBg.classList.add('hidden');
                this.resetDungeonAfkTimer();
            }
            else {
                if (gameContainer)
                    gameContainer.style.display = 'none';
                if (placeBg) {
                    placeBg.classList.remove('hidden');
                    let bgUrl = 'assets/murim_hideout_bg.jpg';
                    switch (screenId) {
                        case 'idle':
                            bgUrl = "assets/murim_hideout_bg.jpg";
                            break;
                        case 'tower':
                            bgUrl = "assets/murim_tower_bg.jpg";
                            break;
                        case 'character':
                            bgUrl = "assets/murim_hideout_bg.jpg";
                            break;
                        case 'companion':
                            bgUrl = "assets/murim_hideout_bg.jpg";
                            break;
                        case 'inventory':
                            bgUrl = "assets/murim_hideout_bg.jpg";
                            break;
                        case 'gacha':
                            bgUrl = "assets/murim_merchant_gacha_bg.jpg";
                            break;
                        default:
                            bgUrl = "assets/murim_hideout_bg.jpg";
                    }
                    placeBg.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.70), rgba(9, 13, 22, 0.85)), url('${bgUrl}')`;
                }
            }
            // DISPLAY CHARACTER STATUS (LVL, HP, EXP) ONLY IN DUNGEON & TOWER VIEWS
            const hudBottomBar = document.getElementById('hud-bottom-bar');
            if (hudBottomBar) {
                if (screenId === 'dungeon' || screenId === 'tower') {
                    hudBottomBar.classList.remove('hidden');
                }
                else {
                    hudBottomBar.classList.add('hidden');
                }
            }
            // SHOW DUNGEON METERS & AUTO BATTLE BUTTON ONLY WHEN IN DUNGEON!
            const isDungeon = screenId === 'dungeon';
            const rightMeters = document.getElementById('hud-bottom-right-meters');
            if (rightMeters) {
                if (isDungeon)
                    rightMeters.classList.remove('hidden');
                else
                    rightMeters.classList.add('hidden');
            }
            ['dungeon-world-tier-container', 'hero-aura-meter-container', 'pet-squad-meter-container', 'soul-killmeter-container', 'dungeon-autobattle-container'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (isDungeon)
                        el.classList.remove('hidden');
                    else
                        el.classList.add('hidden');
                }
            });
        }
        // Call onEnter on newly active screen
        if (this.registeredScreens.has(screenId)) {
            this.registeredScreens.get(screenId)?.onEnter?.();
        }
    }
    getCurrentScreen() {
        return this.currentScreen;
    }
}
exports.ScreenManager = ScreenManager;
