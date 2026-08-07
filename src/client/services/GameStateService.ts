// =========================================================
// GAME STATE SERVICE MODULE - FIREBASE DB & IDLE STORAGE VAULT
// =========================================================

export type JobClass = 'WARRIOR' | 'MAGE' | 'ARCHER' | 'SAMURAI';
export type GenderType = 'MALE' | 'FEMALE';
export type RarityType = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'divine';
export type ItemType = 'weapon' | 'armor' | 'rune' | 'consumable' | 'skill' | 'accessory' | 'companion' | 'cutscene' | 'unique_power' | 'mount' | 'porter';
export type ElementType = 'fire' | 'lightning' | 'nature' | 'none' | 'ice' | 'shadow' | 'divine';
export type SkillId = 'spinning_stone' | 'flaming_field' | 'necromancer' | 'acid_rain' | 'cyborg' | 'teleporter' | 'samurai_slash';
export type CutsceneId = 'shadow_arise' | 'getsuga_tensho' | 'i_am_atomic';

export type PetAttackType = 'slash' | 'sniper' | 'laser' | 'mage' | 'shield';

export function encryptData(str: string): string {
  try {
    const encoded = encodeURIComponent(str);
    return btoa(encoded.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ ((i % 7) + 13))).join(''));
  } catch (e) {
    return btoa(encodeURIComponent(str));
  }
}

export function decryptData(str: string): string {
  try {
    const decoded = atob(str);
    return decodeURIComponent(decoded.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ ((i % 7) + 13))).join(''));
  } catch (e) {
    return decodeURIComponent(atob(str));
  }
}

export function setSessionCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

export function getSessionCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cname = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}

export function deleteSessionCookie(name: string): void {
  setSessionCookie(name, '', -1);
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: RarityType;
  icon: string;
  cpBonus: number;
  level?: number;
  count: number;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  bonusPower?: number;
  description?: string;
  element?: ElementType;
  skillId?: SkillId;
  uniquePowerEffect?: string;
  cutsceneId?: CutsceneId;
  petAttackType?: PetAttackType;
  petStory?: string;
  porterSpeedMs?: number;
  porterRadiusPx?: number;
  porterLore?: string;
  isLocked?: boolean;
}

export interface PorterVariant {
  id: string;
  name: string;
  rarity: RarityType;
  icon: string;
  cpBonus: number;
  speedMs: number;
  radiusPx: number;
  description: string;
  lore: string;
}

export const PORTER_VARIANTS: PorterVariant[] = [
  {
    id: 'porter-forge-dwarf',
    name: 'Rustic Forge Dwarf',
    rarity: 'common',
    icon: '⚒️',
    cpBonus: 30,
    speedMs: 2500,
    radiusPx: 140,
    description: 'Subterranean ironworks dwarf carrying a heavy leather coin sack.',
    lore: 'Hailing from the Iron Foothills, this industrious dwarf spends his days scouring battlefields to scoop up copper coins and raw iron scraps into his sturdy sack.'
  },
  {
    id: 'porter-pack-automaton',
    name: 'Ironclad Pack Automaton',
    rarity: 'rare',
    icon: '🤖',
    cpBonus: 80,
    speedMs: 1800,
    radiusPx: 200,
    description: 'Clockwork brass construct equipped with magnetic gears & vacuum bellows.',
    lore: 'Engineered by ancient Murim mechanists, this brass automaton hums as its magnetic core attracts discarded weapons and gemstones across vast ruins.'
  },
  {
    id: 'porter-vault-goblin',
    name: 'Golden Vault Goblin',
    rarity: 'legendary',
    icon: '👺',
    cpBonus: 250,
    speedMs: 1000,
    radiusPx: 280,
    description: 'Nimble goblin treasure hunter wearing a gilded silk vest & coin pouch.',
    lore: 'Obsessed with sparkling mythic loot, this energetic goblin dashes lightning-fast across battlefields, snatching gold coins and rare drops before they touch the ground.'
  },
  {
    id: 'porter-mithril-king',
    name: 'Celestial Mithril Dwarf King',
    rarity: 'mythic',
    icon: '🧙‍♂️',
    cpBonus: 1500,
    speedMs: 400,
    radiusPx: 420,
    description: 'Dwarven monarch wielding a glowing rune-encrusted magnet hammer!',
    lore: 'Sovereign of the Nether Forge, King Thorin commands celestial gravity waves. With a strike of his rune hammer, all dropped loot on the screen flies instantly into his enchanted royal chest!'
  }
];

export interface IdleVaultState {
  accumulatedExp: number;
  accumulatedGold: number;
  startTime: number;
  lastClaimTime: number;
}

export interface AutoSellRules {
  sellCommon: boolean;
  sellRare: boolean;
  epic?: boolean;
  sellLegendary: boolean;
  mythic?: boolean;
  keepRunes: boolean;
}

export interface GameState {
  userId: string;
  name: string;
  gender: GenderType;
  jobClass: JobClass;
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  gems: number;
  redGems: number;
  purpleGems: number;
  skillTomes: number;
  ancientBooks: number;
  heroAuraMeter: number;
  towerKeys: number;
  statPoints: number;
  str: number;
  int: number;
  agi: number;
  vit: number;
  hp: number;
  maxHp: number;
  cp: number;
  towerFloor: number;
  worldTier: number;
  wave: number;
  waveKills: number;
  ascensionLevel: number;
  killMeter: number;
  inventory: InventoryItem[];
  equippedWeapon: InventoryItem | null;
  equippedArmor: InventoryItem | null;
  equippedRune: InventoryItem | null;
  equippedSkill: InventoryItem | null;
  equippedUniquePower: InventoryItem | null;
  equippedPet: InventoryItem | null;
  equippedPets: InventoryItem[];
  equippedCutscene: InventoryItem | null;
  equippedMount: InventoryItem | null;
  equippedPorter: InventoryItem | null;
  isWeaponLocked?: boolean;
  isArmorLocked?: boolean;
  isRuneLocked?: boolean;
  isSkillLocked?: boolean;
  isUniquePowerLocked?: boolean;
  isPetLocked?: boolean;
  isCutsceneLocked?: boolean;
  isMountLocked?: boolean;
  isPorterLocked?: boolean;
  isAutoAllocateStats?: boolean;
  idleVault: IdleVaultState;
  autoSellRules: AutoSellRules;
  autoSell?: { common: boolean; rare: boolean; epic?: boolean; legendary: boolean; mythic?: boolean; keepRunes: boolean };
  lastSavedAt?: number;
}

export class GameStateService {
  private static instance: GameStateService;
  private listeners: Array<() => void> = [];
  private saveDebounceTimer: any = null;
  private isNotifyScheduled: boolean = false;

  public state: GameState = {
    userId: 'guest-1',
    name: 'KyuHero',
    gender: 'MALE',
    jobClass: 'WARRIOR',
    level: 1,
    exp: 0,
    maxExp: 100,
    gold: 0,
    gems: 0,
    redGems: 0,
    purpleGems: 0,
    skillTomes: 0,
    ancientBooks: 0,
    heroAuraMeter: 0,
    towerKeys: 0,
    statPoints: 5,
    str: 10,
    int: 5,
    agi: 5,
    vit: 5,
    hp: 120,
    maxHp: 120,
    cp: 35,
    towerFloor: 1,
    worldTier: 1,
    wave: 1,
    waveKills: 0,
    ascensionLevel: 0,
    killMeter: 0,
    inventory: [
      {
        id: 'starter-sword-1',
        name: 'Viking Steel Sword',
        type: 'weapon',
        rarity: 'common',
        icon: '🗡️',
        cpBonus: 20,
        level: 1,
        count: 1,
        description: 'A reliable steel blade forged for apprentice swordsmen.',
        isLocked: false
      },
      {
        id: 'starter-armor-1',
        name: 'Jade Guardian Armor',
        type: 'armor',
        rarity: 'common',
        icon: '🥋',
        cpBonus: 15,
        level: 1,
        count: 1,
        description: 'Lightweight emerald armor crafted for agile movement.',
        isLocked: false
      },
      {
        id: 'starter-pet-1',
        name: 'Crimson Flame Drake',
        type: 'companion',
        rarity: 'mythic',
        icon: '🐲',
        petAttackType: 'laser',
        cpBonus: 2800,
        level: 1,
        count: 1,
        description: 'Mythic crimson dragon breathing high-temp flame lasers across dungeon waves.',
        isLocked: false
      },
      {
        id: 'starter-pet-2',
        name: 'Thunder Spark Kitsune',
        type: 'companion',
        rarity: 'legendary',
        icon: '⚡',
        petAttackType: 'sniper',
        cpBonus: 1200,
        level: 1,
        count: 1,
        description: 'Nine-tailed celestial fox shooting high-voltage lightning bolt snipes.',
        isLocked: false
      },
      {
        id: 'starter-pet-3',
        name: 'Celestial Void Behemoth',
        type: 'companion',
        rarity: 'mythic',
        icon: '🌌',
        petAttackType: 'mage',
        cpBonus: 2900,
        level: 1,
        count: 1,
        description: 'Cosmic shadow spirit emitting pulsing violet void shockwave explosions.',
        isLocked: false
      },
      {
        id: 'starter-pet-4',
        name: 'Frostbite Fenrir Wolf',
        type: 'companion',
        rarity: 'legendary',
        icon: '🐺',
        petAttackType: 'slash',
        cpBonus: 1150,
        level: 1,
        count: 1,
        description: 'Gigantic ice wolf lunging into monsters with razor-sharp frozen claw strikes.',
        isLocked: false
      },
      {
        id: 'starter-pet-5',
        name: 'Aegis Golden Gryphon',
        type: 'companion',
        rarity: 'legendary',
        icon: '🦅',
        petAttackType: 'shield',
        cpBonus: 1100,
        level: 1,
        count: 1,
        description: 'Holy gryphon generating golden divine holy shield barriers that protect the squad.',
        isLocked: false
      },
      {
        id: 'starter-cutscene-1',
        name: 'SHADOW ARISE',
        type: 'cutscene',
        rarity: 'mythic',
        icon: '🌑',
        cutsceneId: 'shadow_arise',
        cpBonus: 100,
        level: 1,
        count: 1,
        description: 'Summons dark shadow monarchs to annihilate all enemies in a 5s cinematic burst!',
        isLocked: false
      }
    ],
    equippedWeapon: null,
    equippedArmor: null,
    equippedRune: null,
    equippedSkill: null,
    equippedUniquePower: null,
    equippedPet: null,
    equippedPets: [],
    equippedCutscene: null,
    equippedMount: null,
    equippedPorter: null,
    isWeaponLocked: false,
    isArmorLocked: false,
    isRuneLocked: false,
    isSkillLocked: false,
    isPetLocked: false,
    isCutsceneLocked: false,
    isMountLocked: false,
    isPorterLocked: false,
    idleVault: {
      accumulatedExp: 0,
      accumulatedGold: 0,
      startTime: Date.now(),
      lastClaimTime: Date.now() - 6000
    },
    autoSellRules: {
      sellCommon: false,
      sellRare: false,
      sellLegendary: false,
      keepRunes: true
    },
    autoSell: {
      common: false,
      rare: false,
      legendary: false,
      keepRunes: true
    }
  };

  private listenUnsubscribe: any = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      (window as any).encryptData = encryptData;
      (window as any).decryptData = decryptData;
      (window as any).logoutCurrentAccount = () => this.logout();
      (window as any).manualSaveCharacterRecord = () => this.manualSaveCharacterRecord();
    }

    this.recalculateCP();
    this.startIdleVaultTimer();
    this.loadFromLocalStorage();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.state.userId && this.state.userId !== 'guest-1') {
          this.flushSaveToFirebase();
          this.saveToLocalStorage();
          deleteSessionCookie('minimikyurealm_logged_user');
          localStorage.removeItem('minimikyurealm_logged_user');
        }
      });

      // TIMELY 20-SECOND AUTO SAVE TO FIREBASE REALTIME DATABASE & LOCALSTORAGE
      setInterval(() => {
        if (this.state.userId && this.state.userId !== 'guest-1') {
          this.flushSaveToFirebase();
        }
      }, 20000);
    }
  }

  public saveToLocalStorage(): void {
    try {
      if (!this.state.userId || this.state.userId === 'guest-1') return;
      const payload = {
        ...this.state,
        worldTier: this.getWorldTier(),
        wave: this.state.wave || 1,
        waveKills: this.state.waveKills || 0,
        equippedPets: this.normalizeArray(this.state.equippedPets),
        inventory: this.normalizeArray(this.state.inventory),
        lastSavedAt: Date.now()
      };
      localStorage.setItem(`minimikyurealm_state_${this.state.userId}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('[STORAGE] LocalStorage save error:', e);
    }
  }

  public loadFromLocalStorage(): void {
    try {
      const loggedUser = localStorage.getItem('minimikyurealm_logged_user');
      if (!loggedUser) return;

      const raw = localStorage.getItem(`minimikyurealm_state_${loggedUser}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.userId === loggedUser) {
          this.loadFromSavedCharacter(parsed);
          console.log(`[STORAGE] 💾 Loaded state for user "${loggedUser}"!`);
        }
      }
    } catch (e) {
      console.warn('[STORAGE] LocalStorage load error:', e);
    }
  }

  public logout(): void {
    const currentUserId = this.state.userId;

    if (this.listenUnsubscribe) {
      try { this.listenUnsubscribe(); } catch (e) {}
      this.listenUnsubscribe = null;
    }

    if (currentUserId && currentUserId !== 'guest-1') {
      try {
        this.flushSaveToFirebase();
      } catch (e) {}
      localStorage.removeItem(`minimikyurealm_state_${currentUserId}`);
    }

    // CLEAR COOKIES & LOCAL STORAGE ON LOGOUT
    deleteSessionCookie('minimikyu_logged_user');
    deleteSessionCookie('minimikyurealm_logged_user');

    localStorage.removeItem('minimikyu_logged_user');
    localStorage.removeItem('minimikyurealm_logged_user');
    localStorage.removeItem('minimikyurealm_state');

    this.resetStateToDefault();
    this.notify();

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  public async deleteUserAccountPermanent(): Promise<boolean> {
    const userId = this.state.userId;
    if (!userId || userId === 'guest-1') {
      return false;
    }

    try {
      if ((window as any).FirebaseApp) {
        const { db, ref, remove, set } = (window as any).FirebaseApp;
        const userRef = ref(db, `users/${userId}`);
        
        if (typeof remove === 'function') {
          await remove(userRef);
        } else if (typeof set === 'function') {
          await set(userRef, null);
        }
        
        // Also remove character node explicitly
        const charRef = ref(db, `users/${userId}/character`);
        if (typeof remove === 'function') await remove(charRef);
        else if (typeof set === 'function') await set(charRef, null);

        console.log(`[FIREBASE] 🗑️ User account "${userId}" deleted permanently from Realtime Database.`);
      }
    } catch (err) {
      console.error('[DB] Error deleting user from Firebase:', err);
    }

    // Clear session cookies & local storage
    deleteSessionCookie('minimikyu_logged_user');
    deleteSessionCookie('minimikyurealm_logged_user');

    localStorage.removeItem('minimikyu_logged_user');
    localStorage.removeItem('minimikyurealm_logged_user');
    localStorage.removeItem(`minimikyurealm_state_${userId}`);
    localStorage.clear();

    this.resetStateToDefault();
    this.notify();

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return true;
  }


  public resetStateToDefault(userId?: string): void {
    const id = userId || 'guest-1';
    this.state = this.getDefaultState(id);
    this.recalculateCP();
    this.notify();
  }

  public manualSaveCharacterRecord(): void {
    this.flushSaveToFirebase();
    this.saveToLocalStorage();

    const saveBtn = document.getElementById('btn-manual-save-record');
    if (saveBtn) {
      saveBtn.className = 'px-3 py-1 bg-emerald-500 text-slate-950 border border-emerald-300 font-black rounded-xl text-xs shadow-xl transition flex items-center gap-1 cursor-pointer scale-105 animate-pulse';
      setTimeout(() => {
        if (saveBtn) saveBtn.className = 'px-3 py-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/80 font-black rounded-xl text-xs shadow-lg transition flex items-center gap-1 cursor-pointer';
      }, 1200);
    }

    const { UIService } = require('../services/UIService');
    UIService.getInstance().showToast('💾 Character record successfully saved & synced with Firebase DB!', 'success');
  }

  public static getInstance(): GameStateService {
    if (!GameStateService.instance) {
      GameStateService.instance = new GameStateService();
    }
    return GameStateService.instance;
  }

  public getUserId(): string {
    return this.state.userId;
  }

  public setUserId(id: string | null): void {
    this.state.userId = id || '';
  }

  public updateCP(): void {
    this.recalculateCP();
  }

  public logCombat(msg: string): void {
    console.log(`[REALM LOG] ${msg}`);
    const latestEl = document.getElementById('feedback-log-latest-text');
    const historyEl = document.getElementById('feedback-log-history-list');
    
    if (latestEl) latestEl.innerText = msg;
    if (historyEl) {
      const item = document.createElement('div');
      item.innerText = `• ${msg}`;
      historyEl.prepend(item);
      while (historyEl.children.length > 10) {
        historyEl.removeChild(historyEl.lastChild!);
      }
    }
  }

  public autoAllocateStatPoints(): void {
    if (!this.state.isAutoAllocateStats || this.state.statPoints <= 0) return;

    const stats: Array<'str' | 'int' | 'agi' | 'vit'> = ['str', 'int', 'agi', 'vit'];
    let idx = 0;

    while (this.state.statPoints > 0) {
      const stat = stats[idx % stats.length];
      this.state.statPoints--;
      this.state[stat]++;

      if (stat === 'vit') {
        this.state.maxHp += 10;
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + 10);
      }

      idx++;
    }

    this.recalculateCP();
  }

  public updateHeroSystemModal(): void {
    if (this.state.isAutoAllocateStats && this.state.statPoints > 0) {
      this.autoAllocateStatPoints();
    }
    this.updateHUDDOM();
  }

  public normalizeArray<T>(data: any): T[] {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(Boolean);
    if (typeof data === 'object') {
      return Object.values(data).filter(Boolean) as T[];
    }
    return [];
  }

  public isWeaponAllowedForClass(jobClass: string, weapon: InventoryItem | null): boolean {
    if (!weapon || weapon.type !== 'weapon') return true;
    const name = weapon.name.toLowerCase();

    if (jobClass === 'WARRIOR') {
      if (name.includes('wand') || name.includes('staff') || name.includes('bow') || name.includes('recurve') || name.includes('katana') || name.includes('masamune') || name.includes('muramasa')) {
        return false;
      }
      return true;
    }

    if (jobClass === 'SAMURAI') {
      if (name.includes('wand') || name.includes('staff') || name.includes('bow') || name.includes('recurve')) {
        return false;
      }
      if (!name.includes('katana') && !name.includes('masamune') && !name.includes('muramasa') && !name.includes('blade')) {
        return false;
      }
      return true;
    }

    if (jobClass === 'MAGE') {
      if (name.includes('sword') || name.includes('blade') || name.includes('katana') || name.includes('bow') || name.includes('recurve') || name.includes('masamune') || name.includes('muramasa')) {
        return false;
      }
      if (!name.includes('wand') && !name.includes('staff') && !name.includes('orb') && !name.includes('tome') && !name.includes('rod') && !name.includes('grimoire')) {
        return false;
      }
      return true;
    }

    if (jobClass === 'ARCHER') {
      if (name.includes('sword') || name.includes('blade') || name.includes('katana') || name.includes('wand') || name.includes('staff') || name.includes('masamune') || name.includes('muramasa')) {
        return false;
      }
      if (!name.includes('bow') && !name.includes('recurve') && !name.includes('arrow') && !name.includes('crossbow')) {
        return false;
      }
      return true;
    }

    return true;
  }

  public getStarterWeaponForClass(jobClass: string): InventoryItem {
    if (jobClass === 'MAGE') {
      return { id: 'starter-wand-1', name: 'Apprentice Wooden Wand', type: 'weapon', rarity: 'common', icon: '🔮', cpBonus: 20, level: 1, count: 1, description: 'Starter wand crafted for Mage heroes.', isLocked: false };
    }
    if (jobClass === 'ARCHER') {
      return { id: 'starter-bow-1', name: 'Apprentice Wooden Bow', type: 'weapon', rarity: 'common', icon: '🏹', cpBonus: 20, level: 1, count: 1, description: 'Starter bow crafted for Archer heroes.', isLocked: false };
    }
    if (jobClass === 'SAMURAI') {
      return { id: 'starter-katana-1', name: 'Apprentice Practice Katana', type: 'weapon', rarity: 'common', icon: '⚔️', cpBonus: 20, level: 1, count: 1, description: 'Starter practice katana for Samurai heroes.', isLocked: false };
    }
    return { id: 'starter-sword-1', name: 'Apprentice Steel Sword', type: 'weapon', rarity: 'common', icon: '🗡️', cpBonus: 20, level: 1, count: 1, description: 'Starter blade forged for Warrior heroes.', isLocked: false };
  }

  public getDefaultState(userId: string = 'guest-1'): GameState {
    const defaultJobClass = 'WARRIOR';
    const starterWeapon = this.getStarterWeaponForClass(defaultJobClass);
    const starterArmor: InventoryItem = { id: 'starter-armor-1', name: 'Jade Guardian Armor', type: 'armor', rarity: 'common', icon: '🥋', cpBonus: 15, level: 1, count: 1, description: 'Starter armor crafted for new heroes.', isLocked: false };

    return {
      userId,
      name: 'KyuHero',
      gender: 'MALE',
      jobClass: defaultJobClass,
      level: 1,
      exp: 0,
      maxExp: 100,
      gold: 0,
      gems: 0,
      redGems: 0,
      purpleGems: 0,
      skillTomes: 0,
      ancientBooks: 0,
      heroAuraMeter: 0,
      towerKeys: 0,
      statPoints: 5,
      str: 10,
      int: 5,
      agi: 5,
      vit: 5,
      hp: 120,
      maxHp: 120,
      cp: 35,
      towerFloor: 1,
      worldTier: 1,
      wave: 1,
      waveKills: 0,
      ascensionLevel: 0,
      killMeter: 0,
      inventory: [starterWeapon, starterArmor],
      equippedWeapon: starterWeapon,
      equippedArmor: starterArmor,
      equippedRune: null,
      equippedSkill: null,
      equippedUniquePower: null,
      equippedPet: null,
      equippedPets: [],
      equippedCutscene: null,
      equippedMount: null,
      equippedPorter: null,
      isWeaponLocked: false,
      isArmorLocked: false,
      isRuneLocked: false,
      isSkillLocked: false,
      isPetLocked: false,
      isCutsceneLocked: false,
      isMountLocked: false,
      isPorterLocked: false,
      isAutoAllocateStats: false,
      idleVault: {
        accumulatedExp: 0,
        accumulatedGold: 0,
        startTime: Date.now(),
        lastClaimTime: Date.now()
      },
      autoSellRules: { sellCommon: false, sellRare: false, sellLegendary: false, keepRunes: true },
      autoSell: { common: false, rare: false, legendary: false, keepRunes: true }
    };
  }

  public loadFromSavedCharacter(charData: any): void {
    if (!charData) return;

    const targetUserId = charData.userId || this.state.userId;
    const defaultBase = this.getDefaultState(targetUserId);

    const normalizedEquippedPets = this.normalizeArray<InventoryItem>(charData.equippedPets);
    const normalizedInventory = this.normalizeArray<InventoryItem>(charData.inventory);

    this.state = {
      ...defaultBase,
      ...charData,
      userId: targetUserId,
      equippedPets: normalizedEquippedPets,
      inventory: normalizedInventory
    };

    if (this.state.redGems === undefined) this.state.redGems = 0;
    if (this.state.purpleGems === undefined) this.state.purpleGems = 0;

    // Ensure starter/legacy testing pets are purged so pets can ONLY be obtained via Gacha Shrine
    if (this.state.inventory && Array.isArray(this.state.inventory)) {
      this.state.inventory = this.state.inventory.filter(item => !item.id?.startsWith('starter-pet-'));
    }
    if (this.state.equippedPets && Array.isArray(this.state.equippedPets)) {
      this.state.equippedPets = this.state.equippedPets.filter(item => !item.id?.startsWith('starter-pet-'));
    }

    // Sync level & CP for all equipped pets with inventory items upon load
    this.state.equippedPets.forEach(eqPet => {
      const invPet = this.state.inventory.find(i => i.id === eqPet.id || i.name === eqPet.name);
      if (invPet) {
        eqPet.level = invPet.level || 1;
        eqPet.cpBonus = invPet.cpBonus || eqPet.cpBonus;
      }
    });

    this.cleanNonClassWeapons();
    this.recalculateCP();
    this.notify();
  }

  public cleanNonClassWeapons(): void {
    if (!this.state.inventory || !Array.isArray(this.state.inventory)) return;

    const jobClass = this.state.jobClass || 'WARRIOR';
    const weaponsToRemove: InventoryItem[] = [];

    this.state.inventory = this.state.inventory.filter(item => {
      if (item.type === 'weapon') {
        if (!this.isWeaponAllowedForClass(jobClass, item)) {
          weaponsToRemove.push(item);
          return false;
        }
      }
      return true;
    });

    // Check & replace non-matching equipped weapon
    if (this.state.equippedWeapon && !this.isWeaponAllowedForClass(jobClass, this.state.equippedWeapon)) {
      weaponsToRemove.push(this.state.equippedWeapon);
      const starterWeapon = this.getStarterWeaponForClass(jobClass);
      this.state.equippedWeapon = starterWeapon;
      if (!this.state.inventory.some(i => i.id === starterWeapon.id || i.name === starterWeapon.name)) {
        this.state.inventory.push(starterWeapon);
      }
    }

    if (weaponsToRemove.length > 0) {
      let goldEarned = 0;
      weaponsToRemove.forEach(w => {
        goldEarned += this.getItemSellPrice(w.rarity, w.level || 1) * (w.count || 1);
      });
      this.state.gold += goldEarned;
    }
  }

  public listenToFirebase(callback?: (data: any) => void): void {
    if ((window as any).FirebaseApp && this.state.userId) {
      try {
        const { db, ref, onValue } = (window as any).FirebaseApp;
        const userRef = ref(db, `users/${this.state.userId}/character`);
        this.listenUnsubscribe = onValue(userRef, (snapshot: any) => {
          const val = snapshot.val();
          if (val && val.lastSavedAt) {
            const localSaved = (this.state as any).lastSavedAt || 0;
            // PREVENT FIREBASE FEEDBACK LOOP: Only apply remote update if lastSavedAt is strictly newer by 1000ms!
            if (val.lastSavedAt > localSaved + 1000) {
              console.log('[FIREBASE] 🔄 Syncing remote update from another device/session...');
              this.loadFromSavedCharacter(val);
              if (callback) callback(val);
            }
          }
        });
      } catch (err) {
        console.error('[DB] Firebase listen error:', err);
      }
    }
  }

  public clearAllGameCookiesAndCaches(): void {
    try {
      deleteSessionCookie('minimikyu_logged_user');
      deleteSessionCookie('minimikyurealm_logged_user');
      localStorage.clear();
      sessionStorage.clear();
      console.log('[CLEANUP] 🧹 All cookies, session data, and localStorage caches cleared!');
    } catch (e) {
      console.warn('[CLEANUP] Clear error:', e);
    }
  }

  public subscribe(listener: () => void): void {
    this.listeners.push(listener);
  }

  public checkTowerKeyOverflow(): void {
    if (this.state.towerKeys && this.state.towerKeys > 20) {
      const excess = this.state.towerKeys - 20;
      const convertedGold = excess * 500;
      this.state.towerKeys = 20;
      this.state.gold += convertedGold;

      const { UIService } = require('./UIService');
      UIService.getInstance().showToast(`🔑 Tower Keys full (20/20)! Converted ${excess} exceeding Key(s) -> +${convertedGold.toLocaleString()} Gold 🪙`, 'warning');
    }
  }

  public addTowerKeys(amount: number): { addedKeys: number; convertedGold: number } {
    const currentKeys = this.state.towerKeys || 0;
    this.state.towerKeys = currentKeys + amount;
    this.checkTowerKeyOverflow();
    this.notify();
    this.saveToFirebase();

    const excess = Math.max(0, (currentKeys + amount) - 20);
    const addedKeys = Math.min(amount, Math.max(0, 20 - currentKeys));
    const convertedGold = excess * 500;

    return { addedKeys, convertedGold };
  }

  public notify(): void {
    this.checkTowerKeyOverflow();
    this.recalculateCP();

    if (this.isNotifyScheduled) return;
    this.isNotifyScheduled = true;

    requestAnimationFrame(() => {
      this.isNotifyScheduled = false;
      this.listeners.forEach(fn => fn());
      this.updateHUDDOM();
    });
  }

  // PASSIVE IDLE VAULT REWARD ACCUMULATION
  private startIdleVaultTimer(): void {
    setInterval(() => {
      if (!this.state.idleVault) {
        this.state.idleVault = {
          accumulatedExp: 0,
          accumulatedGold: 0,
          startTime: Date.now(),
          lastClaimTime: Date.now() - 6000
        };
      }

      this.state.idleVault.accumulatedExp += 10;
      this.state.idleVault.accumulatedGold += 20;

      // Update Idle Grove DOM directly if active
      const idleView = document.getElementById('view-idle');
      if (idleView && !idleView.classList.contains('hidden')) {
        const expEl = document.getElementById('idle-stored-exp');
        const goldEl = document.getElementById('idle-stored-gold');
        const timeEl = document.getElementById('idle-vault-time-text');
        if (expEl) expEl.innerText = `+${this.state.idleVault.accumulatedExp.toLocaleString()} EXP`;
        if (goldEl) goldEl.innerText = `+${this.state.idleVault.accumulatedGold.toLocaleString()} 🪙`;
        if (timeEl) timeEl.innerText = `⏱️ Accumulated: ${this.getIdleVaultDurationText()}`;
      }
    }, 2000);
  }

  public getIdleVaultDurationText(): string {
    const lastClaim = this.state.idleVault?.lastClaimTime || (Date.now() - 6000);
    const elapsedMs = Math.max(0, Date.now() - lastClaim);
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m worth of rewards`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s worth of rewards`;
    }
    return `${secs}s worth of rewards`;
  }

  public claimIdleVaultStorage(): { success: boolean; expGained: number; goldGained: number; message: string } {
    if (!this.state.idleVault) {
      this.state.idleVault = {
        accumulatedExp: 0,
        accumulatedGold: 0,
        startTime: Date.now(),
        lastClaimTime: Date.now() - 6000
      };
    }

    const now = Date.now();
    const lastClaim = this.state.idleVault.lastClaimTime || 0;
    const cooldownRemaining = 5000 - (now - lastClaim);

    if (cooldownRemaining > 0) {
      const secondsLeft = Math.ceil(cooldownRemaining / 1000);
      return {
        success: false,
        expGained: 0,
        goldGained: 0,
        message: `⏳ Claim cooldown active! Please wait ${secondsLeft}s.`
      };
    }

    const expGained = this.state.idleVault.accumulatedExp || 0;
    const goldGained = this.state.idleVault.accumulatedGold || 0;

    this.state.exp += expGained;
    this.state.gold += goldGained;

    this.state.idleVault.accumulatedExp = 0;
    this.state.idleVault.accumulatedGold = 0;
    this.state.idleVault.lastClaimTime = now;

    let levelUpSafety = 0;
    while (this.state.exp >= this.state.maxExp && levelUpSafety < 100) {
      levelUpSafety++;
      this.state.level++;
      this.state.exp -= this.state.maxExp;
      this.state.maxExp = this.getNextLevelMaxExp(this.state.level);
      this.state.statPoints += 3;
      this.state.maxHp += 20;
      this.state.hp = this.state.maxHp;
    }

    this.notify();
    this.saveToFirebase();

    return {
      success: true,
      expGained,
      goldGained,
      message: `🎁 Successfully claimed +${expGained.toLocaleString()} EXP and +${goldGained.toLocaleString()} 🪙 from Storage Vault!`
    };
  }

  public saveToFirebase(): void {
    this.saveToLocalStorage();
    if (this.saveDebounceTimer) return;

    this.saveDebounceTimer = setTimeout(() => {
      this.saveDebounceTimer = null;
      this.flushSaveToFirebase();
    }, 5000);
  }

  public flushSaveToFirebase(): void {
    this.recalculateCP();
    this.saveToLocalStorage();

    if ((window as any).FirebaseApp && this.state.userId && this.state.userId !== 'guest-1') {
      try {
        const { db, ref, update } = (window as any).FirebaseApp;

        const classTitle = this.getClassTitle();
        const rankTitle = this.getRankTitle();

        const payload = {
          ...this.state,
          classTitle,
          rankTitle,
          worldTier: this.getWorldTier(),
          wave: this.state.wave || 1,
          waveKills: this.state.waveKills || 0,
          equippedPets: this.normalizeArray(this.state.equippedPets),
          inventory: this.normalizeArray(this.state.inventory),
          lastSavedAt: Date.now()
        };

        // 1. Update Firebase character subnode
        const characterRef = ref(db, `users/${this.state.userId}/character`);
        update(characterRef, payload);

        // 2. Update Firebase user root node with all individual fields
        const userRootRef = ref(db, `users/${this.state.userId}`);
        update(userRootRef, {
          userId: this.state.userId,
          cp: this.state.cp,
          level: this.state.level,
          exp: this.state.exp,
          maxExp: this.state.maxExp,
          classTitle: classTitle,
          rankTitle: rankTitle,
          jobClass: this.state.jobClass,
          gender: this.state.gender,
          name: this.state.name,
          gold: this.state.gold,
          gems: this.state.gems,
          redGems: this.state.redGems || 0,
          purpleGems: this.state.purpleGems || 0,
          towerKeys: Math.min(20, this.state.towerKeys || 0),
          statPoints: this.state.statPoints || 0,
          str: this.state.str || 0,
          int: this.state.int || 0,
          agi: this.state.agi || 0,
          vit: this.state.vit || 0,
          hp: this.state.hp || 100,
          maxHp: this.state.maxHp || 100,
          ascensionLevel: this.state.ascensionLevel || 0,
          towerFloor: this.state.towerFloor || 1,
          worldTier: this.getWorldTier(),
          equippedWeapon: this.state.equippedWeapon || null,
          equippedArmor: this.state.equippedArmor || null,
          equippedRune: this.state.equippedRune || null,
          equippedSkill: this.state.equippedSkill || null,
          equippedUniquePower: this.state.equippedUniquePower || null,
          equippedCutscene: this.state.equippedCutscene || null,
          equippedMount: this.state.equippedMount || null,
          equippedPorter: this.state.equippedPorter || null,
          equippedPets: this.normalizeArray(this.state.equippedPets),
          inventory: this.normalizeArray(this.state.inventory),
          lastSavedAt: Date.now(),
          character: payload
        });

        // 3. Ensure Session Cookies are updated
        setSessionCookie('minimikyu_logged_user', this.state.userId, 7);
        setSessionCookie('minimikyurealm_logged_user', this.state.userId, 7);

        // 4. Trigger Floating Overhead Auto-Save Status Badge in Dungeon Screen
        if ((window as any).dungeonScreenInstance && typeof (window as any).dungeonScreenInstance.showAutosaveBadgeOverhead === 'function') {
          (window as any).dungeonScreenInstance.showAutosaveBadgeOverhead();
        }

        console.log(`[FIREBASE] 💾 Realtime DB updated for User "${this.state.userId}": CP=${this.state.cp}, Level=${this.state.level}, ClassTitle="${classTitle}"!`);
      } catch (err) {
        console.error('[DB] Firebase Save Error:', err);
      }
    }
  }

  public setCharacterDetails(name: string, gender: GenderType, jobClass: JobClass): void {
    this.state.name = name;
    this.state.gender = gender;
    this.state.jobClass = jobClass;

    if (jobClass === 'WARRIOR') {
      this.state.str = 12; this.state.int = 4; this.state.agi = 6; this.state.vit = 8;
      this.state.equippedWeapon = { id: 'w1', name: 'Apprentice Steel Sword', type: 'weapon', rarity: 'common', icon: '🗡️', cpBonus: 25, level: 1, count: 1, isLocked: false };
      this.state.equippedArmor = { id: 'a1', name: 'Jade Guardian Armor', type: 'armor', rarity: 'common', icon: '🥋', cpBonus: 20, level: 1, count: 1, isLocked: false };
    } else if (jobClass === 'SAMURAI') {
      this.state.str = 11; this.state.int = 4; this.state.agi = 14; this.state.vit = 7;
      this.state.equippedWeapon = { id: 'w4', name: 'Master Muramasa Katana', type: 'weapon', rarity: 'rare', icon: '🗡️', cpBonus: 45, level: 1, count: 1, isLocked: false };
      this.state.equippedArmor = { id: 'a4', name: 'Lacquered Samurai Kabuto Armor', type: 'armor', rarity: 'rare', icon: '🥋', cpBonus: 35, level: 1, count: 1, isLocked: false };
    } else if (jobClass === 'MAGE') {
      this.state.str = 4; this.state.int = 14; this.state.agi = 5; this.state.vit = 5;
      this.state.equippedWeapon = { id: 'w2', name: 'Crystal Magic Wand', type: 'weapon', rarity: 'common', icon: '🔮', cpBonus: 28, level: 1, count: 1, isLocked: false };
      this.state.equippedArmor = { id: 'a2', name: 'Arcane Silk Robe', type: 'armor', rarity: 'common', icon: '🥼', cpBonus: 18, level: 1, count: 1, isLocked: false };
    } else {
      this.state.str = 6; this.state.int = 5; this.state.agi = 13; this.state.vit = 6;
      this.state.equippedWeapon = { id: 'w3', name: 'Elven Longbow', type: 'weapon', rarity: 'common', icon: '🏹', cpBonus: 26, level: 1, count: 1, isLocked: false };
      this.state.equippedArmor = { id: 'a3', name: 'Windrunner Leather', type: 'armor', rarity: 'common', icon: '🧥', cpBonus: 19, level: 1, count: 1, isLocked: false };
    }

    this.cleanNonClassWeapons();
    this.recalculateCP();
    this.notify();
    this.flushSaveToFirebase();
  }

  public recalculateCP(): void {
    let cp = (this.state.str * 3) + (this.state.int * 3) + (this.state.agi * 3) + (this.state.vit * 2);
    if (this.state.equippedWeapon) cp += (this.state.equippedWeapon.cpBonus || 20) * (this.state.equippedWeapon.level || 1);
    if (this.state.equippedArmor) cp += (this.state.equippedArmor.cpBonus || 15) * (this.state.equippedArmor.level || 1);
    if (this.state.equippedRune) cp += (this.state.equippedRune.cpBonus || 30) * (this.state.equippedRune.level || 1);
    if (this.state.equippedSkill) cp += (this.state.equippedSkill.cpBonus || 40) * (this.state.equippedSkill.level || 1);
    if (this.state.equippedUniquePower) cp += (this.state.equippedUniquePower.cpBonus || 1000) * (this.state.equippedUniquePower.level || 1);
    if (this.state.equippedCutscene) cp += (this.state.equippedCutscene.cpBonus || 100) * (this.state.equippedCutscene.level || 1);
    if (this.state.equippedMount) cp += (this.state.equippedMount.cpBonus || 2500) * (this.state.equippedMount.level || 1);
    if (this.state.equippedPorter) cp += (this.state.equippedPorter.cpBonus || 30) * (this.state.equippedPorter.level || 1);

    if (this.state.equippedPets && Array.isArray(this.state.equippedPets) && this.state.equippedPets.length > 0) {
      this.state.equippedPets.forEach(pet => {
        if (pet) cp += (pet.cpBonus || 45) * (pet.level || 1);
      });
    } else if (this.state.equippedPet) {
      cp += (this.state.equippedPet.cpBonus || 45) * (this.state.equippedPet.level || 1);
    }

    const ascBonus = (this.state.ascensionLevel || 0) * 500;
    this.state.cp = cp + ascBonus;
  }

  public getHeroRank(level: number): { rank: string; color: string } {
    const cp = this.state.cp || 35;
    const rein = this.state.ascensionLevel || 0;

    if (rein >= 7 || cp >= 50000) return { rank: 'SSS GOD', color: '#f59e0b' };
    if (rein >= 5 || cp >= 25000) return { rank: 'SSS', color: '#fbbf24' };
    if (rein >= 4 || cp >= 10000) return { rank: 'SS', color: '#a855f7' };
    if (rein >= 3 || cp >= 5000) return { rank: 'S', color: '#ec4899' };
    if (rein >= 2 || cp >= 2500) return { rank: 'A', color: '#3b82f6' };
    if (rein >= 1 || cp >= 1000) return { rank: 'B', color: '#10b981' };
    if (cp >= 500) return { rank: 'C', color: '#06b6d4' };
    if (cp >= 150) return { rank: 'D', color: '#a855f7' };
    if (cp >= 50) return { rank: 'E', color: '#64748b' };
    return { rank: 'F', color: '#94a3b8' };
  }

  public getWorldTier(): number {
    return Math.max(1, this.state.worldTier || 1);
  }

  public getWorldTierName(): string {
    const tier = this.getWorldTier();
    const names = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return `Tier ${names[tier - 1] || tier}`;
  }

  public getScaledMonsterHp(baseHp: number): number {
    const tier = this.getWorldTier();
    return Math.floor(baseHp * (1 + (tier - 1) * 0.45));
  }

  public getScaledMonsterLvl(baseLvl: number): number {
    const tier = this.getWorldTier();
    return baseLvl + (tier - 1) * 5;
  }

  public getItemSellPrice(rarity: RarityType, level: number = 1): number {
    let base = 50;
    if (rarity === 'rare') base = 150;
    if (rarity === 'legendary') base = 400;
    if (rarity === 'mythic') base = 1000;
    return base * level;
  }

  public getClassTitle(): string {
    const rein = this.state.ascensionLevel || 0;
    const lvl = this.state.level;
    const cls = this.state.jobClass || 'WARRIOR';

    // DYNAMIC MURIM REINCARNATION TITLE SYSTEM
    if (rein >= 8) return '🐉 Celestial Murim Sword Sovereign God';
    if (rein === 7) return '✨ Heavenly Void Swordmaster Emperor';
    if (rein === 6) return '👑 Grand Qi Ancestor Sword God';
    if (rein === 5) return '🌌 Supreme Void Swordmaster Elder';
    if (rein === 4) return '🔥 Sunfire Dragon Sect Elder';
    if (rein === 3) return '⚡ Thunder Blade Sovereign Disciple';
    if (rein === 2) return '🌊 Cloud Swordmaster Adept';
    if (rein === 1) return '⚔️ Iron Sword Murim Champion';

    // BASE REIN 0 INITIATE TITLES
    if (cls === 'WARRIOR' || cls === 'SAMURAI') {
      if (lvl >= 30) return '⚔️ Grand Murim Swordmaster';
      if (lvl >= 15) return '🗡️ Murim Sword Initiate';
      return '🥉 Wandering Sword Novice';
    }
    if (cls === 'MAGE') {
      if (lvl >= 30) return '🔮 Supreme Arcane Sovereign';
      if (lvl >= 15) return '✨ Elemental Magic Adept';
      return '🧪 Apprentice Spellcaster';
    }
    if (lvl >= 30) return '🎯 Divine Windrunner Bowmaster';
    if (lvl >= 15) return '🏹 Murim Deadeye Archer';
    return '🏹 Apprentice Bow Scout';
  }

  public getChibiHeroHTML(scaleClass: string = 'scale-125'): string {
    const cls = this.state.jobClass || 'WARRIOR';
    const rein = this.state.ascensionLevel || 0;

    let head = '👧';
    let robe = '👘';
    let hat = rein >= 3 ? '👑' : '🌸';
    let weapon = this.state.equippedWeapon?.icon || '🗡️';

    const runeElem = this.state.equippedRune?.element;
    let auraGlow = 'drop-shadow-[0_0_35px_rgba(244,114,182,1)]';
    let auraHTML = `
      <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div class="w-32 h-32 rounded-full bg-gradient-to-t from-pink-600/40 via-rose-500/30 to-transparent animate-pulse border-2 border-pink-400/80 shadow-[0_0_40px_rgba(244,114,182,1)]"></div>
        <div class="absolute -top-4 text-pink-300 text-xs font-bold animate-bounce font-mono">🌸 Murim Goddess Qi</div>
      </div>
    `;

    if (runeElem === 'fire') {
      auraGlow = 'drop-shadow-[0_0_35px_rgba(239,68,68,1)]';
      auraHTML = `
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-t from-red-600/40 via-amber-500/30 to-transparent animate-pulse border-2 border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,1)]"></div>
          <div class="absolute -top-4 text-red-500 text-xs font-bold animate-bounce font-mono">🔥 Sunfire Sword Qi</div>
        </div>
      `;
    } else if (runeElem === 'lightning') {
      auraGlow = 'drop-shadow-[0_0_35px_rgba(56,189,248,1)]';
      auraHTML = `
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-t from-cyan-600/40 via-blue-500/30 to-transparent animate-pulse border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(56,189,248,1)]"></div>
          <div class="absolute -top-4 text-cyan-300 text-xs font-bold animate-bounce font-mono">⚡ Thunder Sword Qi</div>
        </div>
      `;
    }

    const titleStr = this.getClassTitle();

    return `
      <div id="chibi-hero-card" class="relative flex flex-col items-center justify-center p-2 transition transform ${scaleClass}">
        ${auraHTML}
        <div class="text-[9px] text-amber-300 font-black uppercase mb-1 flex items-center gap-1 z-10 font-mono tracking-wider">${hat} ${titleStr}</div>
        <div class="text-7xl ${auraGlow} animate-pulse my-1 z-10 relative">
          ${head}
          <span class="absolute -bottom-2 -left-2 text-3xl">${robe}</span>
        </div>
        <div class="text-4xl -mt-4 drop-shadow-[0_0_20px_rgba(244,114,182,0.9)] z-10 flex items-center gap-1">
          <span class="animate-bounce">${weapon}</span>
          <span class="text-xs text-pink-300 font-mono font-bold">✨ Flying Blade</span>
        </div>
      </div>
    `;
  }

  public getChibiHeroCardHTML(scaleClass: string = 'scale-100'): string {
    return this.getChibiHeroHTML(scaleClass);
  }

  public triggerStatGlowEffect(): void {
    const card = document.getElementById('chibi-hero-card');
    if (card) {
      card.classList.add('ring-8', 'ring-amber-400', 'shadow-[0_0_50px_rgba(251,191,36,1)]', 'scale-110');
      setTimeout(() => {
        card.classList.remove('ring-8', 'ring-amber-400', 'shadow-[0_0_50px_rgba(251,191,36,1)]', 'scale-110');
      }, 500);
    }
  }

  public updateHUDDOM(): void {
    const title = this.getClassTitle();

    ['char-title', 'hud-title', 'sys-char-title'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = title;
    });

    ['char-name', 'sys-char-name'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = this.state.name;
    });

    ['char-class', 'hud-class', 'sys-char-class'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = `${this.state.gender || 'MALE'} ${this.state.jobClass}`;
    });

    ['char-lvl', 'hud-level', 'sys-char-lvl'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = this.state.level.toString();
    });

    ['char-cp', 'sys-char-cp', 'top-cp-banner'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = `${this.state.cp} CP`;
    });

    const rankEl = document.querySelector('.rank-badge');
    if (rankEl) rankEl.textContent = this.getRankTitle();

    const ptsEl = document.getElementById('stat-points');
    if (ptsEl) ptsEl.innerText = `${this.state.statPoints} PTS`;

    const autoStatBtn = document.getElementById('btn-toggle-autostat');
    const autoStatBadge = document.getElementById('autostat-status-badge');
    if (autoStatBadge) {
      if (this.state.isAutoAllocateStats) {
        autoStatBadge.innerText = 'ON ⚡';
        autoStatBadge.className = 'text-amber-300 font-black animate-pulse';
        if (autoStatBtn) autoStatBtn.className = 'px-3 py-1 bg-amber-600 text-slate-950 font-black text-[10px] rounded-xl border border-amber-300 shadow-lg cursor-pointer transition flex items-center gap-1 scale-105';
      } else {
        autoStatBadge.innerText = 'OFF';
        autoStatBadge.className = 'text-gray-400 font-extrabold';
        if (autoStatBtn) autoStatBtn.className = 'px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-xl border border-amber-500/60 shadow cursor-pointer transition flex items-center gap-1';
      }
    }

    ['str', 'int', 'agi', 'vit'].forEach(s => {
      const el = document.getElementById(`val-${s}`);
      if (el) el.innerText = (this.state as any)[s].toString();
    });

    const hpText = document.getElementById('hud-hp-text');
    const hpBar = document.getElementById('hud-hp-bar');
    if (hpText && hpBar) {
      hpText.innerText = `${this.state.hp} / ${this.state.maxHp}`;
      const hpPct = Math.max(0, Math.min(100, (this.state.hp / this.state.maxHp) * 100));
      hpBar.style.width = `${hpPct}%`;
    }

    const expText = document.getElementById('hud-exp-text');
    const expBar = document.getElementById('hud-exp-bar');
    if (expText && expBar) {
      expText.innerText = `${this.state.exp} / ${this.state.maxExp}`;
      const expPct = Math.max(0, Math.min(100, (this.state.exp / this.state.maxExp) * 100));
      expBar.style.width = `${expPct}%`;
    }

    ['hud-gold', 'res-gold', 'gacha-hud-gold'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = this.state.gold.toLocaleString();
    });

    ['hud-gems', 'res-gems', 'gacha-hud-gems'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = this.state.gems.toLocaleString();
    });

    ['res-red-gems', 'gacha-hud-redgems'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = (this.state.redGems || 0).toLocaleString();
    });

    ['res-purple-gems', 'gacha-hud-purplegems'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = (this.state.purpleGems || 0).toLocaleString();
    });

    ['res-skill-tomes', 'gacha-hud-skilltomes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = (this.state.skillTomes || 0).toLocaleString();
    });

    ['res-ancient-books', 'gacha-hud-ancientbooks'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = (this.state.ancientBooks || 0).toLocaleString();
    });

    ['hud-keys', 'res-keys'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = `${Math.min(20, this.state.towerKeys || 0)}/20`;
    });

    const worldBanner = document.getElementById('dungeon-world-banner');
    if (worldBanner) {
      const wave = Math.max(1, Math.min(10, this.state.wave || 1));
      worldBanner.innerText = `TIER ${this.getWorldTier()} (WAVE ${wave}/10)`;
    }

    // Dynamic Class Weapon Side Displays (Left & Right)
    const cls = this.state.jobClass || 'WARRIOR';
    let sideIcon = '🗡️';
    let sideBarGradient = 'from-emerald-400 to-amber-300';
    let borderColor = 'border-emerald-400/60';

    if (cls === 'MAGE') {
      sideIcon = '🔮';
      sideBarGradient = 'from-cyan-400 to-purple-400';
      borderColor = 'border-cyan-400/60';
    } else if (cls === 'ARCHER') {
      sideIcon = '🏹';
      sideBarGradient = 'from-emerald-400 to-teal-300';
      borderColor = 'border-teal-400/60';
    }

    ['side-left-icon', 'side-right-icon'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = sideIcon;
    });

    ['side-weapon-left', 'side-weapon-right'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.className = `w-14 h-44 glass-panel ${borderColor} rounded-full flex flex-col items-center justify-around py-4 text-3xl shadow-2xl animate-float`;
    });

    ['side-left-bar', 'side-right-bar'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.className = `w-2 h-20 bg-gradient-to-b ${sideBarGradient} rounded-full`;
    });

    this.updateCharacterPreviewDOM();
  }

  public getNextLevelMaxExp(level: number): number {
    const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
    const result = Math.floor(100 * Math.pow(1.25, safeLevel - 1));
    return (isNaN(result) || result < 100 || !isFinite(result)) ? 100 : result;
  }

  public updateCharacterPreviewDOM(): void {
    const avatarContainer = document.getElementById('preview-chibi-avatar');
    if (avatarContainer) {
      avatarContainer.innerHTML = this.getChibiHeroCardHTML('scale-100');
    }

    const rankInfo = this.getHeroRank(this.state.level);
    const rankEl = document.getElementById('char-rank-badge');
    if (rankEl) {
      rankEl.innerText = `RANK ${rankInfo.rank}`;
      rankEl.style.color = rankInfo.color;
      rankEl.style.borderColor = rankInfo.color;
    }

    const ascReqEl = document.getElementById('ascension-req-text');
    if (ascReqEl) {
      ascReqEl.innerText = `${this.getAscensionReqLevel()}`;
    }

    const ascLvlEl = document.getElementById('ascension-lvl-text');
    if (ascLvlEl) {
      ascLvlEl.innerText = `REIN ${this.state.ascensionLevel || 0}`;
    }

    this.updateSlotPreview('slot-preview-weapon', this.state.equippedWeapon, 'WEAPON', '🗡️', this.state.isWeaponLocked);
    this.updateSlotPreview('slot-preview-armor', this.state.equippedArmor, 'ARMOR', '🥋', this.state.isArmorLocked);
    this.updateSlotPreview('slot-preview-rune', this.state.equippedRune, 'RUNE', '🔥', this.state.isRuneLocked);
    this.updateSlotPreview('slot-preview-skill', this.state.equippedSkill, 'SKILL', '⚡', this.state.isSkillLocked);
    this.updateSlotPreview('slot-preview-uniquepower', this.state.equippedUniquePower, 'UNIQUE POWER', '👑', this.state.isUniquePowerLocked);
    this.updateSlotPreview('slot-preview-cutscene', this.state.equippedCutscene, 'CUTSCENE', '🎬', this.state.isCutsceneLocked);
    this.updateSlotPreview('slot-preview-mount', this.state.equippedMount, 'MOUNT', '🐉', this.state.isMountLocked);

    const equippedPets = this.state.equippedPets || [];
    const petSlotIds = ['slot-preview-pet', 'slot-preview-pet2', 'slot-preview-pet3', 'slot-preview-pet4', 'slot-preview-pet5'];
    petSlotIds.forEach((slotId, idx) => {
      const petItem = equippedPets[idx] || null;
      this.updateSlotPreview(slotId, petItem, `PET ${idx + 1}`, '🐾', this.state.isPetLocked);
    });
  }

  public getRankTitle(): string {
    const rankInfo = this.getHeroRank(this.state.level);
    return `RANK ${rankInfo.rank}`;
  }

  public getAscensionReqLevel(): number {
    const currentAsc = this.state.ascensionLevel || 0;
    return 25 + (currentAsc * 25); // REIN 0 = Level 25, REIN 1 = Level 50, REIN 2 = Level 75, etc.
  }


  public getReincarnationExpMultiplier(): number {
    const reinLevel = this.state.ascensionLevel || 0;
    // STACKING BONUS EXP PER REINCARNATION LEVEL:
    // REIN 0 = 1.0x (+0% Bonus EXP)
    // REIN 1 = 1.5x (+50% Stacking Bonus EXP per kill)
    // REIN 2 = 2.0x (+100% Stacking Bonus EXP per kill)
    // REIN 3 = 2.5x (+150% Stacking Bonus EXP per kill), etc.
    return 1.0 + (reinLevel * 0.50);
  }

  public getReincarnationMultiplier(): number {
    const reinLevel = this.state.ascensionLevel || 0;
    return 1 + (reinLevel * 0.05); // +5% per REIN level, stacking!
  }

  public ascendMountainPeak(): { success: boolean; message: string; cutsceneObtained?: string } {
    return this.performAscension();
  }

  public performAscension(): { success: boolean; message: string; cutsceneObtained?: string } {
    const currentAsc = this.state.ascensionLevel || 0;
    const reqLevel = 25 + (currentAsc * 25);

    if (this.state.level < reqLevel) {
      return {
        success: false,
        message: `⚠️ Level ${reqLevel} required for Reincarnation REIN ${currentAsc + 1}! (Current Level: ${this.state.level})`
      };
    }

    // Reset Hero Level back to Level 1
    this.state.level = 1;
    this.state.exp = 0;
    this.state.maxExp = 100;

    // Reset World Tier & Waves back to Tier 1, Wave 1
    this.state.worldTier = 1;
    this.state.wave = 1;
    this.state.waveKills = 0;

    // Reset Currencies
    this.state.gold = 0;
    this.state.gems = 0;
    this.state.redGems = 0;
    this.state.purpleGems = 0;
    this.state.towerKeys = 20;
    this.state.skillTomes = 0;
    this.state.ancientBooks = 0;

    // Increment Reincarnate Level
    this.state.ascensionLevel = (this.state.ascensionLevel || 0) + 1;

    // Recalculate CP (adds +500 CP per REIN level)
    this.recalculateCP();

    // Roll or Upgrade 1 of 3 Ultimate Cutscenes
    const cutsceneOptions = [
      {
        id: 'cutscene-shadow-arise',
        cutsceneId: 'shadow_arise',
        name: 'SHADOW ARISE',
        icon: '🌑',
        cpBonus: 100,
        description: 'Summons dark shadow monarchs to annihilate all enemies in a 5s cinematic burst!'
      },
      {
        id: 'cutscene-getsuga-tensho',
        cutsceneId: 'getsuga_tensho',
        name: 'GETSUGA TENSHO',
        icon: '⚔️',
        cpBonus: 150,
        description: 'Slices a massive glowing crescent moon spiritual blade across the screen!'
      },
      {
        id: 'cutscene-i-am-atomic',
        cutsceneId: 'i_am_atomic',
        name: 'I AM ATOMIC',
        icon: '💥',
        cpBonus: 220,
        description: 'Concentrates atomic aura into a screen-shattering nuclear explosion!'
      }
    ];

    const chosen = cutsceneOptions[Math.floor(Math.random() * cutsceneOptions.length)];
    const existing = this.state.inventory.find(i => i.cutsceneId === chosen.cutsceneId);

    if (existing) {
      existing.count++;
      existing.level = (existing.level || 1) + 1;
      existing.cpBonus = chosen.cpBonus * existing.level;
      this.notify();
      this.saveToFirebase();
      return {
        success: true,
        message: `✨ GOLD REINCARNATION COMPLETE (REIN ${this.state.ascensionLevel})! Upgraded ${chosen.name} to Level ${existing.level} (+${existing.cpBonus} CP)!`,
        cutsceneObtained: chosen.name
      };
    } else {
      const newItem: InventoryItem = {
        id: `cutscene-${Date.now()}`,
        name: chosen.name,
        type: 'cutscene',
        rarity: 'mythic',
        icon: chosen.icon,
        cutsceneId: chosen.cutsceneId as CutsceneId,
        cpBonus: chosen.cpBonus,
        level: 1,
        count: 1,
        description: chosen.description,
        isLocked: false
      };
      this.state.inventory.push(newItem);
      if (!this.state.equippedCutscene) this.state.equippedCutscene = newItem;

      this.notify();
      this.saveToFirebase();
      return {
        success: true,
        message: `✨ GOLD REINCARNATION COMPLETE (REIN ${this.state.ascensionLevel})! Unlocked NEW CUTSCENE: ${chosen.name}!`,
        cutsceneObtained: chosen.name
      };
    }
  }

  public autoEquipBestPet(): void {
    if (this.state.isPetLocked) return;
    const pets = this.state.inventory.filter(i => i.type === 'companion');
    if (pets.length === 0) return;

    pets.sort((a, b) => {
      const cpA = (a.cpBonus || 0) * (a.level || 1);
      const cpB = (b.cpBonus || 0) * (b.level || 1);
      return cpB - cpA;
    });

    // Select top 5 best pets
    this.state.equippedPets = pets.slice(0, 5);
    this.state.equippedPet = this.state.equippedPets[0] || null;

    this.recalculateCP();
    this.notify();
    this.saveToFirebase();
  }

  public equipPet(pet: InventoryItem): void {
    if (!this.state.equippedPets) this.state.equippedPets = [];

    const existingIndex = this.state.equippedPets.findIndex(p => p.id === pet.id);
    if (existingIndex >= 0) {
      this.state.equippedPets.splice(existingIndex, 1);
    } else {
      if (this.state.equippedPets.length >= 5) {
        this.state.equippedPets[4] = pet;
      } else {
        this.state.equippedPets.push(pet);
      }
    }

    this.state.equippedPet = this.state.equippedPets[0] || null;
    this.recalculateCP();
    this.notify();
    this.saveToFirebase();
  }

  public autoEquipBestCutscene(): void {
    if (this.state.isCutsceneLocked) return;
    const cutscenes = this.state.inventory.filter(i => i.type === 'cutscene');
    if (cutscenes.length === 0) return;

    cutscenes.sort((a, b) => {
      const cpA = (a.cpBonus || 0) * (a.level || 1);
      const cpB = (b.cpBonus || 0) * (b.level || 1);
      return cpB - cpA;
    });

    this.state.equippedCutscene = cutscenes[0];
    this.notify();
    this.saveToFirebase();
  }

  public autoEquipBestMount(): void {
    if (this.state.isMountLocked) return;
    const mounts = this.state.inventory.filter(i => i.type === 'mount');
    if (mounts.length === 0) return;

    mounts.sort((a, b) => {
      const cpA = (a.cpBonus || 2500) * (a.level || 1);
      const cpB = (b.cpBonus || 2500) * (b.level || 1);
      return cpB - cpA;
    });

    this.state.equippedMount = mounts[0];
    this.recalculateCP();
    this.notify();
    this.saveToFirebase();
  }

  public dropRandomMythicMount(): { item: InventoryItem; isUpgrade: boolean; message: string } {
    const mountVariants = [
      { name: 'Thunder Stallion', icon: '⚡', cpBonus: 2500, desc: 'Celestial electric blue stallion mount! Grants +40% Move Speed and 2.5k CP.' },
      { name: 'Sunfire Flame Dragon', icon: '🐉', cpBonus: 3800, desc: 'Imperial golden flame dragon beast! Grants +50% Move Speed and 3.8k CP.' },
      { name: 'Celestial Ice Fenrir', icon: '🐺', cpBonus: 3200, desc: 'Frost wolf god mount of the North! Grants +45% Move Speed and 3.2k CP.' },
      { name: 'Golden Sovereign Lion', icon: '🦁', cpBonus: 3000, desc: 'Imperial war lion with golden mane! Grants +42% Move Speed and 3.0k CP.' },
      { name: 'Storm Pegasus', icon: '🦅', cpBonus: 2800, desc: 'Winged sky stallion of the storm peaks! Grants +40% Move Speed and 2.8k CP.' },
      { name: 'Obsidian Shadow Tiger', icon: '🐅', cpBonus: 3500, desc: 'Shadow monarch tiger mount! Grants +48% Move Speed and 3.5k CP.' },
      { name: 'Abyss Iron Turtle', icon: '🐢', cpBonus: 4000, desc: 'Indestructible armored fortress turtle! Grants +30% Move Speed and 4.0k CP.' },
      { name: 'Starfall Unicorn', icon: '🦄', cpBonus: 2900, desc: 'Starlight horned celestial mount! Grants +42% Move Speed and 2.9k CP.' },
      { name: 'Mecha Cyber Behemoth', icon: '🤖', cpBonus: 4500, desc: 'Futuristic cybernetic war behemoth! Grants +55% Move Speed and 4.5k CP.' },
      { name: 'Nether Hydra Leviathan', icon: '🐍', cpBonus: 5000, desc: 'Mythic multi-headed abyssal serpent mount! Grants +60% Move Speed and 5.0k CP.' }
    ];

    const chosen = mountVariants[Math.floor(Math.random() * mountVariants.length)];
    const existing = this.state.inventory.find(i => i.type === 'mount' && i.name === chosen.name);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.level = (existing.level || 1) + 1;
      existing.cpBonus = chosen.cpBonus * existing.level;

      this.recalculateCP();
      this.notify();
      this.saveToFirebase();

      return {
        item: existing,
        isUpgrade: true,
        message: `🐉 DUPLICATE MOUNT! Upgraded ${existing.name} to Level ${existing.level} (+${existing.cpBonus} CP)!`
      };
    } else {
      const newMount: InventoryItem = {
        id: `mount-${Date.now()}`,
        name: chosen.name,
        type: 'mount',
        rarity: 'mythic',
        icon: chosen.icon,
        cpBonus: chosen.cpBonus,
        level: 1,
        count: 1,
        description: chosen.desc,
        isLocked: false
      };

      this.state.inventory.push(newMount);
      if (!this.state.equippedMount) {
        this.state.equippedMount = newMount;
      }

      this.recalculateCP();
      this.notify();
      this.saveToFirebase();

      return {
        item: newMount,
        isUpgrade: false,
        message: `👑 WORLD SOVEREIGN DEFEATED! Unlocked NEW MYTHIC MOUNT: ${newMount.name} (+${newMount.cpBonus} CP)!`
      };
    }
  }

  public autoEquipBestPorter(): void {
    if (this.state.isPorterLocked) return;
    const porters = this.state.inventory.filter(i => i.type === 'porter');
    if (porters.length === 0) return;

    porters.sort((a, b) => {
      const cpA = (a.cpBonus || 30) * (a.level || 1);
      const cpB = (b.cpBonus || 30) * (b.level || 1);
      return cpB - cpA;
    });

    this.state.equippedPorter = porters[0];
    this.recalculateCP();
    this.notify();
    this.saveToFirebase();
  }

  public grantOrUpgradePorter(variantId?: string): { item: InventoryItem; isUpgrade: boolean; message: string } {
    let variant: PorterVariant;
    if (variantId) {
      variant = PORTER_VARIANTS.find(v => v.id === variantId) || PORTER_VARIANTS[0];
    } else {
      const rand = Math.random();
      if (rand < 0.10) variant = PORTER_VARIANTS[3]; // Mythic (10%)
      else if (rand < 0.30) variant = PORTER_VARIANTS[2]; // Legendary (20%)
      else if (rand < 0.60) variant = PORTER_VARIANTS[1]; // Rare (30%)
      else variant = PORTER_VARIANTS[0]; // Common (40%)
    }

    const existing = this.state.inventory.find(i => i.type === 'porter' && i.name === variant.name);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.level = (existing.level || 1) + 1;
      existing.cpBonus = variant.cpBonus * existing.level;
      existing.porterSpeedMs = Math.max(200, Math.floor(variant.speedMs / (1 + (existing.level - 1) * 0.15)));

      this.recalculateCP();
      this.notify();
      this.saveToFirebase();

      return {
        item: existing,
        isUpgrade: true,
        message: `⚒️ PORTER DUPLICATE OBTAINED! Upgraded ${existing.name} to Level ${existing.level} (+${existing.cpBonus} CP, Speed: ${(existing.porterSpeedMs / 1000).toFixed(1)}s)!`
      };
    } else {
      const newPorter: InventoryItem = {
        id: `porter-${Date.now()}`,
        name: variant.name,
        type: 'porter',
        rarity: variant.rarity,
        icon: variant.icon,
        cpBonus: variant.cpBonus,
        level: 1,
        count: 1,
        porterSpeedMs: variant.speedMs,
        porterRadiusPx: variant.radiusPx,
        description: variant.description,
        porterLore: variant.lore,
        isLocked: false
      };

      this.state.inventory.push(newPorter);
      if (!this.state.equippedPorter) {
        this.state.equippedPorter = newPorter;
      }

      this.recalculateCP();
      this.notify();
      this.saveToFirebase();

      return {
        item: newPorter,
        isUpgrade: false,
        message: `🎒 NEW PORTER UNLOCKED: ${newPorter.name} (${newPorter.rarity.toUpperCase()}) (+${newPorter.cpBonus} CP, Speed: ${(newPorter.porterSpeedMs! / 1000).toFixed(1)}s)!`
      };
    }
  }

  private updateSlotPreview(containerId: string, item: InventoryItem | null, typeLabel: string, defaultIcon: string, isLocked?: boolean): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (item) {
      el.innerHTML = `
        <div class="relative w-full flex flex-col items-center">
          <span class="absolute -top-1 -right-1 text-xs cursor-pointer" onclick="window.toggleEquippedSlotLock('${typeLabel.toLowerCase()}')">${isLocked ? '🔒' : '🔓'}</span>
          <span class="text-2xl mb-1">${item.icon}</span>
          <span class="text-[9px] font-black text-white truncate w-full">${item.name}</span>
          <span class="text-[8px] text-amber-300 font-mono">Lvl ${item.level || 1} (+${(item.cpBonus || 15) * (item.level || 1)} CP)</span>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="relative w-full flex flex-col items-center opacity-50">
          <span class="absolute -top-1 -right-1 text-xs cursor-pointer" onclick="window.toggleEquippedSlotLock('${typeLabel.toLowerCase()}')">${isLocked ? '🔒' : '🔓'}</span>
          <span class="text-2xl mb-1">${defaultIcon}</span>
          <span class="text-[9px] font-bold text-emerald-400">NO ${typeLabel}</span>
        </div>
      `;
    }
  }
}
