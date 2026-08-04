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
    const form = document.querySelector('#screen-auth form');

    if (loginTab) loginTab.onclick = () => this.switchTab('login');
    if (registerTab) registerTab.onclick = () => this.switchTab('register');
    if (form) (form as HTMLFormElement).onsubmit = (e: Event) => this.handleSubmit(e);

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
    const userIdInput = document.getElementById('auth-userid') as HTMLInputElement;
    const passwordInput = document.getElementById('auth-password') as HTMLInputElement;

    if (rememberCheck) rememberCheck.checked = isRemember;

    if (isRemember && rememberedUser && rememberedPass) {
      if (userIdInput) userIdInput.value = rememberedUser;
      if (passwordInput) {
        try {
          passwordInput.value = decryptData(rememberedPass);
        } catch (e) {
          passwordInput.value = rememberedPass;
        }
      }
    }
  }

  public switchTab(tab: 'login' | 'register'): void {
    this.mode = tab;
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const submitBtn = document.getElementById('auth-submit-btn');
    const rememberContainer = document.getElementById('auth-remember-me-container');

    if (loginTab && registerTab && submitBtn) {
      if (tab === 'login') {
        loginTab.className = 'flex-1 py-3 rounded-xl text-sm font-extrabold transition text-white bg-emerald-600/90';
        registerTab.className = 'flex-1 py-3 rounded-xl text-sm font-extrabold transition text-emerald-400';
        submitBtn.innerText = 'ENTER REALM (SIGN IN)';
        if (rememberContainer) rememberContainer.classList.remove('hidden');
      } else {
        registerTab.className = 'flex-1 py-3 rounded-xl text-sm font-extrabold transition text-white bg-emerald-600/90';
        loginTab.className = 'flex-1 py-3 rounded-xl text-sm font-extrabold transition text-emerald-400';
        submitBtn.innerText = 'CREATE ACCOUNT & PLAY';
        if (rememberContainer) rememberContainer.classList.add('hidden');
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

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    const userIdInput = (document.getElementById('auth-userid') as HTMLInputElement)?.value.trim();
    const passwordInput = (document.getElementById('auth-password') as HTMLInputElement)?.value;
    const isRememberChecked = (document.getElementById('auth-remember-me') as HTMLInputElement)?.checked;
    const errDiv = document.getElementById('auth-error');

    if (!userIdInput || !passwordInput) return;
    if (errDiv) errDiv.classList.add('hidden');

    const FirebaseApp = (window as any).FirebaseApp;
    if (!FirebaseApp) {
      if (errDiv) {
        errDiv.innerText = 'Firebase database not loaded yet. Please wait...';
        errDiv.classList.remove('hidden');
      }
      return;
    }

    const { db, ref, get, child, set } = FirebaseApp;
    const { setSessionCookie } = require('../services/GameStateService');

    try {
      const userRef = child(ref(db), `users/${userIdInput}`);
      const snapshot = await get(userRef);

      // Handle Remember Me credentials saving
      if (isRememberChecked) {
        localStorage.setItem('minimikyu_remember_me', 'true');
        localStorage.setItem('minimikyu_remembered_userid', userIdInput);
        localStorage.setItem('minimikyu_remembered_password', encryptData(passwordInput));
      } else {
        localStorage.removeItem('minimikyu_remember_me');
        localStorage.removeItem('minimikyu_remembered_userid');
        localStorage.removeItem('minimikyu_remembered_password');
      }

      if (this.mode === 'register') {
        if (snapshot.exists()) {
          throw new Error(`User ID "${userIdInput}" is already taken. Please choose another.`);
        }

        // RESET ALL PREVIOUS COOKIES & STORAGE BEFORE CREATING NEW ACCOUNT
        const { deleteSessionCookie, setSessionCookie } = require('../services/GameStateService');
        deleteSessionCookie('minimikyu_logged_user');
        deleteSessionCookie('minimikyurealm_logged_user');
        localStorage.removeItem('minimikyu_logged_user');
        localStorage.removeItem('minimikyurealm_logged_user');
        localStorage.removeItem('minimikyurealm_state');

        // Fully reset memory state to fresh defaults for the new user ID
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
        this.onAuthSuccess(userIdInput, false);

      } else {
        if (!snapshot.exists()) {
          throw new Error(`User ID "${userIdInput}" not found. Please create an account.`);
        }

        const userData = snapshot.val();
        const encryptedPass = encryptData(passwordInput);
        if (userData.password !== passwordInput && userData.password !== encryptedPass) {
          throw new Error('Incorrect password for this User ID.');
        }

        // ONLY SYNC COOKIES THAT ARE FETCHED DIRECTLY FROM FIREBASE REALTIME DB
        const verifiedUserId = userData.userId || userIdInput;
        const { setSessionCookie } = require('../services/GameStateService');
        
        this.gameState.setUserId(verifiedUserId);
        setSessionCookie('minimikyu_logged_user', verifiedUserId, 7);
        setSessionCookie('minimikyurealm_logged_user', verifiedUserId, 7);
        localStorage.setItem('minimikyu_logged_user', verifiedUserId);
        localStorage.setItem('minimikyurealm_logged_user', verifiedUserId);
        this.gameState.logCombat(`[AUTH] User ID "${verifiedUserId}" authenticated from Firebase DB.`);

        if (userData.character) {
          this.gameState.loadFromSavedCharacter(userData.character);
          this.gameState.listenToFirebase();
          this.onAuthSuccess(verifiedUserId, true);
        } else {
          this.onAuthSuccess(verifiedUserId, false);
        }
      }

    } catch (err: any) {
      if (errDiv) {
        errDiv.innerText = err.message || 'Authentication error';
        errDiv.classList.remove('hidden');
      }
    }
  }
}

