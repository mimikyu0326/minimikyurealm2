"use strict";
// =========================================================
// MINIMIKYU REALM - MAIN CLIENT ENTRY POINT & SCREEN REGISTRATION
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
const gameUtils_1 = require("./gameUtils");
const GameStateService_1 = require("./services/GameStateService");
const AudioService_1 = require("./services/AudioService");
const UIService_1 = require("./services/UIService");
const ScreenManager_1 = require("./screens/ScreenManager");
const AuthScreen_1 = require("./screens/AuthScreen");
const CharacterCreateScreen_1 = require("./screens/CharacterCreateScreen");
const DungeonScreen_1 = require("./screens/DungeonScreen");
const IdleGroveScreen_1 = require("./screens/IdleGroveScreen");
const TowerScreen_1 = require("./screens/TowerScreen");
const CharacterStatsScreen_1 = require("./screens/CharacterStatsScreen");
const CompanionScreen_1 = require("./screens/CompanionScreen");
const InventoryScreen_1 = require("./screens/InventoryScreen");
const GachaScreen_1 = require("./screens/GachaScreen");
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Security Plugins & Server Events
    (0, gameUtils_1.initializeInputLock)();
    const gameState = GameStateService_1.GameStateService.getInstance();
    const audio = AudioService_1.AudioService.getInstance();
    const screenManager = ScreenManager_1.ScreenManager.getInstance();
    // Instantiate Screens
    const authScreen = new AuthScreen_1.AuthScreen((userId, hasCharacter) => {
        // 1. Immediately transition away from login screen into target game screen
        if (hasCharacter) {
            screenManager.showScreen('dungeon');
        }
        else {
            screenManager.showScreen('char-create');
        }
        // 2. Trigger resource preloader modal if needed (now fully visible over the game screen!)
        window.triggerResourceDownloadCheck(() => { });
    });
    const charCreateScreen = new CharacterCreateScreen_1.CharacterCreateScreen(() => {
        screenManager.showScreen('dungeon');
    });
    const dungeonScreen = new DungeonScreen_1.DungeonScreen();
    window.dungeonScreenInstance = dungeonScreen;
    const idleGroveScreen = new IdleGroveScreen_1.IdleGroveScreen();
    const towerScreen = new TowerScreen_1.TowerScreen();
    const charStatsScreen = new CharacterStatsScreen_1.CharacterStatsScreen();
    const companionScreen = new CompanionScreen_1.CompanionScreen();
    const inventoryScreen = new InventoryScreen_1.InventoryScreen();
    const gachaScreen = new GachaScreen_1.GachaScreen();
    // Register Screens into ScreenManager
    screenManager.registerScreen('auth', authScreen);
    screenManager.registerScreen('char-create', charCreateScreen);
    screenManager.registerScreen('dungeon', dungeonScreen);
    screenManager.registerScreen('idle', idleGroveScreen);
    screenManager.registerScreen('tower', towerScreen);
    screenManager.registerScreen('character', charStatsScreen);
    screenManager.registerScreen('companion', companionScreen);
    screenManager.registerScreen('inventory', inventoryScreen);
    screenManager.registerScreen('gacha', gachaScreen);
    // Initialize UI & Event Handlers
    authScreen.init();
    charCreateScreen.init();
    dungeonScreen.init();
    towerScreen.init();
    charStatsScreen.init();
    companionScreen.init();
    inventoryScreen.init();
    gachaScreen.init();
    initializeMobileJoystick(dungeonScreen);
    // Bind Global Window Methods for Inline HTML Attributes
    window.switchAuthTab = (tab) => authScreen.switchTab(tab);
    window.handleFirebaseDbAuth = (e, mode) => authScreen.handleSubmit(e, mode);
    window.toggleFeedbackLogExpand = () => {
        const historyEl = document.getElementById('feedback-log-history-list');
        const toggleBtn = document.getElementById('feedback-log-toggle-btn');
        if (!historyEl || !toggleBtn)
            return;
        const isHidden = historyEl.classList.contains('hidden');
        if (isHidden) {
            historyEl.classList.remove('hidden');
            toggleBtn.innerText = '▼ Collapse';
        }
        else {
            historyEl.classList.add('hidden');
            toggleBtn.innerText = '▲ Expand';
        }
    };
    let onResourceDownloadDoneCallback = null;
    window.triggerResourceDownloadCheck = (onDone) => {
        const isDownloaded = sessionStorage.getItem('minimikyu_resources_downloaded') === 'true';
        if (isDownloaded) {
            onDone();
            return;
        }
        onResourceDownloadDoneCallback = onDone;
        const modal = document.getElementById('modal-resource-downloader');
        if (modal)
            modal.classList.remove('hidden');
    };
    window.startResourceDownloadProcess = () => {
        const btnGroup = document.getElementById('resource-download-btn-group');
        const progressContainer = document.getElementById('resource-progress-container');
        const progressBar = document.getElementById('resource-progress-bar');
        const statusText = document.getElementById('resource-download-status-text');
        const percentText = document.getElementById('resource-download-percent');
        const phaserStatus = document.getElementById('status-pkg-phaser');
        const audioStatus = document.getElementById('status-pkg-audio');
        const firebaseStatus = document.getElementById('status-pkg-firebase');
        const vfxStatus = document.getElementById('status-pkg-vfx');
        if (btnGroup)
            btnGroup.classList.add('hidden');
        if (progressContainer)
            progressContainer.classList.remove('hidden');
        const updateStep = (percent, msg, statusEl) => {
            if (progressBar)
                progressBar.style.width = `${percent}%`;
            if (percentText)
                percentText.innerText = `${percent}%`;
            if (statusText)
                statusText.innerText = msg;
            if (statusEl) {
                statusEl.className = 'text-emerald-400 font-bold font-mono';
                statusEl.innerText = 'DOWNLOADED (OK)';
            }
        };
        setTimeout(() => {
            updateStep(25, 'Downloading Phaser 3 Engine Modules...', phaserStatus);
        }, 400);
        setTimeout(() => {
            updateStep(50, 'Fetching Audio & BGM Performance Cache...', audioStatus);
        }, 900);
        setTimeout(() => {
            updateStep(75, 'Initializing Realtime Firebase DB Sync...', firebaseStatus);
        }, 1400);
        setTimeout(() => {
            updateStep(100, 'Preloading Particle VFX & Reincarnate Sprites...', vfxStatus);
        }, 1900);
        setTimeout(() => {
            sessionStorage.setItem('minimikyu_resources_downloaded', 'true');
            UIService_1.UIService.getInstance().showToast('✅ FULL GAME RESOURCES & ENGINE MODULES READY!', 'success');
            const modal = document.getElementById('modal-resource-downloader');
            if (modal)
                modal.classList.add('hidden');
            if (onResourceDownloadDoneCallback) {
                onResourceDownloadDoneCallback();
                onResourceDownloadDoneCallback = null;
            }
        }, 2400);
    };
    window.handleCharacterCreate = (e) => charCreateScreen.handleCreate(e);
    window.selectJobClass = (jobClass) => charCreateScreen.selectClass(jobClass);
    window.manualFloatingSaveProgress = () => {
        const gameState = GameStateService_1.GameStateService.getInstance();
        const ui = UIService_1.UIService.getInstance();
        const audio = AudioService_1.AudioService.getInstance();
        // DOUBLE SAFETY MEASURE: Recalculate CP -> Save to Firebase DB -> Save to LocalStorage
        gameState.recalculateCP();
        gameState.flushSaveToFirebase();
        gameState.saveToLocalStorage();
        // Visual button scale, pulse & ring bounce animation on in-game save button
        const btn = document.querySelector('#floating-save-btn-container button');
        if (btn) {
            btn.classList.add('scale-110', 'ring-4', 'ring-emerald-300', 'shadow-[0_0_40px_rgba(16,185,129,1)]', 'animate-pulse');
            setTimeout(() => {
                btn.classList.remove('scale-110', 'ring-4', 'ring-emerald-300', 'shadow-[0_0_40px_rgba(16,185,129,1)]', 'animate-pulse');
            }, 850);
        }
        audio.playSound('levelup');
        ui.showToast('💾 Game Progress Saved to Firebase Realtime Database!', 'success');
    };
    window.triggerDoubleSafetySave = window.manualFloatingSaveProgress;
    window.switchGameView = (view) => screenManager.showScreen(view);
    window.dungeonScreenInstance = dungeonScreen;
    window.triggerAttack = () => dungeonScreen.triggerAttack();
    window.usePotion = () => inventoryScreen.usePotion();
    window.addStatPoint = (stat) => charStatsScreen.allocate(stat);
    window.rollGacha = (count) => gachaScreen.roll(count);
    window.switchGachaBanner = (banner) => gachaScreen.switchBanner(banner);
    window.collectGachaWithBagShakeEffect = () => gachaScreen.collectWithBagShakeEffect();
    window.toggleGachaItemPreviewModal = (show) => {
        const modal = document.getElementById('modal-gacha-item-preview');
        if (modal) {
            if (show)
                modal.classList.remove('hidden');
            else
                modal.classList.add('hidden');
        }
    };
    window.toggleCompanionDetailModal = (show) => {
        const modal = document.getElementById('modal-companion-detail');
        if (modal) {
            if (show)
                modal.classList.remove('hidden');
            else
                modal.classList.add('hidden');
        }
    };
    window.challengeTowerFloor = () => towerScreen.challengeFloor();
    window.triggerSuperPetModeFromDOM = () => {
        if (dungeonScreen)
            dungeonScreen.triggerSuperPetMode();
    };
    window.triggerHeroTitanAuraModeFromDOM = () => {
        if (dungeonScreen)
            dungeonScreen.triggerHeroTitanAuraMode();
    };
    window.triggerSoulCutscene = () => {
        if (dungeonScreen)
            dungeonScreen.triggerSoulCutscene();
    };
    window.autoConvertGachaCurrencies = () => {
        if (gachaScreen)
            gachaScreen.autoConvertCurrenciesToWishTokens();
    };
    window.toggleFeedbackLogBar = () => {
        const list = document.getElementById('feedback-log-history-list');
        const btn = document.getElementById('feedback-log-toggle-btn');
        if (!list || !btn)
            return;
        if (list.classList.contains('hidden')) {
            list.classList.remove('hidden');
            btn.innerText = '▼ MINIMIZE';
        }
        else {
            list.classList.add('hidden');
            btn.innerText = '▲ EXPAND';
        }
    };
    window.handleVolumeChange = (val) => {
        const num = parseInt(val, 10);
        const audio = AudioService_1.AudioService.getInstance();
        audio.setVolume(num / 100);
        const label = document.getElementById('setting-volume-label');
        if (label)
            label.innerText = `${num}%`;
    };
    window.toggleDeleteAccountModal = (show) => {
        const modal = document.getElementById('modal-delete-account-confirm');
        if (modal) {
            if (show)
                modal.classList.remove('hidden');
            else
                modal.classList.add('hidden');
        }
    };
    window.confirmPermanentDeleteUserAccount = async () => {
        const modal = document.getElementById('modal-delete-account-confirm');
        if (modal)
            modal.classList.add('hidden');
        const ui = UIService_1.UIService.getInstance();
        ui.showToast('💣 Deleting account data permanently...', 'warning');
        const gameState = GameStateService_1.GameStateService.getInstance();
        await gameState.deleteUserAccountPermanent();
    };
    window.toggleAscendWarningModal = (show) => {
        const modal = document.getElementById('modal-ascend-warning');
        if (!modal)
            return;
        if (show) {
            const reqLvl = gameState.getAscensionReqLevel();
            const warnReq = document.getElementById('warn-asc-req');
            if (warnReq)
                warnReq.innerText = reqLvl.toString();
            modal.classList.remove('hidden');
            audio.playSound('potion');
        }
        else {
            modal.classList.add('hidden');
        }
    };
    window.confirmAscendMountainPeak = () => {
        const modal = document.getElementById('modal-ascend-warning');
        if (modal)
            modal.classList.add('hidden');
        const result = gameState.performAscension();
        if (!result.success) {
            UIService_1.UIService.getInstance().showToast(result.message, 'warning');
            return;
        }
        const reinOverlay = document.getElementById('reincarnate-overlay');
        const reinSubText = document.getElementById('rein-sub-text');
        if (reinOverlay) {
            const reinLvl = gameState.state.ascensionLevel || 1;
            const boostPct = reinLvl * 5;
            if (reinSubText)
                reinSubText.innerText = `REIN ${reinLvl} (+${boostPct}% STACKING EXP, GOLD & CURRENCY GAINS)`;
            reinOverlay.classList.remove('hidden');
            audio.playSound('levelup');
            setTimeout(() => {
                reinOverlay.classList.add('hidden');
                screenManager.showScreen('dungeon');
                UIService_1.UIService.getInstance().showToast(`✨ GOLD REINCARNATION COMPLETE (REIN ${reinLvl})! Teleported to Dungeon Lvl 1!`, 'success');
            }, 3000);
        }
    };
    let prologueScrollInterval = null;
    window.showPrologueScrollModal = () => {
        const overlay = document.getElementById('cinematic-prologue-overlay');
        const textBlock = document.getElementById('prologue-text-block');
        const storyScroll = document.getElementById('prologue-story-scroll');
        const titleReveal = document.getElementById('prologue-title-reveal');
        if (!overlay || !textBlock || !storyScroll || !titleReveal)
            return;
        // Reset States & Show Black Overlay
        overlay.classList.remove('hidden');
        overlay.style.opacity = '1';
        textBlock.classList.remove('hidden');
        textBlock.style.opacity = '1';
        titleReveal.classList.add('hidden');
        titleReveal.style.opacity = '0';
        titleReveal.style.transform = 'scale(0.5)';
        storyScroll.scrollTop = 0;
        audio.playSound('levelup');
        if (prologueScrollInterval)
            clearInterval(prologueScrollInterval);
        let isEndingTriggered = false;
        prologueScrollInterval = setInterval(() => {
            if (storyScroll) {
                storyScroll.scrollTop += 1.4;
                // Check if reached bottom of story
                if (!isEndingTriggered && storyScroll.scrollTop + storyScroll.clientHeight >= storyScroll.scrollHeight - 15) {
                    isEndingTriggered = true;
                    clearInterval(prologueScrollInterval);
                    prologueScrollInterval = null;
                    // Step 3: Story text slowly disappears (fade out)
                    textBlock.style.opacity = '0';
                    setTimeout(() => {
                        textBlock.classList.add('hidden');
                        titleReveal.classList.remove('hidden');
                        // Step 4: Game Title appears with Fade & Zoom-In animation
                        setTimeout(() => {
                            titleReveal.style.opacity = '1';
                            titleReveal.style.transform = 'scale(1.0)';
                            audio.playSound('levelup');
                        }, 50);
                        // Title stays for 3 seconds then disappears
                        setTimeout(() => {
                            titleReveal.style.opacity = '0';
                            titleReveal.style.transform = 'scale(1.2)';
                            // Step 5: Fade out overlay & return to Dungeon with Credits Modal Open
                            setTimeout(() => {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    overlay.classList.add('hidden');
                                    screenManager.showScreen('dungeon');
                                    window.toggleGameCreditsModal(true);
                                }, 700);
                            }, 800);
                        }, 3200);
                    }, 1000);
                }
            }
        }, 30);
    };
    window.skipCinematicPrologue = () => {
        if (prologueScrollInterval) {
            clearInterval(prologueScrollInterval);
            prologueScrollInterval = null;
        }
        const overlay = document.getElementById('cinematic-prologue-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
                screenManager.showScreen('dungeon');
                window.toggleGameCreditsModal(true);
            }, 300);
        }
    };
    window.toggleGameCreditsModal = (show) => {
        const modal = document.getElementById('modal-game-credits');
        if (!modal)
            return;
        if (show) {
            modal.classList.remove('hidden');
            audio.playSound('levelup');
        }
        else {
            modal.classList.add('hidden');
        }
    };
    window.toggleAutoSellSettings = (show) => {
        const modal = document.getElementById('modal-autosell-settings');
        if (!modal)
            return;
        if (show) {
            modal.classList.remove('hidden');
            audio.playSound('potion');
            window.updateAutoSellBadges();
        }
        else {
            modal.classList.add('hidden');
        }
    };
    window.toggleAccountSettingsModal = (show) => {
        const modal = document.getElementById('modal-account-settings');
        if (!modal)
            return;
        if (show) {
            window.updateSFXButtonUI();
            modal.classList.remove('hidden');
            audio.playSound('potion');
        }
        else {
            modal.classList.add('hidden');
        }
    };
    window.toggleSFXFromUI = () => {
        const isEnabled = audio.toggleSFX();
        window.updateSFXButtonUI(isEnabled);
        const { UIService } = require('./services/UIService');
        UIService.getInstance().showToast(isEnabled ? '🔊 Sound Effects (SFX) Enabled' : '🔇 Sound Effects (SFX) Muted (BGM Active)', isEnabled ? 'success' : 'warning');
    };
    window.updateSFXButtonUI = (isEnabled) => {
        const active = typeof isEnabled === 'boolean' ? isEnabled : audio.isSfxActive();
        const btn = document.getElementById('btn-toggle-sfx-settings');
        if (btn) {
            if (active) {
                btn.className = 'px-3.5 py-2 rounded-xl text-xs font-black transition border shadow-lg shrink-0 cursor-pointer bg-emerald-600 text-white border-emerald-400';
                btn.innerText = 'SFX: ON ⚡';
            }
            else {
                btn.className = 'px-3.5 py-2 rounded-xl text-xs font-black transition border shadow-lg shrink-0 cursor-pointer bg-red-950 text-red-300 border-red-600';
                btn.innerText = 'SFX: OFF 🔇';
            }
        }
    };
    window.handleChangeHeroName = () => {
        const input = document.getElementById('setting-new-name');
        if (!input || !input.value.trim())
            return;
        const newName = input.value.trim();
        gameState.state.name = newName;
        gameState.notify();
        gameState.saveToFirebase();
        input.value = '';
        audio.playSound('levelup');
        UIService_1.UIService.getInstance().showToast(`Hero name updated to: ${newName}!`, 'success');
    };
    window.handleChangePassword = () => {
        const input = document.getElementById('setting-new-password');
        if (!input || input.value.length < 4)
            return;
        const newPass = input.value;
        const userId = gameState.getUserId();
        if (userId && window.FirebaseApp) {
            const { db, ref, update } = window.FirebaseApp;
            update(ref(db, `users/${userId}`), { password: newPass });
            input.value = '';
            audio.playSound('levelup');
            UIService_1.UIService.getInstance().showToast('🔒 Password updated successfully!', 'success');
        }
    };
    window.updateAutoSellBadges = () => {
        const autoSell = gameState.state.autoSell || { common: false, rare: false, legendary: false, mythic: false, keepRunes: true };
        ['common', 'rare', 'legendary', 'mythic'].forEach(r => {
            const badge = document.getElementById(`badge-autosell-${r}`);
            const isON = autoSell[r];
            if (badge) {
                badge.innerText = isON ? 'ON ✔️' : 'OFF';
                badge.className = isON ? 'text-[10px] px-2 py-0.5 rounded font-black bg-emerald-600 text-white' : 'text-[10px] px-2 py-0.5 rounded font-bold bg-gray-800 text-gray-400';
            }
        });
    };
    window.toggleRarityAutoSell = (rarity) => {
        if (!gameState.state.autoSell)
            gameState.state.autoSell = { common: false, rare: false, legendary: false, mythic: false, keepRunes: true };
        gameState.state.autoSell[rarity] = !gameState.state.autoSell[rarity];
        audio.playSound('potion');
        gameState.notify();
        gameState.saveToFirebase();
        window.updateAutoSellBadges();
    };
    window.toggleHeroSystemModal = (show) => {
        const modal = document.getElementById('modal-hero-system');
        if (!modal)
            return;
        if (show) {
            gameState.updateHeroSystemModal();
            modal.classList.remove('hidden');
            audio.playSound('potion');
        }
        else {
            modal.classList.add('hidden');
        }
    };
    window.handleSignOut = () => {
        const accountModal = document.getElementById('modal-account-settings');
        if (accountModal)
            accountModal.classList.add('hidden');
        localStorage.removeItem('minimikyu_logged_user');
        gameState.setUserId(null);
        screenManager.showScreen('auth');
        gameState.logCombat('[AUTH] Signed out of realm.');
    };
    // BGM & AUDIO PLUGIN CONTROLS (DEFAULT ON: "I Really Want to Stay at Your House")
    const autoPlayBGMOnInteraction = () => {
        if (audio.isBgmActive()) {
            audio.startBGM(true);
            const btn = document.getElementById('btn-toggle-bgm');
            if (btn) {
                btn.innerHTML = `<span>🎵 BGM: ON (I Really Want to Stay at Your House)</span>`;
                btn.className = `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]`;
            }
        }
    };
    window.addEventListener('click', autoPlayBGMOnInteraction, { once: true });
    window.addEventListener('keydown', autoPlayBGMOnInteraction, { once: true });
    window.addEventListener('touchstart', autoPlayBGMOnInteraction, { once: true });
    window.toggleBGMFromUI = () => {
        const isPlaying = audio.toggleBGM();
        const btn = document.getElementById('btn-toggle-bgm');
        if (btn) {
            btn.innerHTML = isPlaying ? `<span>🎵 BGM: ON (I Really Want to Stay at Your House)</span>` : `<span>🎵 BGM: OFF</span>`;
            btn.className = isPlaying
                ? `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]`
                : `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs transition flex items-center gap-1.5 shadow`;
        }
    };
    window.setBGMVolumeFromUI = (val) => {
        audio.setVolume(parseFloat(val));
    };
    // LOGIN SHOWCASE INTERACTIVE TABS
    window.switchShowcaseTab = (tab) => {
        const tabs = ['classes', 'gear', 'pets', 'auras', 'modes'];
        tabs.forEach(t => {
            const btn = document.getElementById(`showcase-tab-${t}`);
            const content = document.getElementById(`showcase-content-${t}`);
            if (btn && content) {
                if (t === tab) {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition bg-emerald-600/90 text-white border border-emerald-400 whitespace-nowrap shadow-md';
                    content.classList.remove('hidden');
                }
                else {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-bold transition text-emerald-300 hover:text-white bg-slate-950/60 border border-emerald-900 whitespace-nowrap';
                    content.classList.add('hidden');
                }
            }
        });
        if (tab === 'auras') {
            window.selectAuraPreview('flame');
        }
    };
    // QUICK DEMO ACCOUNT FILLER
    window.quickFillAuthDemo = () => {
        const idInput = document.getElementById('auth-userid');
        const passInput = document.getElementById('auth-password');
        if (idInput && passInput) {
            idInput.value = 'kyu_hero_demo';
            passInput.value = '123456';
            audio.playSound('potion');
            UIService_1.UIService.getInstance().showToast('⚡ Demo credentials filled!', 'info');
        }
    };
    // DOUBLE SAFETY SAVE MODAL WITH SPINNER & BIG SAVE TITLE
    window.triggerDoubleSafetySave = () => {
        const audio = AudioService_1.AudioService.getInstance();
        audio.playSound('levelup');
        const overlay = document.createElement('div');
        overlay.id = 'modal-double-safety-save';
        overlay.className = 'fixed inset-0 z-50 pointer-events-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-500 animate-scaleUp';
        overlay.innerHTML = `
      <div id="save-phase-loading" class="flex flex-col items-center justify-center space-y-4">
        <div class="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.8)]"></div>
        <div class="text-sm font-black text-emerald-300 uppercase tracking-widest font-mono animate-pulse">
          💾 SAVING PROGRESS TO FIREBASE DB & LOCALSTORAGE...
        </div>
      </div>

      <div id="save-phase-complete" class="hidden flex flex-col items-center justify-center space-y-3 animate-scaleUp">
        <div class="text-6xl md:text-7xl mb-2 animate-bounce drop-shadow-[0_0_35px_rgba(16,185,129,1)]">💾</div>
        <h1 class="text-3xl md:text-5xl font-black text-emerald-300 uppercase tracking-widest font-mono drop-shadow-[0_0_25px_rgba(16,185,129,0.9)]" style="font-family: 'Cinzel Decorative', 'Bebas Neue', monospace; -webkit-text-stroke: 1px #ffffff;">
          DATA SAVED SUCCESSFULLY
        </h1>
        <p class="text-xs md:text-sm font-mono font-bold text-amber-300 uppercase tracking-wider bg-emerald-950/90 px-4 py-1.5 rounded-full border border-emerald-500/80 shadow-lg">
          ✨ DOUBLE SAFETY RECORD SYNCHRONIZED WITH FIREBASE DB
        </p>
      </div>
    `;
        document.body.appendChild(overlay);
        gameState.flushSaveToFirebase();
        gameState.saveToLocalStorage();
        setTimeout(() => {
            const loadingDiv = document.getElementById('save-phase-loading');
            const completeDiv = document.getElementById('save-phase-complete');
            if (loadingDiv && completeDiv) {
                loadingDiv.classList.add('hidden');
                completeDiv.classList.remove('hidden');
                audio.playSound('levelup');
            }
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 400);
            }, 1400);
        }, 900);
    };
    // LIVE AURA CANVAS PREVIEW FOR ALL 6 HERO TITAN AURAS
    let auraAnimFrame = null;
    window.selectAuraPreview = (auraType) => {
        const canvas = document.getElementById('aura-preview-canvas');
        const label = document.getElementById('aura-preview-label');
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        if (auraAnimFrame)
            cancelAnimationFrame(auraAnimFrame);
        const colors = {
            flame: { label: '🔥 Solar Nova', primary: '#ef4444', secondary: '#f97316' },
            frost: { label: '❄️ Glacial Void', primary: '#06b6d4', secondary: '#3b82f6' },
            thunder: { label: '⚡ Abyssal Arc', primary: '#a855f7', secondary: '#c084fc' },
            celestial: { label: '✨ Sovereign Starlight', primary: '#fbbf24', secondary: '#fef08a' },
            void: { label: '🌌 Netherlord Void', primary: '#8b5cf6', secondary: '#d8b4fe' },
            dragon: { label: '🐉 Dragon Sovereign', primary: '#10b981', secondary: '#6ee7b7' }
        };
        const cfg = colors[auraType] || colors.flame;
        if (label)
            label.innerText = cfg.label;
        let angle = 0;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            angle += 0.04;
            // Draw Glowing Center Core
            const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
            grad.addColorStop(0, cfg.primary);
            grad.addColorStop(0.7, cfg.secondary);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI * 2);
            ctx.fill();
            // Draw Orbiting Particles
            for (let i = 0; i < 6; i++) {
                const pAngle = angle + (i * Math.PI / 3);
                const px = cx + Math.cos(pAngle) * 36;
                const py = cy + Math.sin(pAngle) * 36;
                ctx.fillStyle = cfg.secondary;
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            auraAnimFrame = requestAnimationFrame(render);
        };
        render();
    };
    // DYNAMIC STARFIELD & MAGIC PARTICLES BACKGROUND CANVAS FOR AUTH SCREEN
    const authCanvas = document.getElementById('auth-bg-canvas');
    if (authCanvas) {
        const ctx = authCanvas.getContext('2d');
        if (ctx) {
            let width = (authCanvas.width = window.innerWidth);
            let height = (authCanvas.height = window.innerHeight);
            window.addEventListener('resize', () => {
                width = authCanvas.width = window.innerWidth;
                height = authCanvas.height = window.innerHeight;
            });
            const particles = [];
            for (let i = 0; i < 70; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2.5 + 0.8,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.8 + 0.2
                });
            }
            const animateBg = () => {
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    if (p.x < 0)
                        p.x = width;
                    if (p.x > width)
                        p.x = 0;
                    if (p.y < 0)
                        p.y = height;
                    if (p.y > height)
                        p.y = 0;
                    ctx.fillStyle = `rgba(52, 211, 153, ${p.opacity})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(animateBg);
            };
            animateBg();
        }
    }
    // Fetch Server Health & Maintenance status
    fetch('/api/health')
        .then(res => res.json())
        .then(data => {
        (0, gameUtils_1.handleServerEvents)({
            isMaintenance: data.isMaintenance || false,
            announcement: data.announcement || ''
        });
    })
        .catch(() => { });
    function initializeMobileJoystick(dungeonScreen) {
        const joystickContainer = document.getElementById('mobile-joystick-container');
        const joystickBase = document.getElementById('joystick-base');
        const joystickThumb = document.getElementById('joystick-thumb');
        if (!joystickContainer || !joystickBase || !joystickThumb)
            return;
        let activeTouchId = null;
        let startX = 0;
        let startY = 0;
        const maxRadius = 36;
        joystickContainer.style.position = 'fixed';
        joystickContainer.style.opacity = '0';
        joystickContainer.style.pointerEvents = 'none';
        joystickContainer.style.transition = 'opacity 0.12s ease-out';
        const viewDungeon = document.getElementById('view-dungeon') || document.getElementById('game-container');
        const handleGlobalTouchStart = (e) => {
            if (activeTouchId !== null)
                return;
            const target = e.target;
            if (target.closest('button, nav, header, input, a, select, textarea, .glass-panel:not(#mobile-joystick-container)')) {
                return;
            }
            const touch = e.changedTouches[0];
            activeTouchId = touch.identifier;
            startX = touch.clientX;
            startY = touch.clientY;
            joystickContainer.style.left = `${startX}px`;
            joystickContainer.style.top = `${startY}px`;
            joystickContainer.style.transform = 'translate(-50%, -50%)';
            joystickContainer.style.opacity = '1';
            joystickContainer.style.display = 'block';
            joystickThumb.style.transform = 'translate(-50%, -50%)';
            dungeonScreen.setJoystickDirection(0, 0);
        };
        const handleGlobalTouchMove = (e) => {
            if (activeTouchId === null)
                return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeTouchId) {
                    updateJoystickPosition(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                    break;
                }
            }
        };
        const handleGlobalTouchEnd = (e) => {
            if (activeTouchId === null)
                return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === activeTouchId) {
                    activeTouchId = null;
                    joystickThumb.style.transform = 'translate(-50%, -50%)';
                    joystickContainer.style.opacity = '0';
                    dungeonScreen.setJoystickDirection(0, 0);
                    break;
                }
            }
        };
        const updateJoystickPosition = (clientX, clientY) => {
            let deltaX = clientX - startX;
            let deltaY = clientY - startY;
            const dist = Math.hypot(deltaX, deltaY);
            if (dist > maxRadius) {
                deltaX = (deltaX / dist) * maxRadius;
                deltaY = (deltaY / dist) * maxRadius;
            }
            joystickThumb.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            const normX = deltaX / maxRadius;
            const normY = deltaY / maxRadius;
            dungeonScreen.setJoystickDirection(normX, normY);
        };
        if (viewDungeon) {
            viewDungeon.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
        }
        window.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
        window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
        window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleGlobalTouchEnd, { passive: true });
    }
    console.log('🚀 [MINIMIKYU RPG] Client Engine initialized with modular screens!');
});
