"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
class AuthScreen {
    onAuthSuccess;
    mode = 'login';
    gameState = GameStateService_1.GameStateService.getInstance();
    constructor(onAuthSuccess) {
        this.onAuthSuccess = onAuthSuccess;
    }
    init() {
        const loginTab = document.getElementById('auth-tab-login');
        const registerTab = document.getElementById('auth-tab-register');
        const loginForm = document.getElementById('form-login-container');
        const registerForm = document.getElementById('form-register-container');
        if (loginTab)
            loginTab.onclick = () => this.switchTab('login');
        if (registerTab)
            registerTab.onclick = () => this.switchTab('register');
        if (loginForm)
            loginForm.onsubmit = (e) => this.handleSubmit(e, 'login');
        if (registerForm)
            registerForm.onsubmit = (e) => this.handleSubmit(e, 'register');
        this.checkExistingSession();
        this.loadRememberedCredentials();
    }
    onEnter() {
        const errDiv = document.getElementById('auth-error');
        if (errDiv)
            errDiv.classList.add('hidden');
        this.loadRememberedCredentials();
    }
    onLeave() { }
    loadRememberedCredentials() {
        const isRemember = localStorage.getItem('minimikyu_remember_me') === 'true';
        const rememberedUser = localStorage.getItem('minimikyu_remembered_userid');
        const rememberedPass = localStorage.getItem('minimikyu_remembered_password');
        const rememberCheck = document.getElementById('auth-remember-me');
        const loginUser = document.getElementById('login-userid');
        const loginPass = document.getElementById('login-password');
        if (rememberCheck)
            rememberCheck.checked = isRemember;
        if (isRemember && rememberedUser && rememberedPass) {
            if (loginUser)
                loginUser.value = rememberedUser;
            if (loginPass) {
                try {
                    loginPass.value = (0, GameStateService_1.decryptData)(rememberedPass);
                }
                catch (e) {
                    loginPass.value = rememberedPass;
                }
            }
        }
    }
    switchTab(tab) {
        this.mode = tab;
        const loginTab = document.getElementById('auth-tab-login');
        const registerTab = document.getElementById('auth-tab-register');
        const loginForm = document.getElementById('form-login-container');
        const registerForm = document.getElementById('form-register-container');
        const errDiv = document.getElementById('auth-error');
        if (errDiv)
            errDiv.classList.add('hidden');
        if (loginTab && registerTab && loginForm && registerForm) {
            if (tab === 'login') {
                loginTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-black transition text-white bg-emerald-600 shadow-md';
                registerTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold transition text-emerald-400 hover:text-white';
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            }
            else {
                registerTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-black transition text-white bg-emerald-600 shadow-md';
                loginTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold transition text-emerald-400 hover:text-white';
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            }
        }
    }
    async checkExistingSession() {
        const { getSessionCookie, setSessionCookie } = require('../services/GameStateService');
        const loggedUserCookie = getSessionCookie('minimikyu_logged_user') || getSessionCookie('minimikyurealm_logged_user');
        const loggedUserStorage = localStorage.getItem('minimikyu_logged_user') || localStorage.getItem('minimikyurealm_logged_user');
        const loggedUser = loggedUserCookie || loggedUserStorage;
        if (loggedUser) {
            const FirebaseApp = window.FirebaseApp;
            if (FirebaseApp) {
                const { db, ref, child, get } = FirebaseApp;
                try {
                    const snapshot = await get(child(ref(db), `users/${loggedUser}`));
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        const savedChar = userData.character || (userData.name ? userData : null);
                        this.gameState.setUserId(loggedUser);
                        setSessionCookie('minimikyu_logged_user', loggedUser, 7);
                        setSessionCookie('minimikyurealm_logged_user', loggedUser, 7);
                        localStorage.setItem('minimikyu_logged_user', loggedUser);
                        localStorage.setItem('minimikyurealm_logged_user', loggedUser);
                        if (savedChar) {
                            this.gameState.loadFromSavedCharacter(savedChar);
                        }
                        else {
                            this.gameState.resetStateToDefault(loggedUser);
                        }
                        this.gameState.listenToFirebase();
                        this.onAuthSuccess(loggedUser, true);
                    }
                }
                catch (e) {
                    console.warn('[AUTH] Error restoring Firebase session:', e);
                }
            }
        }
    }
    async handleSubmit(e, forcedMode) {
        e.preventDefault();
        const mode = forcedMode || this.mode;
        const errDiv = document.getElementById('auth-error');
        let userIdInput = '';
        let passwordInput = '';
        let submitBtn = null;
        let originalBtnText = '';
        if (mode === 'register') {
            userIdInput = document.getElementById('reg-userid')?.value.trim();
            passwordInput = document.getElementById('reg-password')?.value;
            submitBtn = document.getElementById('register-submit-btn');
            originalBtnText = '✨ CREATE NEW ACCOUNT & START PLAYING';
        }
        else {
            userIdInput = document.getElementById('login-userid')?.value.trim();
            passwordInput = document.getElementById('login-password')?.value;
            submitBtn = document.getElementById('login-submit-btn');
            originalBtnText = 'ENTER REALM (SIGN IN)';
        }
        const isRememberChecked = document.getElementById('auth-remember-me')?.checked;
        if (!userIdInput || !passwordInput) {
            if (errDiv) {
                errDiv.innerText = 'Please enter both User ID and Secret Password.';
                errDiv.classList.remove('hidden');
            }
            return;
        }
        if (errDiv)
            errDiv.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = mode === 'register' ? '⏳ CREATING ACCOUNT...' : '⏳ SIGNING IN...';
        }
        const FirebaseApp = window.FirebaseApp;
        if (!FirebaseApp) {
            if (errDiv) {
                errDiv.innerText = 'Connecting to Firebase database... Please try again in 2 seconds.';
                errDiv.classList.remove('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
            return;
        }
        const { db, ref, get, child, set } = FirebaseApp;
        try {
            const userRef = child(ref(db), `users/${userIdInput}`);
            const snapshot = await get(userRef);
            if (isRememberChecked && mode === 'login') {
                localStorage.setItem('minimikyu_remember_me', 'true');
                localStorage.setItem('minimikyu_remembered_userid', userIdInput);
                localStorage.setItem('minimikyu_remembered_password', (0, GameStateService_1.encryptData)(passwordInput));
            }
            if (mode === 'register') {
                if (snapshot.exists()) {
                    throw new Error(`User ID "${userIdInput}" is already taken. Please choose another ID.`);
                }
                const { deleteSessionCookie, setSessionCookie } = require('../services/GameStateService');
                deleteSessionCookie('minimikyu_logged_user');
                deleteSessionCookie('minimikyurealm_logged_user');
                localStorage.removeItem('minimikyu_logged_user');
                localStorage.removeItem('minimikyurealm_logged_user');
                localStorage.removeItem('minimikyurealm_state');
                this.gameState.resetStateToDefault(userIdInput);
                const defaultState = this.gameState.getDefaultState(userIdInput);
                const encryptedPass = (0, GameStateService_1.encryptData)(passwordInput);
                const newUserRecord = {
                    userId: userIdInput,
                    password: encryptedPass,
                    createdAt: Date.now(),
                    gold: defaultState.gold,
                    gems: defaultState.gems,
                    redGems: defaultState.redGems,
                    purpleGems: defaultState.purpleGems,
                    skillTomes: defaultState.skillTomes,
                    ancientBooks: defaultState.ancientBooks,
                    towerKeys: defaultState.towerKeys,
                    level: defaultState.level,
                    exp: defaultState.exp,
                    maxExp: defaultState.maxExp,
                    cp: defaultState.cp,
                    str: defaultState.str,
                    int: defaultState.int,
                    agi: defaultState.agi,
                    vit: defaultState.vit,
                    hp: defaultState.hp,
                    maxHp: defaultState.maxHp,
                    statPoints: defaultState.statPoints,
                    ascensionLevel: defaultState.ascensionLevel,
                    towerFloor: defaultState.towerFloor,
                    worldTier: defaultState.worldTier,
                    wave: defaultState.wave,
                    waveKills: defaultState.waveKills
                };
                await set(ref(db, `users/${userIdInput}`), newUserRecord);
                this.gameState.setUserId(userIdInput);
                setSessionCookie('minimikyu_logged_user', userIdInput, 7);
                setSessionCookie('minimikyurealm_logged_user', userIdInput, 7);
                localStorage.setItem('minimikyu_logged_user', userIdInput);
                localStorage.setItem('minimikyurealm_logged_user', userIdInput);
                this.gameState.flushSaveToFirebase();
                this.gameState.listenToFirebase();
                this.gameState.logCombat(`[AUTH] Account created for User ID: ${userIdInput}`);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
                this.onAuthSuccess(userIdInput, true);
            }
            else {
                if (!snapshot.exists()) {
                    throw new Error(`User ID "${userIdInput}" not found. Click "Create Account" tab to register.`);
                }
                const userData = snapshot.val();
                const encryptedPass = (0, GameStateService_1.encryptData)(passwordInput);
                if (userData.password !== passwordInput && userData.password !== encryptedPass) {
                    throw new Error('Incorrect password for this User ID.');
                }
                const verifiedUserId = userData.userId || userIdInput;
                const { setSessionCookie } = require('../services/GameStateService');
                this.gameState.setUserId(verifiedUserId);
                setSessionCookie('minimikyu_logged_user', verifiedUserId, 7);
                setSessionCookie('minimikyurealm_logged_user', verifiedUserId, 7);
                localStorage.setItem('minimikyu_logged_user', verifiedUserId);
                localStorage.setItem('minimikyurealm_logged_user', verifiedUserId);
                this.gameState.logCombat(`[AUTH] User ID "${verifiedUserId}" authenticated from Firebase DB.`);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
                const savedChar = userData.character || (userData.name ? userData : null);
                if (savedChar) {
                    this.gameState.loadFromSavedCharacter(savedChar);
                }
                else {
                    this.gameState.resetStateToDefault(verifiedUserId);
                    this.gameState.flushSaveToFirebase();
                }
                this.gameState.listenToFirebase();
                this.onAuthSuccess(verifiedUserId, true);
            }
        }
        catch (err) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
            if (errDiv) {
                errDiv.innerText = err.message || 'Authentication error occurred.';
                errDiv.classList.remove('hidden');
            }
        }
    }
}
exports.AuthScreen = AuthScreen;
