import { ScreenLifecycle } from './ScreenManager';
import { GameStateService, encryptData, decryptData } from '../services/GameStateService';

export class AuthScreen implements ScreenLifecycle {
  private mode: 'login' | 'register' = 'login';
  private gameState = GameStateService.getInstance();

  constructor(
    private onAuthSuccess: (userId: string, hasCharacter: boolean) => void
  ) {}

  public init(): void {
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('form-login-container');
    const registerForm = document.getElementById('form-register-container');

    if (loginTab) loginTab.onclick = () => this.switchTab('login');
    if (registerTab) registerTab.onclick = () => this.switchTab('register');

    if (loginForm) (loginForm as HTMLFormElement).onsubmit = (e: Event) => this.handleSubmit(e, 'login');
    if (registerForm) (registerForm as HTMLFormElement).onsubmit = (e: Event) => this.handleSubmit(e, 'register');

    this.checkExistingSession();
    this.loadRememberedCredentials();
  }

  public onEnter(): void {
    const errDiv = document.getElementById('auth-error');
    if (errDiv) errDiv.classList.add('hidden');
    this.loadRememberedCredentials();
  }

  public onLeave(): void {}

  private loadRememberedCredentials(): void {
    const isRemember = localStorage.getItem('minimikyu_remember_me') === 'true';
    const rememberedUser = localStorage.getItem('minimikyu_remembered_userid');
    const rememberedPass = localStorage.getItem('minimikyu_remembered_password');

    const rememberCheck = document.getElementById('auth-remember-me') as HTMLInputElement;
    const loginUser = document.getElementById('login-userid') as HTMLInputElement;
    const loginPass = document.getElementById('login-password') as HTMLInputElement;

    if (rememberCheck) rememberCheck.checked = isRemember;

    if (isRemember && rememberedUser && rememberedPass) {
      if (loginUser) loginUser.value = rememberedUser;
      if (loginPass) {
        try {
          loginPass.value = decryptData(rememberedPass);
        } catch (e) {
          loginPass.value = rememberedPass;
        }
      }
    }
  }

  public switchTab(tab: 'login' | 'register'): void {
    this.mode = tab;
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('form-login-container');
    const registerForm = document.getElementById('form-register-container');
    const errDiv = document.getElementById('auth-error');

    if (errDiv) errDiv.classList.add('hidden');

    if (loginTab && registerTab && loginForm && registerForm) {
      if (tab === 'login') {
        loginTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-black transition text-white bg-emerald-600 shadow-md';
        registerTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold transition text-emerald-400 hover:text-white';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        registerTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-black transition text-white bg-emerald-600 shadow-md';
        loginTab.className = 'flex-1 py-2.5 rounded-xl text-xs font-bold transition text-emerald-400 hover:text-white';
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      }
    }
  }

  private async checkExistingSession(): Promise<void> {
    const { getSessionCookie, setSessionCookie } = require('../services/GameStateService');
    const loggedUserCookie = getSessionCookie('minimikyu_logged_user') || getSessionCookie('minimikyurealm_logged_user');
    const loggedUserStorage = localStorage.getItem('minimikyu_logged_user') || localStorage.getItem('minimikyurealm_logged_user');
    const loggedUser = loggedUserCookie || loggedUserStorage;

    if (loggedUser) {
      const FirebaseApp = (window as any).FirebaseApp;
      if (FirebaseApp) {
        const { db, ref, child, get } = FirebaseApp;
        try {
          const snapshot = await get(child(ref(db), `users/${loggedUser}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            this.gameState.setUserId(loggedUser);
            setSessionCookie('minimikyu_logged_user', loggedUser, 7);
            setSessionCookie('minimikyurealm_logged_user', loggedUser, 7);
            localStorage.setItem('minimikyu_logged_user', loggedUser);
            localStorage.setItem('minimikyurealm_logged_user', loggedUser);

            if (userData.character) {
              this.gameState.loadFromSavedCharacter(userData.character);
              this.gameState.listenToFirebase();
              this.onAuthSuccess(loggedUser, true);
            }
          }
        } catch (e) {
          console.warn('[AUTH] Error restoring Firebase session:', e);
        }
      }
    }
  }

  public async handleSubmit(e: Event, forcedMode?: 'login' | 'register'): Promise<void> {
    e.preventDefault();
    const mode = forcedMode || this.mode;
    const errDiv = document.getElementById('auth-error');

    let userIdInput = '';
    let passwordInput = '';
    let submitBtn: HTMLButtonElement | null = null;
    let originalBtnText = '';

    if (mode === 'register') {
      userIdInput = (document.getElementById('reg-userid') as HTMLInputElement)?.value.trim();
      passwordInput = (document.getElementById('reg-password') as HTMLInputElement)?.value;
      submitBtn = document.getElementById('register-submit-btn') as HTMLButtonElement;
      originalBtnText = '✨ CREATE NEW ACCOUNT & START PLAYING';
    } else {
      userIdInput = (document.getElementById('login-userid') as HTMLInputElement)?.value.trim();
      passwordInput = (document.getElementById('login-password') as HTMLInputElement)?.value;
      submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement;
      originalBtnText = 'ENTER REALM (SIGN IN)';
    }

    const isRememberChecked = (document.getElementById('auth-remember-me') as HTMLInputElement)?.checked;

    if (!userIdInput || !passwordInput) {
      if (errDiv) {
        errDiv.innerText = 'Please enter both User ID and Secret Password.';
        errDiv.classList.remove('hidden');
      }
      return;
    }

    if (errDiv) errDiv.classList.add('hidden');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = mode === 'register' ? '⏳ CREATING ACCOUNT...' : '⏳ SIGNING IN...';
    }

    const FirebaseApp = (window as any).FirebaseApp;
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
        localStorage.setItem('minimikyu_remembered_password', encryptData(passwordInput));
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
        const encryptedPass = encryptData(passwordInput);

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
        this.gameState.saveToLocalStorage();
        this.gameState.logCombat(`[AUTH] Account created for User ID: ${userIdInput}`);
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
        this.onAuthSuccess(userIdInput, false);

      } else {
        if (!snapshot.exists()) {
          throw new Error(`User ID "${userIdInput}" not found. Click "Create Account" tab to register.`);
        }

        const userData = snapshot.val();
        const encryptedPass = encryptData(passwordInput);
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

        if (userData.character) {
          this.gameState.loadFromSavedCharacter(userData.character);
          this.gameState.listenToFirebase();
          this.onAuthSuccess(verifiedUserId, true);
        } else {
          this.onAuthSuccess(verifiedUserId, false);
        }
      }

    } catch (err: any) {
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

