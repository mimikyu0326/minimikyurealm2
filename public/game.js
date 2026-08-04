"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/client/services/AudioService.ts
  var _AudioService, AudioService;
  var init_AudioService = __esm({
    "src/client/services/AudioService.ts"() {
      "use strict";
      _AudioService = class _AudioService {
        constructor() {
          __publicField(this, "audioCtx", null);
          __publicField(this, "isBgmPlaying", true);
          // DEFAULT ON AS REQUESTED!
          __publicField(this, "masterVolume", 0.8);
          // HIGHER DEFAULT VOLUME (80%)
          __publicField(this, "bgmAudio", null);
          this.initAudioElement();
        }
        static getInstance() {
          if (!_AudioService.instance) {
            _AudioService.instance = new _AudioService();
          }
          return _AudioService.instance;
        }
        initAudioElement() {
          if (typeof window === "undefined") return;
          if (!this.bgmAudio) {
            this.bgmAudio = new Audio("assets/game_music/bgm_cyberpunk.mp3");
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = this.masterVolume;
          }
        }
        initCtx() {
          if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass();
          }
          if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
          }
          return this.audioCtx;
        }
        toggleBGM() {
          if (this.isBgmPlaying) {
            this.stopBGM();
            return false;
          } else {
            this.isBgmPlaying = true;
            this.startBGM(true);
            return true;
          }
        }
        isBgmActive() {
          return this.isBgmPlaying;
        }
        setVolume(vol) {
          this.masterVolume = Math.max(0, Math.min(1, vol));
          if (this.bgmAudio) {
            this.bgmAudio.volume = this.masterVolume;
          }
        }
        getVolume() {
          return this.masterVolume;
        }
        startBGM(force = false) {
          this.isBgmPlaying = true;
          this.initAudioElement();
          if (this.bgmAudio) {
            this.bgmAudio.volume = this.masterVolume;
            const playPromise = this.bgmAudio.play();
            if (playPromise !== void 0) {
              playPromise.catch((err) => {
                console.warn("[AUDIO] Autoplay prevented, waiting for user interaction:", err);
              });
            }
          }
        }
        stopBGM() {
          this.isBgmPlaying = false;
          if (this.bgmAudio) {
            this.bgmAudio.pause();
          }
        }
        playSound(type) {
          try {
            const ctx = this.initCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime;
            if (type === "attack") {
              osc.type = "sawtooth";
              osc.frequency.setValueAtTime(450, now);
              osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
              gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
              osc.start(now);
              osc.stop(now + 0.15);
            } else if (type === "hit") {
              osc.type = "square";
              osc.frequency.setValueAtTime(180, now);
              osc.frequency.linearRampToValueAtTime(60, now + 0.12);
              gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
              osc.start(now);
              osc.stop(now + 0.12);
            } else if (type === "levelup") {
              osc.type = "triangle";
              osc.frequency.setValueAtTime(523, now);
              osc.frequency.setValueAtTime(659, now + 0.1);
              osc.frequency.setValueAtTime(783, now + 0.2);
              osc.frequency.setValueAtTime(1046, now + 0.3);
              gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
              osc.start(now);
              osc.stop(now + 0.6);
            } else if (type === "click") {
              osc.type = "sine";
              osc.frequency.setValueAtTime(300, now);
              osc.frequency.linearRampToValueAtTime(600, now + 0.2);
              gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
              osc.start(now);
              osc.stop(now + 0.2);
            } else if (type === "gacha") {
              osc.type = "sine";
              osc.frequency.setValueAtTime(440, now);
              osc.frequency.linearRampToValueAtTime(880, now + 0.4);
              gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
              osc.start(now);
              osc.stop(now + 0.4);
            } else if (type === "victory") {
              osc.type = "triangle";
              osc.frequency.setValueAtTime(587.33, now);
              osc.frequency.setValueAtTime(739.99, now + 0.15);
              osc.frequency.setValueAtTime(880, now + 0.3);
              gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
              gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
              osc.start(now);
              osc.stop(now + 0.5);
            }
          } catch (e) {
            console.warn("[AUDIO] Error playing sound effect:", e);
          }
        }
      };
      __publicField(_AudioService, "instance");
      AudioService = _AudioService;
    }
  });

  // src/client/services/UIService.ts
  var UIService_exports = {};
  __export(UIService_exports, {
    UIService: () => UIService
  });
  var _UIService, UIService;
  var init_UIService = __esm({
    "src/client/services/UIService.ts"() {
      "use strict";
      init_AudioService();
      _UIService = class _UIService {
        constructor() {
          __publicField(this, "audio", AudioService.getInstance());
          this.createSystemModalDOM();
          this.createToastContainerDOM();
        }
        static getInstance() {
          if (!_UIService.instance) {
            _UIService.instance = new _UIService();
          }
          return _UIService.instance;
        }
        createToastContainerDOM() {
          if (document.getElementById("rpg-toast-container")) return;
          const container = document.createElement("div");
          container.id = "rpg-toast-container";
          container.className = "fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 pointer-events-none max-w-xs w-full";
          document.body.appendChild(container);
        }
        createSystemModalDOM() {
          if (document.getElementById("rpg-modal-overlay")) return;
          const overlay = document.createElement("div");
          overlay.id = "rpg-modal-overlay";
          overlay.className = "hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300";
          overlay.innerHTML = `
      <div id="rpg-modal-card" class="glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-emerald-400 shadow-2xl text-center relative animate-scaleUp">
        <div id="rpg-modal-icon" class="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-400 inline-flex items-center justify-center text-3xl mb-3 shadow-lg">
          \u{1F4DC}
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
        showAlert(title, message, icon = "\u2694\uFE0F", type = "info") {
          this.audio.playSound(type === "error" || type === "warning" ? "hit" : "click");
          const overlay = document.getElementById("rpg-modal-overlay");
          const card = document.getElementById("rpg-modal-card");
          const iconEl = document.getElementById("rpg-modal-icon");
          const titleEl = document.getElementById("rpg-modal-title");
          const msgEl = document.getElementById("rpg-modal-message");
          const btn = document.getElementById("rpg-modal-btn");
          if (!overlay || !card || !titleEl || !msgEl || !btn || !iconEl) return;
          iconEl.innerText = icon;
          titleEl.innerText = title;
          msgEl.innerText = message;
          if (type === "error" || type === "warning") {
            card.className = "glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-red-500/80 shadow-2xl text-center relative animate-scaleUp";
            btn.className = "w-full py-3.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-xs font-black text-white rounded-xl shadow-xl border border-red-300/40 uppercase tracking-wider";
          } else if (type === "success") {
            card.className = "glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-emerald-400 shadow-2xl text-center relative animate-scaleUp";
            btn.className = "w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-xs font-black text-white rounded-xl shadow-xl border border-emerald-300/40 uppercase tracking-wider";
          } else {
            card.className = "glass-panel w-full max-w-md p-6 rounded-3xl border-2 border-cyan-500 shadow-2xl text-center relative animate-scaleUp";
            btn.className = "w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-xs font-black text-white rounded-xl shadow-xl border border-cyan-300/40 uppercase tracking-wider";
          }
          overlay.classList.remove("hidden");
          btn.onclick = () => {
            overlay.classList.add("hidden");
          };
        }
        shortenToastMsg(msg) {
          if (msg.includes("LEVEL UP! FULL HP RECOVERED")) return "\u{1F49A} Level Up! HP Fully Restored";
          if (msg.includes("Auto-Equipped TOP 5 Companion Pet Squad!")) return "\u26A1 Auto-Equipped Top 5 Pet Squad";
          if (msg.includes("Auto-Equipped TOP Gear Loadout!")) return "\u26A1 Auto-Equipped Best Gear Loadout";
          if (msg.includes("AUTO Mode (Battle & Loot Collect) Activated!")) return "\u2694\uFE0F Auto-Battle: ON \u{1F525}";
          if (msg.includes("AUTO Mode Deactivated.")) return "\u2694\uFE0F Auto-Battle: OFF";
          if (msg.includes("Equipped best item into loadout slot!")) return "\u26A1 Equipped Best Item";
          if (msg.includes("Unequipped Companion Pet.")) return "\u{1F43E} Unequipped Companion Pet";
          if (msg.includes("Sold all duplicate equipment & runes!")) return "\u{1FA99} Sold All Duplicate Items";
          if (msg.includes("ULTIMATE CUTSCENE EXECUTED! ALL ENEMIES ANNIHILATED!")) return "\u{1F4A5} Ultimate Cutscene Executed!";
          return msg;
        }
        showToast(msg, type = "info") {
          const container = document.getElementById("rpg-toast-container");
          if (!container) return;
          const briefMsg = this.shortenToastMsg(msg);
          const toast = document.createElement("div");
          toast.className = `glass-panel p-3 px-3.5 rounded-2xl border text-xs font-extrabold shadow-2xl flex items-center gap-2.5 transition-all duration-300 -translate-x-10 opacity-0 pointer-events-auto ${type === "success" ? "border-emerald-400 text-emerald-100 bg-emerald-950/95" : type === "warning" ? "border-amber-400 text-amber-100 bg-amber-950/95" : "border-cyan-400 text-cyan-100 bg-cyan-950/95"}`;
          const icon = type === "success" ? "\u2728" : type === "warning" ? "\u26A0\uFE0F" : "\u26A1";
          toast.innerHTML = `
      <span class="text-base">${icon}</span>
      <span class="flex-1">${briefMsg}</span>
    `;
          container.appendChild(toast);
          setTimeout(() => {
            toast.classList.remove("-translate-x-10", "opacity-0");
          }, 10);
          setTimeout(() => {
            toast.classList.add("-translate-x-10", "opacity-0");
            setTimeout(() => toast.remove(), 300);
          }, 3e3);
        }
      };
      __publicField(_UIService, "instance");
      UIService = _UIService;
    }
  });

  // src/client/services/GameStateService.ts
  var GameStateService_exports = {};
  __export(GameStateService_exports, {
    GameStateService: () => GameStateService,
    PORTER_VARIANTS: () => PORTER_VARIANTS,
    decryptData: () => decryptData,
    deleteSessionCookie: () => deleteSessionCookie,
    encryptData: () => encryptData,
    getSessionCookie: () => getSessionCookie,
    setSessionCookie: () => setSessionCookie
  });
  function encryptData(str) {
    try {
      const encoded = encodeURIComponent(str);
      return btoa(encoded.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ i % 7 + 13)).join(""));
    } catch (e) {
      return btoa(encodeURIComponent(str));
    }
  }
  function decryptData(str) {
    try {
      const decoded = atob(str);
      return decodeURIComponent(decoded.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ i % 7 + 13)).join(""));
    } catch (e) {
      return decodeURIComponent(atob(str));
    }
  }
  function setSessionCookie(name, value, days = 7) {
    if (typeof document === "undefined") return;
    const d = /* @__PURE__ */ new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1e3);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
  }
  function getSessionCookie(name) {
    if (typeof document === "undefined") return null;
    const cname = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return null;
  }
  function deleteSessionCookie(name) {
    setSessionCookie(name, "", -1);
  }
  var PORTER_VARIANTS, _GameStateService, GameStateService;
  var init_GameStateService = __esm({
    "src/client/services/GameStateService.ts"() {
      "use strict";
      PORTER_VARIANTS = [
        {
          id: "porter-forge-dwarf",
          name: "Rustic Forge Dwarf",
          rarity: "common",
          icon: "\u2692\uFE0F",
          cpBonus: 30,
          speedMs: 2500,
          radiusPx: 140,
          description: "Subterranean ironworks dwarf carrying a heavy leather coin sack.",
          lore: "Hailing from the Iron Foothills, this industrious dwarf spends his days scouring battlefields to scoop up copper coins and raw iron scraps into his sturdy sack."
        },
        {
          id: "porter-pack-automaton",
          name: "Ironclad Pack Automaton",
          rarity: "rare",
          icon: "\u{1F916}",
          cpBonus: 80,
          speedMs: 1800,
          radiusPx: 200,
          description: "Clockwork brass construct equipped with magnetic gears & vacuum bellows.",
          lore: "Engineered by ancient Murim mechanists, this brass automaton hums as its magnetic core attracts discarded weapons and gemstones across vast ruins."
        },
        {
          id: "porter-vault-goblin",
          name: "Golden Vault Goblin",
          rarity: "legendary",
          icon: "\u{1F47A}",
          cpBonus: 250,
          speedMs: 1e3,
          radiusPx: 280,
          description: "Nimble goblin treasure hunter wearing a gilded silk vest & coin pouch.",
          lore: "Obsessed with sparkling mythic loot, this energetic goblin dashes lightning-fast across battlefields, snatching gold coins and rare drops before they touch the ground."
        },
        {
          id: "porter-mithril-king",
          name: "Celestial Mithril Dwarf King",
          rarity: "mythic",
          icon: "\u{1F9D9}\u200D\u2642\uFE0F",
          cpBonus: 1500,
          speedMs: 400,
          radiusPx: 420,
          description: "Dwarven monarch wielding a glowing rune-encrusted magnet hammer!",
          lore: "Sovereign of the Nether Forge, King Thorin commands celestial gravity waves. With a strike of his rune hammer, all dropped loot on the screen flies instantly into his enchanted royal chest!"
        }
      ];
      _GameStateService = class _GameStateService {
        constructor() {
          __publicField(this, "listeners", []);
          __publicField(this, "saveDebounceTimer", null);
          __publicField(this, "state", {
            userId: "guest-1",
            name: "KyuHero",
            gender: "MALE",
            jobClass: "WARRIOR",
            level: 1,
            exp: 0,
            maxExp: 100,
            gold: 500,
            gems: 20,
            redGems: 500,
            purpleGems: 50,
            skillTomes: 500,
            ancientBooks: 50,
            heroAuraMeter: 0,
            towerKeys: 3,
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
                id: "starter-sword-1",
                name: "Viking Steel Sword",
                type: "weapon",
                rarity: "common",
                icon: "\u{1F5E1}\uFE0F",
                cpBonus: 20,
                level: 1,
                count: 1,
                description: "A reliable steel blade forged for apprentice swordsmen.",
                isLocked: false
              },
              {
                id: "starter-armor-1",
                name: "Jade Guardian Armor",
                type: "armor",
                rarity: "common",
                icon: "\u{1F94B}",
                cpBonus: 15,
                level: 1,
                count: 1,
                description: "Lightweight emerald armor crafted for agile movement.",
                isLocked: false
              },
              {
                id: "starter-pet-1",
                name: "Crimson Flame Drake",
                type: "companion",
                rarity: "mythic",
                icon: "\u{1F432}",
                petAttackType: "laser",
                cpBonus: 2800,
                level: 1,
                count: 1,
                description: "Mythic crimson dragon breathing high-temp flame lasers across dungeon waves.",
                isLocked: false
              },
              {
                id: "starter-pet-2",
                name: "Thunder Spark Kitsune",
                type: "companion",
                rarity: "legendary",
                icon: "\u26A1",
                petAttackType: "sniper",
                cpBonus: 1200,
                level: 1,
                count: 1,
                description: "Nine-tailed celestial fox shooting high-voltage lightning bolt snipes.",
                isLocked: false
              },
              {
                id: "starter-pet-3",
                name: "Celestial Void Behemoth",
                type: "companion",
                rarity: "mythic",
                icon: "\u{1F30C}",
                petAttackType: "mage",
                cpBonus: 2900,
                level: 1,
                count: 1,
                description: "Cosmic shadow spirit emitting pulsing violet void shockwave explosions.",
                isLocked: false
              },
              {
                id: "starter-pet-4",
                name: "Frostbite Fenrir Wolf",
                type: "companion",
                rarity: "legendary",
                icon: "\u{1F43A}",
                petAttackType: "slash",
                cpBonus: 1150,
                level: 1,
                count: 1,
                description: "Gigantic ice wolf lunging into monsters with razor-sharp frozen claw strikes.",
                isLocked: false
              },
              {
                id: "starter-pet-5",
                name: "Aegis Golden Gryphon",
                type: "companion",
                rarity: "legendary",
                icon: "\u{1F985}",
                petAttackType: "shield",
                cpBonus: 1100,
                level: 1,
                count: 1,
                description: "Holy gryphon generating golden divine holy shield barriers that protect the squad.",
                isLocked: false
              },
              {
                id: "starter-cutscene-1",
                name: "SHADOW ARISE",
                type: "cutscene",
                rarity: "mythic",
                icon: "\u{1F311}",
                cutsceneId: "shadow_arise",
                cpBonus: 100,
                level: 1,
                count: 1,
                description: "Summons dark shadow monarchs to annihilate all enemies in a 5s cinematic burst!",
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
            isWeaponLocked: false,
            isArmorLocked: false,
            isRuneLocked: false,
            isSkillLocked: false,
            isPetLocked: false,
            isCutsceneLocked: false,
            isMountLocked: false,
            idleVault: {
              accumulatedExp: 0,
              accumulatedGold: 0,
              startTime: Date.now(),
              lastClaimTime: Date.now() - 6e3
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
          });
          __publicField(this, "listenUnsubscribe", null);
          if (typeof window !== "undefined") {
            window.encryptData = encryptData;
            window.decryptData = decryptData;
            window.logoutCurrentAccount = () => this.logout();
            window.manualSaveCharacterRecord = () => this.manualSaveCharacterRecord();
          }
          this.recalculateCP();
          this.startIdleVaultTimer();
          this.loadFromLocalStorage();
          if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () => {
              if (this.state.userId && this.state.userId !== "guest-1") {
                this.flushSaveToFirebase();
                this.saveToLocalStorage();
                deleteSessionCookie("minimikyurealm_logged_user");
                localStorage.removeItem("minimikyurealm_logged_user");
              }
            });
            setInterval(() => {
              if (this.state.userId && this.state.userId !== "guest-1") {
                this.flushSaveToFirebase();
              }
            }, 2e4);
          }
        }
        saveToLocalStorage() {
          try {
            if (!this.state.userId || this.state.userId === "guest-1") return;
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
            console.warn("[STORAGE] LocalStorage save error:", e);
          }
        }
        loadFromLocalStorage() {
          try {
            const loggedUser = localStorage.getItem("minimikyurealm_logged_user");
            if (!loggedUser) return;
            const raw = localStorage.getItem(`minimikyurealm_state_${loggedUser}`);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.userId === loggedUser) {
                this.loadFromSavedCharacter(parsed);
                console.log(`[STORAGE] \u{1F4BE} Loaded state for user "${loggedUser}"!`);
              }
            }
          } catch (e) {
            console.warn("[STORAGE] LocalStorage load error:", e);
          }
        }
        logout() {
          const currentUserId = this.state.userId;
          if (this.listenUnsubscribe) {
            try {
              this.listenUnsubscribe();
            } catch (e) {
            }
            this.listenUnsubscribe = null;
          }
          if (currentUserId && currentUserId !== "guest-1") {
            try {
              this.flushSaveToFirebase();
            } catch (e) {
            }
            localStorage.removeItem(`minimikyurealm_state_${currentUserId}`);
          }
          deleteSessionCookie("minimikyu_logged_user");
          deleteSessionCookie("minimikyurealm_logged_user");
          localStorage.removeItem("minimikyu_logged_user");
          localStorage.removeItem("minimikyurealm_logged_user");
          localStorage.removeItem("minimikyurealm_state");
          this.resetStateToDefault();
          this.notify();
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
        async deleteUserAccountPermanent() {
          const userId = this.state.userId;
          if (!userId || userId === "guest-1") {
            return false;
          }
          try {
            if (window.FirebaseApp) {
              const { db, ref, remove, set } = window.FirebaseApp;
              const userRef = ref(db, `users/${userId}`);
              if (typeof remove === "function") {
                await remove(userRef);
              } else if (typeof set === "function") {
                await set(userRef, null);
              }
              const charRef = ref(db, `users/${userId}/character`);
              if (typeof remove === "function") await remove(charRef);
              else if (typeof set === "function") await set(charRef, null);
              console.log(`[FIREBASE] \u{1F5D1}\uFE0F User account "${userId}" deleted permanently from Realtime Database.`);
            }
          } catch (err) {
            console.error("[DB] Error deleting user from Firebase:", err);
          }
          deleteSessionCookie("minimikyu_logged_user");
          deleteSessionCookie("minimikyurealm_logged_user");
          localStorage.removeItem("minimikyu_logged_user");
          localStorage.removeItem("minimikyurealm_logged_user");
          localStorage.removeItem(`minimikyurealm_state_${userId}`);
          localStorage.clear();
          this.resetStateToDefault();
          this.notify();
          if (typeof window !== "undefined") {
            window.location.reload();
          }
          return true;
        }
        resetStateToDefault(userId) {
          const id = userId || "guest-1";
          this.state = this.getDefaultState(id);
          this.recalculateCP();
          this.notify();
        }
        manualSaveCharacterRecord() {
          this.flushSaveToFirebase();
          this.saveToLocalStorage();
          const saveBtn = document.getElementById("btn-manual-save-record");
          if (saveBtn) {
            saveBtn.className = "px-3 py-1 bg-emerald-500 text-slate-950 border border-emerald-300 font-black rounded-xl text-xs shadow-xl transition flex items-center gap-1 cursor-pointer scale-105 animate-pulse";
            setTimeout(() => {
              if (saveBtn) saveBtn.className = "px-3 py-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/80 font-black rounded-xl text-xs shadow-lg transition flex items-center gap-1 cursor-pointer";
            }, 1200);
          }
          const { UIService: UIService2 } = (init_UIService(), __toCommonJS(UIService_exports));
          UIService2.getInstance().showToast("\u{1F4BE} Character record successfully saved & synced with Firebase DB!", "success");
        }
        static getInstance() {
          if (!_GameStateService.instance) {
            _GameStateService.instance = new _GameStateService();
          }
          return _GameStateService.instance;
        }
        getUserId() {
          return this.state.userId;
        }
        setUserId(id) {
          this.state.userId = id || "";
        }
        updateCP() {
          this.recalculateCP();
        }
        logCombat(msg) {
        }
        autoAllocateStatPoints() {
          if (!this.state.isAutoAllocateStats || this.state.statPoints <= 0) return;
          const stats = ["str", "int", "agi", "vit"];
          let idx = 0;
          while (this.state.statPoints > 0) {
            const stat = stats[idx % stats.length];
            this.state.statPoints--;
            this.state[stat]++;
            if (stat === "vit") {
              this.state.maxHp += 10;
              this.state.hp = Math.min(this.state.maxHp, this.state.hp + 10);
            }
            idx++;
          }
          this.recalculateCP();
        }
        updateHeroSystemModal() {
          if (this.state.isAutoAllocateStats && this.state.statPoints > 0) {
            this.autoAllocateStatPoints();
          }
          this.updateHUDDOM();
        }
        normalizeArray(data) {
          if (!data) return [];
          if (Array.isArray(data)) return data.filter(Boolean);
          if (typeof data === "object") {
            return Object.values(data).filter(Boolean);
          }
          return [];
        }
        isWeaponAllowedForClass(jobClass, weapon) {
          if (!weapon || weapon.type !== "weapon") return true;
          const name = weapon.name.toLowerCase();
          if (jobClass === "WARRIOR") {
            if (name.includes("wand") || name.includes("staff") || name.includes("bow") || name.includes("recurve") || name.includes("katana") || name.includes("masamune") || name.includes("muramasa")) {
              return false;
            }
            return true;
          }
          if (jobClass === "SAMURAI") {
            if (name.includes("wand") || name.includes("staff") || name.includes("bow") || name.includes("recurve")) {
              return false;
            }
            if (!name.includes("katana") && !name.includes("masamune") && !name.includes("muramasa") && !name.includes("blade")) {
              return false;
            }
            return true;
          }
          if (jobClass === "MAGE") {
            if (name.includes("sword") || name.includes("blade") || name.includes("katana") || name.includes("bow") || name.includes("recurve") || name.includes("masamune") || name.includes("muramasa")) {
              return false;
            }
            if (!name.includes("wand") && !name.includes("staff") && !name.includes("orb") && !name.includes("tome") && !name.includes("rod") && !name.includes("grimoire")) {
              return false;
            }
            return true;
          }
          if (jobClass === "ARCHER") {
            if (name.includes("sword") || name.includes("blade") || name.includes("katana") || name.includes("wand") || name.includes("staff") || name.includes("masamune") || name.includes("muramasa")) {
              return false;
            }
            if (!name.includes("bow") && !name.includes("recurve") && !name.includes("arrow") && !name.includes("crossbow")) {
              return false;
            }
            return true;
          }
          return true;
        }
        getStarterWeaponForClass(jobClass) {
          if (jobClass === "MAGE") {
            return { id: "starter-wand-1", name: "Apprentice Wooden Wand", type: "weapon", rarity: "common", icon: "\u{1F52E}", cpBonus: 20, level: 1, count: 1, description: "Starter wand crafted for Mage heroes.", isLocked: false };
          }
          if (jobClass === "ARCHER") {
            return { id: "starter-bow-1", name: "Apprentice Wooden Bow", type: "weapon", rarity: "common", icon: "\u{1F3F9}", cpBonus: 20, level: 1, count: 1, description: "Starter bow crafted for Archer heroes.", isLocked: false };
          }
          if (jobClass === "SAMURAI") {
            return { id: "starter-katana-1", name: "Apprentice Practice Katana", type: "weapon", rarity: "common", icon: "\u2694\uFE0F", cpBonus: 20, level: 1, count: 1, description: "Starter practice katana for Samurai heroes.", isLocked: false };
          }
          return { id: "starter-sword-1", name: "Apprentice Steel Sword", type: "weapon", rarity: "common", icon: "\u{1F5E1}\uFE0F", cpBonus: 20, level: 1, count: 1, description: "Starter blade forged for Warrior heroes.", isLocked: false };
        }
        getDefaultState(userId = "guest-1") {
          const defaultJobClass = "WARRIOR";
          const starterWeapon = this.getStarterWeaponForClass(defaultJobClass);
          const starterArmor = { id: "starter-armor-1", name: "Jade Guardian Armor", type: "armor", rarity: "common", icon: "\u{1F94B}", cpBonus: 15, level: 1, count: 1, description: "Starter armor crafted for new heroes.", isLocked: false };
          return {
            userId,
            name: "KyuHero",
            gender: "MALE",
            jobClass: defaultJobClass,
            level: 1,
            exp: 0,
            maxExp: 100,
            gold: 500,
            gems: 20,
            redGems: 500,
            purpleGems: 50,
            skillTomes: 500,
            ancientBooks: 50,
            heroAuraMeter: 0,
            towerKeys: 3,
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
            isWeaponLocked: false,
            isArmorLocked: false,
            isRuneLocked: false,
            isSkillLocked: false,
            isPetLocked: false,
            isCutsceneLocked: false,
            isMountLocked: false,
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
        loadFromSavedCharacter(charData) {
          if (!charData) return;
          const targetUserId = charData.userId || this.state.userId;
          const defaultBase = this.getDefaultState(targetUserId);
          const normalizedEquippedPets = this.normalizeArray(charData.equippedPets);
          const normalizedInventory = this.normalizeArray(charData.inventory);
          this.state = {
            ...defaultBase,
            ...charData,
            userId: targetUserId,
            equippedPets: normalizedEquippedPets,
            inventory: normalizedInventory
          };
          if (this.state.redGems === void 0) this.state.redGems = 500;
          if (this.state.purpleGems === void 0) this.state.purpleGems = 50;
          if (this.state.inventory && Array.isArray(this.state.inventory)) {
            this.state.inventory = this.state.inventory.filter((item) => !item.id?.startsWith("starter-pet-"));
          }
          if (this.state.equippedPets && Array.isArray(this.state.equippedPets)) {
            this.state.equippedPets = this.state.equippedPets.filter((item) => !item.id?.startsWith("starter-pet-"));
          }
          this.state.equippedPets.forEach((eqPet) => {
            const invPet = this.state.inventory.find((i) => i.id === eqPet.id || i.name === eqPet.name);
            if (invPet) {
              eqPet.level = invPet.level || 1;
              eqPet.cpBonus = invPet.cpBonus || eqPet.cpBonus;
            }
          });
          this.cleanNonClassWeapons();
          this.recalculateCP();
          this.notify();
        }
        cleanNonClassWeapons() {
          if (!this.state.inventory || !Array.isArray(this.state.inventory)) return;
          const jobClass = this.state.jobClass || "WARRIOR";
          const weaponsToRemove = [];
          this.state.inventory = this.state.inventory.filter((item) => {
            if (item.type === "weapon") {
              if (!this.isWeaponAllowedForClass(jobClass, item)) {
                weaponsToRemove.push(item);
                return false;
              }
            }
            return true;
          });
          if (this.state.equippedWeapon && !this.isWeaponAllowedForClass(jobClass, this.state.equippedWeapon)) {
            weaponsToRemove.push(this.state.equippedWeapon);
            const starterWeapon = this.getStarterWeaponForClass(jobClass);
            this.state.equippedWeapon = starterWeapon;
            if (!this.state.inventory.some((i) => i.id === starterWeapon.id || i.name === starterWeapon.name)) {
              this.state.inventory.push(starterWeapon);
            }
          }
          if (weaponsToRemove.length > 0) {
            let goldEarned = 0;
            weaponsToRemove.forEach((w) => {
              goldEarned += this.getItemSellPrice(w.rarity, w.level || 1) * (w.count || 1);
            });
            this.state.gold += goldEarned;
          }
        }
        listenToFirebase(callback) {
          if (window.FirebaseApp && this.state.userId) {
            try {
              const { db, ref, onValue } = window.FirebaseApp;
              const userRef = ref(db, `users/${this.state.userId}/character`);
              onValue(userRef, (snapshot) => {
                const val = snapshot.val();
                if (val) {
                  this.loadFromSavedCharacter(val);
                  if (callback) callback(val);
                }
              });
            } catch (err) {
              console.error("[DB] Firebase listen error:", err);
            }
          }
        }
        subscribe(listener) {
          this.listeners.push(listener);
        }
        notify() {
          this.recalculateCP();
          this.listeners.forEach((fn) => fn());
          this.updateHUDDOM();
        }
        // PASSIVE IDLE VAULT REWARD ACCUMULATION
        startIdleVaultTimer() {
          setInterval(() => {
            if (!this.state.idleVault) {
              this.state.idleVault = {
                accumulatedExp: 0,
                accumulatedGold: 0,
                startTime: Date.now(),
                lastClaimTime: Date.now() - 6e3
              };
            }
            this.state.idleVault.accumulatedExp += 10;
            this.state.idleVault.accumulatedGold += 20;
            const idleView = document.getElementById("view-idle");
            if (idleView && !idleView.classList.contains("hidden")) {
              const expEl = document.getElementById("idle-stored-exp");
              const goldEl = document.getElementById("idle-stored-gold");
              const timeEl = document.getElementById("idle-vault-time-text");
              if (expEl) expEl.innerText = `+${this.state.idleVault.accumulatedExp.toLocaleString()} EXP`;
              if (goldEl) goldEl.innerText = `+${this.state.idleVault.accumulatedGold.toLocaleString()} \u{1FA99}`;
              if (timeEl) timeEl.innerText = `\u23F1\uFE0F Accumulated: ${this.getIdleVaultDurationText()}`;
            }
          }, 2e3);
        }
        getIdleVaultDurationText() {
          const lastClaim = this.state.idleVault?.lastClaimTime || Date.now() - 6e3;
          const elapsedMs = Math.max(0, Date.now() - lastClaim);
          const totalSeconds = Math.floor(elapsedMs / 1e3);
          const hours = Math.floor(totalSeconds / 3600);
          const mins = Math.floor(totalSeconds % 3600 / 60);
          const secs = totalSeconds % 60;
          if (hours > 0) {
            return `${hours}h ${mins}m worth of rewards`;
          }
          if (mins > 0) {
            return `${mins}m ${secs}s worth of rewards`;
          }
          return `${secs}s worth of rewards`;
        }
        claimIdleVaultStorage() {
          if (!this.state.idleVault) {
            this.state.idleVault = {
              accumulatedExp: 0,
              accumulatedGold: 0,
              startTime: Date.now(),
              lastClaimTime: Date.now() - 6e3
            };
          }
          const now = Date.now();
          const lastClaim = this.state.idleVault.lastClaimTime || 0;
          const cooldownRemaining = 5e3 - (now - lastClaim);
          if (cooldownRemaining > 0) {
            const secondsLeft = Math.ceil(cooldownRemaining / 1e3);
            return {
              success: false,
              expGained: 0,
              goldGained: 0,
              message: `\u23F3 Claim cooldown active! Please wait ${secondsLeft}s.`
            };
          }
          const expGained = this.state.idleVault.accumulatedExp || 0;
          const goldGained = this.state.idleVault.accumulatedGold || 0;
          this.state.exp += expGained;
          this.state.gold += goldGained;
          this.state.idleVault.accumulatedExp = 0;
          this.state.idleVault.accumulatedGold = 0;
          this.state.idleVault.lastClaimTime = now;
          while (this.state.exp >= this.state.maxExp) {
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
            message: `\u{1F381} Successfully claimed +${expGained.toLocaleString()} EXP and +${goldGained.toLocaleString()} \u{1FA99} from Storage Vault!`
          };
        }
        saveToFirebase() {
          this.saveToLocalStorage();
          if (this.saveDebounceTimer) return;
          this.saveDebounceTimer = setTimeout(() => {
            this.saveDebounceTimer = null;
            this.flushSaveToFirebase();
          }, 5e3);
        }
        flushSaveToFirebase() {
          this.recalculateCP();
          this.saveToLocalStorage();
          if (window.FirebaseApp && this.state.userId && this.state.userId !== "guest-1") {
            try {
              const { db, ref, update } = window.FirebaseApp;
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
              const characterRef = ref(db, `users/${this.state.userId}/character`);
              update(characterRef, payload);
              const userRootRef = ref(db, `users/${this.state.userId}`);
              update(userRootRef, {
                userId: this.state.userId,
                cp: this.state.cp,
                level: this.state.level,
                exp: this.state.exp,
                maxExp: this.state.maxExp,
                classTitle,
                rankTitle,
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
              setSessionCookie("minimikyu_logged_user", this.state.userId, 7);
              setSessionCookie("minimikyurealm_logged_user", this.state.userId, 7);
              if (window.dungeonScreenInstance && typeof window.dungeonScreenInstance.showAutosaveBadgeOverhead === "function") {
                window.dungeonScreenInstance.showAutosaveBadgeOverhead();
              }
              console.log(`[FIREBASE] \u{1F4BE} Realtime DB updated for User "${this.state.userId}": CP=${this.state.cp}, Level=${this.state.level}, ClassTitle="${classTitle}"!`);
            } catch (err) {
              console.error("[DB] Firebase Save Error:", err);
            }
          }
        }
        setCharacterDetails(name, gender, jobClass) {
          this.state.name = name;
          this.state.gender = gender;
          this.state.jobClass = jobClass;
          if (jobClass === "WARRIOR") {
            this.state.str = 12;
            this.state.int = 4;
            this.state.agi = 6;
            this.state.vit = 8;
            this.state.equippedWeapon = { id: "w1", name: "Apprentice Steel Sword", type: "weapon", rarity: "common", icon: "\u{1F5E1}\uFE0F", cpBonus: 25, level: 1, count: 1, isLocked: false };
            this.state.equippedArmor = { id: "a1", name: "Jade Guardian Armor", type: "armor", rarity: "common", icon: "\u{1F94B}", cpBonus: 20, level: 1, count: 1, isLocked: false };
          } else if (jobClass === "SAMURAI") {
            this.state.str = 11;
            this.state.int = 4;
            this.state.agi = 14;
            this.state.vit = 7;
            this.state.equippedWeapon = { id: "w4", name: "Master Muramasa Katana", type: "weapon", rarity: "rare", icon: "\u{1F5E1}\uFE0F", cpBonus: 45, level: 1, count: 1, isLocked: false };
            this.state.equippedArmor = { id: "a4", name: "Lacquered Samurai Kabuto Armor", type: "armor", rarity: "rare", icon: "\u{1F94B}", cpBonus: 35, level: 1, count: 1, isLocked: false };
          } else if (jobClass === "MAGE") {
            this.state.str = 4;
            this.state.int = 14;
            this.state.agi = 5;
            this.state.vit = 5;
            this.state.equippedWeapon = { id: "w2", name: "Crystal Magic Wand", type: "weapon", rarity: "common", icon: "\u{1F52E}", cpBonus: 28, level: 1, count: 1, isLocked: false };
            this.state.equippedArmor = { id: "a2", name: "Arcane Silk Robe", type: "armor", rarity: "common", icon: "\u{1F97C}", cpBonus: 18, level: 1, count: 1, isLocked: false };
          } else {
            this.state.str = 6;
            this.state.int = 5;
            this.state.agi = 13;
            this.state.vit = 6;
            this.state.equippedWeapon = { id: "w3", name: "Elven Longbow", type: "weapon", rarity: "common", icon: "\u{1F3F9}", cpBonus: 26, level: 1, count: 1, isLocked: false };
            this.state.equippedArmor = { id: "a3", name: "Windrunner Leather", type: "armor", rarity: "common", icon: "\u{1F9E5}", cpBonus: 19, level: 1, count: 1, isLocked: false };
          }
          this.cleanNonClassWeapons();
          this.recalculateCP();
          this.notify();
          this.flushSaveToFirebase();
        }
        recalculateCP() {
          let cp = this.state.str * 3 + this.state.int * 3 + this.state.agi * 3 + this.state.vit * 2;
          if (this.state.equippedWeapon) cp += (this.state.equippedWeapon.cpBonus || 20) * (this.state.equippedWeapon.level || 1);
          if (this.state.equippedArmor) cp += (this.state.equippedArmor.cpBonus || 15) * (this.state.equippedArmor.level || 1);
          if (this.state.equippedRune) cp += (this.state.equippedRune.cpBonus || 30) * (this.state.equippedRune.level || 1);
          if (this.state.equippedSkill) cp += (this.state.equippedSkill.cpBonus || 40) * (this.state.equippedSkill.level || 1);
          if (this.state.equippedUniquePower) cp += (this.state.equippedUniquePower.cpBonus || 1e3) * (this.state.equippedUniquePower.level || 1);
          if (this.state.equippedCutscene) cp += (this.state.equippedCutscene.cpBonus || 100) * (this.state.equippedCutscene.level || 1);
          if (this.state.equippedMount) cp += (this.state.equippedMount.cpBonus || 2500) * (this.state.equippedMount.level || 1);
          if (this.state.equippedPorter) cp += (this.state.equippedPorter.cpBonus || 30) * (this.state.equippedPorter.level || 1);
          if (this.state.equippedPets && Array.isArray(this.state.equippedPets) && this.state.equippedPets.length > 0) {
            this.state.equippedPets.forEach((pet) => {
              if (pet) cp += (pet.cpBonus || 45) * (pet.level || 1);
            });
          } else if (this.state.equippedPet) {
            cp += (this.state.equippedPet.cpBonus || 45) * (this.state.equippedPet.level || 1);
          }
          const ascBonus = (this.state.ascensionLevel || 0) * 500;
          this.state.cp = cp + ascBonus;
        }
        getRankTitle() {
          const cp = this.state.cp;
          if (cp >= 1500) return "RANK SSS";
          if (cp >= 1e3) return "RANK SS";
          if (cp >= 700) return "RANK S";
          if (cp >= 450) return "RANK A";
          if (cp >= 250) return "RANK B";
          if (cp >= 120) return "RANK C";
          if (cp >= 55) return "RANK D";
          if (cp >= 35) return "RANK E";
          return "RANK F";
        }
        getWorldTier() {
          return Math.max(1, this.state.worldTier || 1);
        }
        getWorldTierName() {
          const tier = this.getWorldTier();
          const names = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
          return `Tier ${names[tier - 1] || tier}`;
        }
        getScaledMonsterHp(baseHp) {
          const tier = this.getWorldTier();
          return Math.floor(baseHp * (1 + (tier - 1) * 0.45));
        }
        getScaledMonsterLvl(baseLvl) {
          const tier = this.getWorldTier();
          return baseLvl + (tier - 1) * 5;
        }
        getItemSellPrice(rarity, level = 1) {
          let base = 50;
          if (rarity === "rare") base = 150;
          if (rarity === "legendary") base = 400;
          if (rarity === "mythic") base = 1e3;
          return base * level;
        }
        getClassTitle() {
          const cls = this.state.jobClass || "WARRIOR";
          const lvl = this.state.level;
          if (cls === "WARRIOR") {
            if (lvl >= 30) return "Grand Swordmaster";
            if (lvl >= 15) return "Knight Templar";
            return "Apprentice Swordsman";
          }
          if (cls === "MAGE") {
            if (lvl >= 30) return "Archmage Supreme";
            if (lvl >= 15) return "Elemental Sorcerer";
            return "Novice Wizard";
          }
          if (lvl >= 30) return "Phantom Ranger";
          if (lvl >= 15) return "Deadeye Marksman";
          return "Apprentice Scout";
        }
        getChibiHeroHTML(scaleClass = "scale-125") {
          const isFemale = this.state.gender === "FEMALE";
          const cls = this.state.jobClass || "WARRIOR";
          let head = "\u{1F9D4}\u{1F3FB}\u200D\u2642\uFE0F";
          let hat = "\u{1FA96}";
          let weapon = "\u{1F5E1}\uFE0F";
          if (cls === "WARRIOR") {
            head = isFemale ? "\u{1F467}" : "\u{1F9D4}\u{1F3FB}\u200D\u2642\uFE0F";
            hat = isFemale ? "\u{1F451}" : "\u{1F6E1}\uFE0F";
            weapon = this.state.equippedWeapon?.icon || "\u{1F5E1}\uFE0F";
          } else if (cls === "MAGE") {
            head = isFemale ? "\u{1F467}" : "\u{1F9D9}\u200D\u2642\uFE0F";
            hat = "\u{1F52E}";
            weapon = this.state.equippedWeapon?.icon || "\u{1F52E}";
          } else {
            head = isFemale ? "\u{1F467}" : "\u{1F468}\u{1F3FB}\u200D\u{1F9B0}";
            hat = "\u{1F3F9}";
            weapon = this.state.equippedWeapon?.icon || "\u{1F3F9}";
          }
          const runeElem = this.state.equippedRune?.element;
          let auraGlow = "";
          let auraHTML = "";
          if (runeElem === "fire") {
            auraGlow = "drop-shadow-[0_0_35px_rgba(239,68,68,1)]";
            auraHTML = `
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-t from-red-600/40 via-amber-500/30 to-transparent animate-pulse border-2 border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,1)]"></div>
          <div class="absolute -top-4 text-red-500 text-xs font-bold animate-bounce">\u{1F525} Fire Aura</div>
        </div>
      `;
          } else if (runeElem === "lightning") {
            auraGlow = "drop-shadow-[0_0_35px_rgba(56,189,248,1)]";
            auraHTML = `
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-t from-cyan-600/40 via-blue-500/30 to-transparent animate-pulse border-2 border-cyan-400/80 shadow-[0_0_40px_rgba(56,189,248,1)]"></div>
          <div class="absolute -top-4 text-cyan-300 text-xs font-bold animate-bounce">\u26A1 Lightning Aura</div>
        </div>
      `;
          } else if (runeElem === "nature") {
            auraGlow = "drop-shadow-[0_0_35px_rgba(52,211,153,1)]";
            auraHTML = `
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-t from-emerald-600/40 via-teal-500/30 to-transparent animate-pulse border-2 border-emerald-400/80 shadow-[0_0_40px_rgba(52,211,153,1)]"></div>
          <div class="absolute -top-4 text-emerald-300 text-xs font-bold animate-bounce">\u{1F33F} Nature Aura</div>
        </div>
      `;
          }
          return `
      <div id="chibi-hero-card" class="relative flex flex-col items-center justify-center p-2 transition transform ${scaleClass}">
        ${auraHTML}
        <div class="text-[10px] text-amber-300 font-extrabold uppercase mb-1 flex items-center gap-1 z-10">${hat} ${cls}</div>
        <div class="text-7xl ${auraGlow} animate-pulse my-1 z-10">${head}</div>
        <div class="text-4xl -mt-4 drop-shadow-lg z-10">${weapon}</div>
      </div>
    `;
        }
        getChibiHeroCardHTML(scaleClass = "scale-100") {
          return this.getChibiHeroHTML(scaleClass);
        }
        triggerStatGlowEffect() {
          const card = document.getElementById("chibi-hero-card");
          if (card) {
            card.classList.add("ring-8", "ring-amber-400", "shadow-[0_0_50px_rgba(251,191,36,1)]", "scale-110");
            setTimeout(() => {
              card.classList.remove("ring-8", "ring-amber-400", "shadow-[0_0_50px_rgba(251,191,36,1)]", "scale-110");
            }, 500);
          }
        }
        updateHUDDOM() {
          const title = this.getClassTitle();
          ["char-title", "hud-title", "sys-char-title"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = title;
          });
          ["char-name", "sys-char-name"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = this.state.name;
          });
          ["char-class", "hud-class", "sys-char-class"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = `${this.state.gender || "MALE"} ${this.state.jobClass}`;
          });
          ["char-lvl", "hud-level", "sys-char-lvl"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = this.state.level.toString();
          });
          ["char-cp", "sys-char-cp", "top-cp-banner"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = `${this.state.cp} CP`;
          });
          const rankEl = document.querySelector(".rank-badge");
          if (rankEl) rankEl.textContent = this.getRankTitle();
          const ptsEl = document.getElementById("stat-points");
          if (ptsEl) ptsEl.innerText = `${this.state.statPoints} PTS`;
          const autoStatBtn = document.getElementById("btn-toggle-autostat");
          const autoStatBadge = document.getElementById("autostat-status-badge");
          if (autoStatBadge) {
            if (this.state.isAutoAllocateStats) {
              autoStatBadge.innerText = "ON \u26A1";
              autoStatBadge.className = "text-amber-300 font-black animate-pulse";
              if (autoStatBtn) autoStatBtn.className = "px-3 py-1 bg-amber-600 text-slate-950 font-black text-[10px] rounded-xl border border-amber-300 shadow-lg cursor-pointer transition flex items-center gap-1 scale-105";
            } else {
              autoStatBadge.innerText = "OFF";
              autoStatBadge.className = "text-gray-400 font-extrabold";
              if (autoStatBtn) autoStatBtn.className = "px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] rounded-xl border border-amber-500/60 shadow cursor-pointer transition flex items-center gap-1";
            }
          }
          ["str", "int", "agi", "vit"].forEach((s) => {
            const el = document.getElementById(`val-${s}`);
            if (el) el.innerText = this.state[s].toString();
          });
          const hpText = document.getElementById("hud-hp-text");
          const hpBar = document.getElementById("hud-hp-bar");
          if (hpText && hpBar) {
            hpText.innerText = `${this.state.hp} / ${this.state.maxHp}`;
            const hpPct = Math.max(0, Math.min(100, this.state.hp / this.state.maxHp * 100));
            hpBar.style.width = `${hpPct}%`;
          }
          const expText = document.getElementById("hud-exp-text");
          const expBar = document.getElementById("hud-exp-bar");
          if (expText && expBar) {
            expText.innerText = `${this.state.exp} / ${this.state.maxExp}`;
            const expPct = Math.max(0, Math.min(100, this.state.exp / this.state.maxExp * 100));
            expBar.style.width = `${expPct}%`;
          }
          ["hud-gold", "res-gold", "gacha-hud-gold"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = this.state.gold.toLocaleString();
          });
          ["hud-gems", "res-gems", "gacha-hud-gems"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = this.state.gems.toLocaleString();
          });
          ["res-red-gems", "gacha-hud-redgems"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = (this.state.redGems || 0).toLocaleString();
          });
          ["res-purple-gems", "gacha-hud-purplegems"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = (this.state.purpleGems || 0).toLocaleString();
          });
          ["res-skill-tomes", "gacha-hud-skilltomes"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = (this.state.skillTomes || 0).toLocaleString();
          });
          ["res-ancient-books", "gacha-hud-ancientbooks"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = (this.state.ancientBooks || 0).toLocaleString();
          });
          ["hud-keys", "res-keys"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = `${Math.min(20, this.state.towerKeys || 0)}/20`;
          });
          const worldBanner = document.getElementById("dungeon-world-banner");
          if (worldBanner) {
            const wave = Math.max(1, Math.min(10, this.state.wave || 1));
            worldBanner.innerText = `TIER ${this.getWorldTier()} (WAVE ${wave}/10)`;
          }
          const cls = this.state.jobClass || "WARRIOR";
          let sideIcon = "\u{1F5E1}\uFE0F";
          let sideBarGradient = "from-emerald-400 to-amber-300";
          let borderColor = "border-emerald-400/60";
          if (cls === "MAGE") {
            sideIcon = "\u{1F52E}";
            sideBarGradient = "from-cyan-400 to-purple-400";
            borderColor = "border-cyan-400/60";
          } else if (cls === "ARCHER") {
            sideIcon = "\u{1F3F9}";
            sideBarGradient = "from-emerald-400 to-teal-300";
            borderColor = "border-teal-400/60";
          }
          ["side-left-icon", "side-right-icon"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.innerText = sideIcon;
          });
          ["side-weapon-left", "side-weapon-right"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.className = `w-14 h-44 glass-panel ${borderColor} rounded-full flex flex-col items-center justify-around py-4 text-3xl shadow-2xl animate-float`;
          });
          ["side-left-bar", "side-right-bar"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.className = `w-2 h-20 bg-gradient-to-b ${sideBarGradient} rounded-full`;
          });
          this.updateCharacterPreviewDOM();
        }
        getNextLevelMaxExp(level) {
          return Math.floor(100 * Math.pow(1.25, Math.max(1, level) - 1));
        }
        updateCharacterPreviewDOM() {
          const avatarContainer = document.getElementById("preview-chibi-avatar");
          if (avatarContainer) {
            avatarContainer.innerHTML = this.getChibiHeroCardHTML("scale-100");
          }
          const rankInfo = this.getHeroRank(this.state.level);
          const rankEl = document.getElementById("char-rank-badge");
          if (rankEl) {
            rankEl.innerText = `RANK ${rankInfo.rank}`;
            rankEl.style.color = rankInfo.color;
            rankEl.style.borderColor = rankInfo.color;
          }
          const ascReqEl = document.getElementById("ascension-req-text");
          if (ascReqEl) {
            ascReqEl.innerText = `${this.getAscensionReqLevel()}`;
          }
          const ascLvlEl = document.getElementById("ascension-lvl-text");
          if (ascLvlEl) {
            ascLvlEl.innerText = `REIN ${this.state.ascensionLevel || 0}`;
          }
          this.updateSlotPreview("slot-preview-weapon", this.state.equippedWeapon, "WEAPON", "\u{1F5E1}\uFE0F", this.state.isWeaponLocked);
          this.updateSlotPreview("slot-preview-armor", this.state.equippedArmor, "ARMOR", "\u{1F94B}", this.state.isArmorLocked);
          this.updateSlotPreview("slot-preview-rune", this.state.equippedRune, "RUNE", "\u{1F525}", this.state.isRuneLocked);
          this.updateSlotPreview("slot-preview-skill", this.state.equippedSkill, "SKILL", "\u26A1", this.state.isSkillLocked);
          this.updateSlotPreview("slot-preview-uniquepower", this.state.equippedUniquePower, "UNIQUE POWER", "\u{1F451}", this.state.isUniquePowerLocked);
          this.updateSlotPreview("slot-preview-cutscene", this.state.equippedCutscene, "CUTSCENE", "\u{1F3AC}", this.state.isCutsceneLocked);
          this.updateSlotPreview("slot-preview-mount", this.state.equippedMount, "MOUNT", "\u{1F409}", this.state.isMountLocked);
          const equippedPets = this.state.equippedPets || [];
          const petSlotIds = ["slot-preview-pet", "slot-preview-pet2", "slot-preview-pet3", "slot-preview-pet4", "slot-preview-pet5"];
          petSlotIds.forEach((slotId, idx) => {
            const petItem = equippedPets[idx] || null;
            this.updateSlotPreview(slotId, petItem, `PET ${idx + 1}`, "\u{1F43E}", this.state.isPetLocked);
          });
        }
        getHeroRank(level = this.state.level) {
          if (level >= 150) return { rank: "ULR", color: "#f43f5e", stroke: "#fbbf24" };
          if (level >= 125) return { rank: "SSSR", color: "#c084fc", stroke: "#38bdf8" };
          if (level >= 100) return { rank: "SSR", color: "#ef4444", stroke: "#f59e0b" };
          if (level >= 90) return { rank: "SSS", color: "#dc2626", stroke: "#000000" };
          if (level >= 75) return { rank: "SS", color: "#f97316", stroke: "#000000" };
          if (level >= 60) return { rank: "S", color: "#fbbf24", stroke: "#000000" };
          if (level >= 45) return { rank: "A", color: "#a855f7", stroke: "#000000" };
          if (level >= 30) return { rank: "B", color: "#3b82f6", stroke: "#000000" };
          if (level >= 20) return { rank: "C", color: "#06b6d4", stroke: "#000000" };
          if (level >= 10) return { rank: "D", color: "#22c55e", stroke: "#000000" };
          if (level >= 5) return { rank: "E", color: "#f3f4f6", stroke: "#000000" };
          return { rank: "F", color: "#9ca3af", stroke: "#000000" };
        }
        getAscensionReqLevel() {
          const currentAsc = this.state.ascensionLevel || 0;
          return 25 + currentAsc * 25;
        }
        getReincarnationExpMultiplier() {
          const reinLevel = this.state.ascensionLevel || 0;
          return 1 + reinLevel * 0.5;
        }
        getReincarnationMultiplier() {
          const reinLevel = this.state.ascensionLevel || 0;
          return 1 + reinLevel * 0.05;
        }
        ascendMountainPeak() {
          return this.performAscension();
        }
        performAscension() {
          const currentAsc = this.state.ascensionLevel || 0;
          const reqLevel = 25 + currentAsc * 25;
          if (this.state.level < reqLevel) {
            return {
              success: false,
              message: `\u26A0\uFE0F Level ${reqLevel} required for Reincarnation REIN ${currentAsc + 1}! (Current Level: ${this.state.level})`
            };
          }
          this.state.level = 1;
          this.state.exp = 0;
          this.state.maxExp = 100;
          this.state.worldTier = 1;
          this.state.wave = 1;
          this.state.waveKills = 0;
          this.state.gold = 0;
          this.state.gems = 0;
          this.state.redGems = 0;
          this.state.purpleGems = 0;
          this.state.towerKeys = 20;
          this.state.skillTomes = 0;
          this.state.ancientBooks = 0;
          this.state.ascensionLevel = (this.state.ascensionLevel || 0) + 1;
          this.recalculateCP();
          const cutsceneOptions = [
            {
              id: "cutscene-shadow-arise",
              cutsceneId: "shadow_arise",
              name: "SHADOW ARISE",
              icon: "\u{1F311}",
              cpBonus: 100,
              description: "Summons dark shadow monarchs to annihilate all enemies in a 5s cinematic burst!"
            },
            {
              id: "cutscene-getsuga-tensho",
              cutsceneId: "getsuga_tensho",
              name: "GETSUGA TENSHO",
              icon: "\u2694\uFE0F",
              cpBonus: 150,
              description: "Slices a massive glowing crescent moon spiritual blade across the screen!"
            },
            {
              id: "cutscene-i-am-atomic",
              cutsceneId: "i_am_atomic",
              name: "I AM ATOMIC",
              icon: "\u{1F4A5}",
              cpBonus: 220,
              description: "Concentrates atomic aura into a screen-shattering nuclear explosion!"
            }
          ];
          const chosen = cutsceneOptions[Math.floor(Math.random() * cutsceneOptions.length)];
          const existing = this.state.inventory.find((i) => i.cutsceneId === chosen.cutsceneId);
          if (existing) {
            existing.count++;
            existing.level = (existing.level || 1) + 1;
            existing.cpBonus = chosen.cpBonus * existing.level;
            this.notify();
            this.saveToFirebase();
            return {
              success: true,
              message: `\u2728 GOLD REINCARNATION COMPLETE (REIN ${this.state.ascensionLevel})! Upgraded ${chosen.name} to Level ${existing.level} (+${existing.cpBonus} CP)!`,
              cutsceneObtained: chosen.name
            };
          } else {
            const newItem = {
              id: `cutscene-${Date.now()}`,
              name: chosen.name,
              type: "cutscene",
              rarity: "mythic",
              icon: chosen.icon,
              cutsceneId: chosen.cutsceneId,
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
              message: `\u2728 GOLD REINCARNATION COMPLETE (REIN ${this.state.ascensionLevel})! Unlocked NEW CUTSCENE: ${chosen.name}!`,
              cutsceneObtained: chosen.name
            };
          }
        }
        autoEquipBestPet() {
          if (this.state.isPetLocked) return;
          const pets = this.state.inventory.filter((i) => i.type === "companion");
          if (pets.length === 0) return;
          pets.sort((a, b) => {
            const cpA = (a.cpBonus || 0) * (a.level || 1);
            const cpB = (b.cpBonus || 0) * (b.level || 1);
            return cpB - cpA;
          });
          this.state.equippedPets = pets.slice(0, 5);
          this.state.equippedPet = this.state.equippedPets[0] || null;
          this.recalculateCP();
          this.notify();
          this.saveToFirebase();
        }
        equipPet(pet) {
          if (!this.state.equippedPets) this.state.equippedPets = [];
          const existingIndex = this.state.equippedPets.findIndex((p) => p.id === pet.id);
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
        autoEquipBestCutscene() {
          if (this.state.isCutsceneLocked) return;
          const cutscenes = this.state.inventory.filter((i) => i.type === "cutscene");
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
        autoEquipBestMount() {
          if (this.state.isMountLocked) return;
          const mounts = this.state.inventory.filter((i) => i.type === "mount");
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
        dropRandomMythicMount() {
          const mountVariants = [
            { name: "Thunder Stallion", icon: "\u26A1", cpBonus: 2500, desc: "Celestial electric blue stallion mount! Grants +40% Move Speed and 2.5k CP." },
            { name: "Sunfire Flame Dragon", icon: "\u{1F409}", cpBonus: 3800, desc: "Imperial golden flame dragon beast! Grants +50% Move Speed and 3.8k CP." },
            { name: "Celestial Ice Fenrir", icon: "\u{1F43A}", cpBonus: 3200, desc: "Frost wolf god mount of the North! Grants +45% Move Speed and 3.2k CP." },
            { name: "Golden Sovereign Lion", icon: "\u{1F981}", cpBonus: 3e3, desc: "Imperial war lion with golden mane! Grants +42% Move Speed and 3.0k CP." },
            { name: "Storm Pegasus", icon: "\u{1F985}", cpBonus: 2800, desc: "Winged sky stallion of the storm peaks! Grants +40% Move Speed and 2.8k CP." },
            { name: "Obsidian Shadow Tiger", icon: "\u{1F405}", cpBonus: 3500, desc: "Shadow monarch tiger mount! Grants +48% Move Speed and 3.5k CP." },
            { name: "Abyss Iron Turtle", icon: "\u{1F422}", cpBonus: 4e3, desc: "Indestructible armored fortress turtle! Grants +30% Move Speed and 4.0k CP." },
            { name: "Starfall Unicorn", icon: "\u{1F984}", cpBonus: 2900, desc: "Starlight horned celestial mount! Grants +42% Move Speed and 2.9k CP." },
            { name: "Mecha Cyber Behemoth", icon: "\u{1F916}", cpBonus: 4500, desc: "Futuristic cybernetic war behemoth! Grants +55% Move Speed and 4.5k CP." },
            { name: "Nether Hydra Leviathan", icon: "\u{1F40D}", cpBonus: 5e3, desc: "Mythic multi-headed abyssal serpent mount! Grants +60% Move Speed and 5.0k CP." }
          ];
          const chosen = mountVariants[Math.floor(Math.random() * mountVariants.length)];
          const existing = this.state.inventory.find((i) => i.type === "mount" && i.name === chosen.name);
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
              message: `\u{1F409} DUPLICATE MOUNT! Upgraded ${existing.name} to Level ${existing.level} (+${existing.cpBonus} CP)!`
            };
          } else {
            const newMount = {
              id: `mount-${Date.now()}`,
              name: chosen.name,
              type: "mount",
              rarity: "mythic",
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
              message: `\u{1F451} WORLD SOVEREIGN DEFEATED! Unlocked NEW MYTHIC MOUNT: ${newMount.name} (+${newMount.cpBonus} CP)!`
            };
          }
        }
        autoEquipBestPorter() {
          if (this.state.isPorterLocked) return;
          const porters = this.state.inventory.filter((i) => i.type === "porter");
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
        grantOrUpgradePorter(variantId) {
          let variant;
          if (variantId) {
            variant = PORTER_VARIANTS.find((v) => v.id === variantId) || PORTER_VARIANTS[0];
          } else {
            const rand = Math.random();
            if (rand < 0.1) variant = PORTER_VARIANTS[3];
            else if (rand < 0.3) variant = PORTER_VARIANTS[2];
            else if (rand < 0.6) variant = PORTER_VARIANTS[1];
            else variant = PORTER_VARIANTS[0];
          }
          const existing = this.state.inventory.find((i) => i.type === "porter" && i.name === variant.name);
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
              message: `\u2692\uFE0F PORTER DUPLICATE OBTAINED! Upgraded ${existing.name} to Level ${existing.level} (+${existing.cpBonus} CP, Speed: ${(existing.porterSpeedMs / 1e3).toFixed(1)}s)!`
            };
          } else {
            const newPorter = {
              id: `porter-${Date.now()}`,
              name: variant.name,
              type: "porter",
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
              message: `\u{1F392} NEW PORTER UNLOCKED: ${newPorter.name} (${newPorter.rarity.toUpperCase()}) (+${newPorter.cpBonus} CP, Speed: ${(newPorter.porterSpeedMs / 1e3).toFixed(1)}s)!`
            };
          }
        }
        updateSlotPreview(containerId, item, typeLabel, defaultIcon, isLocked) {
          const el = document.getElementById(containerId);
          if (!el) return;
          if (item) {
            el.innerHTML = `
        <div class="relative w-full flex flex-col items-center">
          <span class="absolute -top-1 -right-1 text-xs cursor-pointer" onclick="window.toggleEquippedSlotLock('${typeLabel.toLowerCase()}')">${isLocked ? "\u{1F512}" : "\u{1F513}"}</span>
          <span class="text-2xl mb-1">${item.icon}</span>
          <span class="text-[9px] font-black text-white truncate w-full">${item.name}</span>
          <span class="text-[8px] text-amber-300 font-mono">Lvl ${item.level || 1} (+${(item.cpBonus || 15) * (item.level || 1)} CP)</span>
        </div>
      `;
          } else {
            el.innerHTML = `
        <div class="relative w-full flex flex-col items-center opacity-50">
          <span class="absolute -top-1 -right-1 text-xs cursor-pointer" onclick="window.toggleEquippedSlotLock('${typeLabel.toLowerCase()}')">${isLocked ? "\u{1F512}" : "\u{1F513}"}</span>
          <span class="text-2xl mb-1">${defaultIcon}</span>
          <span class="text-[9px] font-bold text-emerald-400">NO ${typeLabel}</span>
        </div>
      `;
          }
        }
      };
      __publicField(_GameStateService, "instance");
      GameStateService = _GameStateService;
    }
  });

  // src/client/game_plugins/inputLock.ts
  function initializeInputLock() {
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")) {
        e.preventDefault();
      }
    });
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // src/client/event_control/maintenance.ts
  function handleServerEvents(state) {
    const modal = document.getElementById("maintenance-overlay");
    const annText = document.getElementById("announcement-banner");
    if (annText && state.announcement) {
      annText.innerText = state.announcement;
    }
    if (modal) {
      if (state.isMaintenance) {
        modal.classList.remove("hidden");
      } else {
        modal.classList.add("hidden");
      }
    }
  }

  // src/client/main.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();

  // src/client/screens/ScreenManager.ts
  var _ScreenManager = class _ScreenManager {
    constructor() {
      __publicField(this, "currentScreen", "auth");
      __publicField(this, "registeredScreens", /* @__PURE__ */ new Map());
      __publicField(this, "dungeonAfkTimer", null);
    }
    static getInstance() {
      if (!_ScreenManager.instance) {
        _ScreenManager.instance = new _ScreenManager();
      }
      return _ScreenManager.instance;
    }
    registerScreen(id, screen) {
      this.registeredScreens.set(id, screen);
    }
    resetDungeonAfkTimer() {
      if (this.dungeonAfkTimer) {
        clearTimeout(this.dungeonAfkTimer);
        this.dungeonAfkTimer = null;
      }
      const dungeonScreen = this.registeredScreens.get("dungeon");
      if (dungeonScreen && (dungeonScreen.isAutoBattle || dungeonScreen.isCutsceneActive)) {
        return;
      }
      if (this.currentScreen === "dungeon") {
        this.dungeonAfkTimer = setTimeout(() => {
          if (this.currentScreen === "dungeon") {
            console.log("[AFK] 5 seconds of inactivity in Dungeon. Auto-transferring to Sanctuary Grove (IDLE)...");
            this.showScreen("idle");
          }
        }, 5e3);
      }
    }
    showScreen(screenId) {
      const prevScreen = this.currentScreen;
      if (this.dungeonAfkTimer) {
        clearTimeout(this.dungeonAfkTimer);
        this.dungeonAfkTimer = null;
      }
      if (this.registeredScreens.has(prevScreen)) {
        this.registeredScreens.get(prevScreen)?.onLeave?.();
      }
      this.currentScreen = screenId;
      const topScreens = ["screen-auth", "screen-char-create", "screen-game-world"];
      topScreens.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
      if (screenId === "auth") {
        const el = document.getElementById("screen-auth");
        if (el) el.classList.remove("hidden");
      } else if (screenId === "char-create") {
        const el = document.getElementById("screen-char-create");
        if (el) el.classList.remove("hidden");
      } else {
        const el = document.getElementById("screen-game-world");
        if (el) el.classList.remove("hidden");
        const views = ["dungeon", "idle", "tower", "character", "companion", "inventory", "gacha"];
        views.forEach((v) => {
          const viewEl = document.getElementById(`view-${v}`);
          const tabEl = document.getElementById(`view-tab-${v}`);
          if (viewEl) {
            if (v === screenId) viewEl.classList.remove("hidden");
            else viewEl.classList.add("hidden");
          }
          if (tabEl) {
            if (v === screenId) {
              tabEl.classList.add("active");
              tabEl.classList.remove("text-emerald-300", "text-amber-300");
            } else {
              tabEl.classList.remove("active");
              tabEl.classList.add(v === "gacha" ? "text-amber-300" : "text-emerald-300");
            }
          }
        });
        const gameContainer = document.getElementById("game-container");
        const placeBg = document.getElementById("place-fullscreen-bg");
        if (screenId === "dungeon") {
          if (gameContainer) gameContainer.style.display = "block";
          if (placeBg) placeBg.classList.add("hidden");
          this.resetDungeonAfkTimer();
        } else {
          if (gameContainer) gameContainer.style.display = "none";
          if (placeBg) {
            placeBg.classList.remove("hidden");
            let bgUrl = "assets/murim_hideout_bg.jpg";
            switch (screenId) {
              case "idle":
                bgUrl = "assets/murim_hideout_bg.jpg";
                break;
              case "tower":
                bgUrl = "assets/murim_tower_bg.jpg";
                break;
              case "character":
                bgUrl = "assets/murim_hideout_bg.jpg";
                break;
              case "companion":
                bgUrl = "assets/murim_hideout_bg.jpg";
                break;
              case "inventory":
                bgUrl = "assets/murim_hideout_bg.jpg";
                break;
              case "gacha":
                bgUrl = "assets/murim_merchant_gacha_bg.jpg";
                break;
              default:
                bgUrl = "assets/murim_hideout_bg.jpg";
            }
            placeBg.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.70), rgba(9, 13, 22, 0.85)), url('${bgUrl}')`;
          }
        }
        const hudBottomBar = document.getElementById("hud-bottom-bar");
        if (hudBottomBar) {
          if (screenId === "dungeon" || screenId === "tower") {
            hudBottomBar.classList.remove("hidden");
          } else {
            hudBottomBar.classList.add("hidden");
          }
        }
        const isDungeon = screenId === "dungeon";
        const rightMeters = document.getElementById("hud-bottom-right-meters");
        if (rightMeters) {
          if (isDungeon) rightMeters.classList.remove("hidden");
          else rightMeters.classList.add("hidden");
        }
        ["dungeon-world-tier-container", "hero-aura-meter-container", "pet-squad-meter-container", "soul-killmeter-container", "dungeon-autobattle-container"].forEach((id) => {
          const el2 = document.getElementById(id);
          if (el2) {
            if (isDungeon) el2.classList.remove("hidden");
            else el2.classList.add("hidden");
          }
        });
      }
      if (this.registeredScreens.has(screenId)) {
        this.registeredScreens.get(screenId)?.onEnter?.();
      }
    }
    getCurrentScreen() {
      return this.currentScreen;
    }
  };
  __publicField(_ScreenManager, "instance");
  var ScreenManager = _ScreenManager;

  // src/client/screens/AuthScreen.ts
  init_GameStateService();
  var AuthScreen = class {
    constructor(onAuthSuccess) {
      __publicField(this, "onAuthSuccess", onAuthSuccess);
      __publicField(this, "mode", "login");
      __publicField(this, "gameState", GameStateService.getInstance());
    }
    init() {
      const loginTab = document.getElementById("auth-tab-login");
      const registerTab = document.getElementById("auth-tab-register");
      const form = document.querySelector("#screen-auth form");
      if (loginTab) loginTab.onclick = () => this.switchTab("login");
      if (registerTab) registerTab.onclick = () => this.switchTab("register");
      if (form) form.onsubmit = (e) => this.handleSubmit(e);
      this.checkExistingSession();
      this.loadRememberedCredentials();
    }
    onEnter() {
      const errDiv = document.getElementById("auth-error");
      if (errDiv) errDiv.classList.add("hidden");
      this.loadRememberedCredentials();
    }
    onLeave() {
    }
    loadRememberedCredentials() {
      const isRemember = localStorage.getItem("minimikyu_remember_me") === "true";
      const rememberedUser = localStorage.getItem("minimikyu_remembered_userid");
      const rememberedPass = localStorage.getItem("minimikyu_remembered_password");
      const rememberCheck = document.getElementById("auth-remember-me");
      const userIdInput = document.getElementById("auth-userid");
      const passwordInput = document.getElementById("auth-password");
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
    switchTab(tab) {
      this.mode = tab;
      const loginTab = document.getElementById("auth-tab-login");
      const registerTab = document.getElementById("auth-tab-register");
      const submitBtn = document.getElementById("auth-submit-btn");
      const rememberContainer = document.getElementById("auth-remember-me-container");
      if (loginTab && registerTab && submitBtn) {
        if (tab === "login") {
          loginTab.className = "flex-1 py-3 rounded-xl text-sm font-extrabold transition text-white bg-emerald-600/90";
          registerTab.className = "flex-1 py-3 rounded-xl text-sm font-extrabold transition text-emerald-400";
          submitBtn.innerText = "ENTER REALM (SIGN IN)";
          if (rememberContainer) rememberContainer.classList.remove("hidden");
        } else {
          registerTab.className = "flex-1 py-3 rounded-xl text-sm font-extrabold transition text-white bg-emerald-600/90";
          loginTab.className = "flex-1 py-3 rounded-xl text-sm font-extrabold transition text-emerald-400";
          submitBtn.innerText = "CREATE ACCOUNT & PLAY";
          if (rememberContainer) rememberContainer.classList.add("hidden");
        }
      }
    }
    async checkExistingSession() {
      const { getSessionCookie: getSessionCookie2, setSessionCookie: setSessionCookie2 } = (init_GameStateService(), __toCommonJS(GameStateService_exports));
      const loggedUserCookie = getSessionCookie2("minimikyu_logged_user") || getSessionCookie2("minimikyurealm_logged_user");
      const loggedUserStorage = localStorage.getItem("minimikyu_logged_user") || localStorage.getItem("minimikyurealm_logged_user");
      const loggedUser = loggedUserCookie || loggedUserStorage;
      if (loggedUser) {
        const FirebaseApp = window.FirebaseApp;
        if (FirebaseApp) {
          const { db, ref, child, get } = FirebaseApp;
          try {
            const snapshot = await get(child(ref(db), `users/${loggedUser}`));
            if (snapshot.exists()) {
              const userData = snapshot.val();
              this.gameState.setUserId(loggedUser);
              setSessionCookie2("minimikyu_logged_user", loggedUser, 7);
              setSessionCookie2("minimikyurealm_logged_user", loggedUser, 7);
              localStorage.setItem("minimikyu_logged_user", loggedUser);
              localStorage.setItem("minimikyurealm_logged_user", loggedUser);
              if (userData.character) {
                this.gameState.loadFromSavedCharacter(userData.character);
                this.gameState.listenToFirebase();
                this.onAuthSuccess(loggedUser, true);
              }
            }
          } catch (e) {
            console.warn("[AUTH] Error restoring Firebase session:", e);
          }
        }
      }
    }
    async handleSubmit(e) {
      e.preventDefault();
      const userIdInput = document.getElementById("auth-userid")?.value.trim();
      const passwordInput = document.getElementById("auth-password")?.value;
      const isRememberChecked = document.getElementById("auth-remember-me")?.checked;
      const errDiv = document.getElementById("auth-error");
      if (!userIdInput || !passwordInput) return;
      if (errDiv) errDiv.classList.add("hidden");
      const FirebaseApp = window.FirebaseApp;
      if (!FirebaseApp) {
        if (errDiv) {
          errDiv.innerText = "Firebase database not loaded yet. Please wait...";
          errDiv.classList.remove("hidden");
        }
        return;
      }
      const { db, ref, get, child, set } = FirebaseApp;
      const { setSessionCookie: setSessionCookie2 } = (init_GameStateService(), __toCommonJS(GameStateService_exports));
      try {
        const userRef = child(ref(db), `users/${userIdInput}`);
        const snapshot = await get(userRef);
        if (isRememberChecked) {
          localStorage.setItem("minimikyu_remember_me", "true");
          localStorage.setItem("minimikyu_remembered_userid", userIdInput);
          localStorage.setItem("minimikyu_remembered_password", encryptData(passwordInput));
        } else {
          localStorage.removeItem("minimikyu_remember_me");
          localStorage.removeItem("minimikyu_remembered_userid");
          localStorage.removeItem("minimikyu_remembered_password");
        }
        if (this.mode === "register") {
          if (snapshot.exists()) {
            throw new Error(`User ID "${userIdInput}" is already taken. Please choose another.`);
          }
          const { deleteSessionCookie: deleteSessionCookie2, setSessionCookie: setSessionCookie3 } = (init_GameStateService(), __toCommonJS(GameStateService_exports));
          deleteSessionCookie2("minimikyu_logged_user");
          deleteSessionCookie2("minimikyurealm_logged_user");
          localStorage.removeItem("minimikyu_logged_user");
          localStorage.removeItem("minimikyurealm_logged_user");
          localStorage.removeItem("minimikyurealm_state");
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
          setSessionCookie3("minimikyu_logged_user", userIdInput, 7);
          setSessionCookie3("minimikyurealm_logged_user", userIdInput, 7);
          localStorage.setItem("minimikyu_logged_user", userIdInput);
          localStorage.setItem("minimikyurealm_logged_user", userIdInput);
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
            throw new Error("Incorrect password for this User ID.");
          }
          const verifiedUserId = userData.userId || userIdInput;
          const { setSessionCookie: setSessionCookie3 } = (init_GameStateService(), __toCommonJS(GameStateService_exports));
          this.gameState.setUserId(verifiedUserId);
          setSessionCookie3("minimikyu_logged_user", verifiedUserId, 7);
          setSessionCookie3("minimikyurealm_logged_user", verifiedUserId, 7);
          localStorage.setItem("minimikyu_logged_user", verifiedUserId);
          localStorage.setItem("minimikyurealm_logged_user", verifiedUserId);
          this.gameState.logCombat(`[AUTH] User ID "${verifiedUserId}" authenticated from Firebase DB.`);
          if (userData.character) {
            this.gameState.loadFromSavedCharacter(userData.character);
            this.gameState.listenToFirebase();
            this.onAuthSuccess(verifiedUserId, true);
          } else {
            this.onAuthSuccess(verifiedUserId, false);
          }
        }
      } catch (err) {
        if (errDiv) {
          errDiv.innerText = err.message || "Authentication error";
          errDiv.classList.remove("hidden");
        }
      }
    }
  };

  // src/client/screens/CharacterCreateScreen.ts
  init_GameStateService();
  var CharacterCreateScreen = class {
    constructor(onCreateComplete) {
      __publicField(this, "onCreateComplete", onCreateComplete);
      __publicField(this, "selectedJobClass", "SAMURAI");
      __publicField(this, "selectedGender", "MALE");
      __publicField(this, "gameState", GameStateService.getInstance());
    }
    init() {
      ["warrior", "mage", "archer", "samurai"].forEach((c) => {
        const card = document.getElementById(`card-class-${c}`);
        if (card) {
          card.onclick = () => this.selectClass(c.toUpperCase());
        }
      });
      const maleBtn = document.getElementById("create-gender-male");
      const femaleBtn = document.getElementById("create-gender-female");
      if (maleBtn) maleBtn.onclick = () => this.selectGender("MALE");
      if (femaleBtn) femaleBtn.onclick = () => this.selectGender("FEMALE");
      const form = document.querySelector("#screen-char-create form");
      if (form) {
        form.onsubmit = (e) => this.handleCreate(e);
      }
    }
    onEnter() {
    }
    onLeave() {
    }
    selectGender(gender) {
      this.selectedGender = gender;
      const maleBtn = document.getElementById("create-gender-male");
      const femaleBtn = document.getElementById("create-gender-female");
      if (maleBtn && femaleBtn) {
        if (gender === "MALE") {
          maleBtn.className = "flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 border border-emerald-400";
          femaleBtn.className = "flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800";
        } else {
          femaleBtn.className = "flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-pink-600 border border-pink-400";
          maleBtn.className = "flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800";
        }
      }
    }
    selectClass(jobClass) {
      this.selectedJobClass = jobClass;
      ["warrior", "mage", "archer", "samurai"].forEach((c) => {
        const card = document.getElementById(`card-class-${c}`);
        if (card) {
          if (c === jobClass.toLowerCase()) {
            card.className = "p-4 rounded-2xl bg-emerald-900/80 border-2 border-emerald-400 cursor-pointer text-center hover:bg-emerald-800 transition";
          } else {
            card.className = "p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-800/40 cursor-pointer text-center hover:bg-emerald-800 transition";
          }
        }
      });
    }
    handleCreate(e) {
      e.preventDefault();
      const nameEl = document.getElementById("create-char-name");
      if (!nameEl || !nameEl.value.trim()) return;
      const heroName = nameEl.value.trim();
      const isWarrior = this.selectedJobClass === "WARRIOR";
      const isMage = this.selectedJobClass === "MAGE";
      const isSamurai = this.selectedJobClass === "SAMURAI";
      const baseHp = isWarrior ? 120 : isSamurai ? 110 : isMage ? 80 : 90;
      this.gameState.state.name = heroName;
      this.gameState.state.gender = this.selectedGender;
      this.gameState.state.jobClass = this.selectedJobClass;
      this.gameState.state.level = 1;
      this.gameState.state.exp = 0;
      this.gameState.state.maxExp = 100;
      this.gameState.state.hp = baseHp;
      this.gameState.state.maxHp = baseHp;
      this.gameState.state.statPoints = 5;
      this.gameState.state.str = isWarrior ? 10 : isSamurai ? 11 : 5;
      this.gameState.state.int = isMage ? 12 : 5;
      this.gameState.state.agi = isSamurai ? 14 : !isWarrior && !isMage ? 12 : 5;
      this.gameState.state.vit = isWarrior ? 8 : isSamurai ? 7 : 5;
      this.gameState.state.gold = 1500;
      this.gameState.state.gems = 50;
      const starterWeapon = this.gameState.getStarterWeaponForClass(this.selectedJobClass);
      const starterArmor = { id: "starter-armor-1", name: "Jade Guardian Armor", type: "armor", rarity: "common", icon: "\u{1F94B}", cpBonus: 15, level: 1, count: 1, description: "Starter armor crafted for new heroes.", isLocked: false };
      this.gameState.state.inventory = [starterWeapon, starterArmor];
      this.gameState.state.equippedWeapon = starterWeapon;
      this.gameState.state.equippedArmor = starterArmor;
      this.gameState.cleanNonClassWeapons();
      this.gameState.updateCP();
      this.gameState.saveToFirebase();
      this.gameState.listenToFirebase();
      this.gameState.notify();
      this.onCreateComplete();
    }
  };

  // src/client/screens/DungeonScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var DungeonScreen = class {
    constructor() {
      __publicField(this, "phaserGame", null);
      __publicField(this, "phaserScene", null);
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
      __publicField(this, "isAutoBattle", false);
    }
    init() {
      const self = this;
      const Phaser = window.Phaser;
      if (!Phaser) {
        console.error("[DUNGEON] Phaser 3 framework not available.");
        return;
      }
      class MainGameScene extends Phaser.Scene {
        constructor() {
          super("MainGameScene");
          __publicField(this, "player");
          __publicField(this, "enemies");
          __publicField(this, "droppedItems");
          __publicField(this, "skeletonMinions");
          __publicField(this, "cursors");
          __publicField(this, "wasd");
          __publicField(this, "bgGrid");
          __publicField(this, "bgCastleSprite");
          __publicField(this, "spawnTimer", null);
          __publicField(this, "monsterAttackTimer", null);
          __publicField(this, "monsterAbilityTimer", null);
          __publicField(this, "autoBattleTimer", null);
          __publicField(this, "autoSkillTimer", null);
          __publicField(this, "locatorGraphics");
          __publicField(this, "rangeGraphics");
          __publicField(this, "pickupRangeGraphics");
          __publicField(this, "auraGraphics");
          __publicField(this, "enemyAuraGraphics");
          __publicField(this, "enemyCubeGraphics");
          __publicField(this, "skillGraphics");
          __publicField(this, "heroOverheadText");
          __publicField(this, "isDead", false);
          __publicField(this, "earthRotationAngleX", 0);
          __publicField(this, "earthRotationAngleY", 0);
          __publicField(this, "autoRoamAngle", 0);
          __publicField(this, "radarSweepAngle", 0);
          // Roll Dash Q Key variables
          __publicField(this, "lastDashTime", 0);
          __publicField(this, "lastUniquePowerTime", 0);
          __publicField(this, "isDashing", false);
          __publicField(this, "isHeroMoving", false);
          // Skill State variables
          __publicField(this, "spinningStonesAngle", 0);
          // Pet & Cutscene variables
          __publicField(this, "petSprite", null);
          __publicField(this, "petKillCount", 0);
          __publicField(this, "petState", "hunting");
          __publicField(this, "isCutsceneActive", false);
        }
        preload() {
          this.createProceduralTextures();
        }
        createProceduralTextures() {
          const gWarriorM = this.make.graphics({ x: 0, y: 0, add: false });
          gWarriorM.fillStyle(1096065, 1);
          gWarriorM.fillRect(14, 18, 20, 22);
          gWarriorM.fillStyle(16765363, 1);
          gWarriorM.fillCircle(24, 14, 11);
          gWarriorM.fillStyle(292951, 1);
          gWarriorM.fillCircle(20, 13, 2.5);
          gWarriorM.fillCircle(28, 13, 2.5);
          gWarriorM.fillStyle(16777215, 1);
          gWarriorM.fillCircle(19, 12, 1);
          gWarriorM.fillCircle(27, 12, 1);
          gWarriorM.lineStyle(1.5, 10033947, 0.9);
          gWarriorM.lineBetween(17, 14, 21, 18);
          gWarriorM.fillStyle(3359061, 1);
          gWarriorM.fillRect(12, 2, 24, 8);
          gWarriorM.fillStyle(16498468, 1);
          gWarriorM.fillTriangle(10, 4, 14, 4, 8, -4);
          gWarriorM.fillTriangle(34, 4, 38, 4, 40, -4);
          gWarriorM.lineStyle(4, 16317180, 1);
          gWarriorM.lineBetween(34, 22, 46, 8);
          gWarriorM.fillStyle(292951, 1);
          gWarriorM.fillCircle(10, 28, 9);
          gWarriorM.generateTexture("chibi_warrior_m", 48, 48);
          const gWarriorF = this.make.graphics({ x: 0, y: 0, add: false });
          gWarriorF.fillStyle(1096065, 1);
          gWarriorF.fillRect(14, 18, 20, 22);
          gWarriorF.fillStyle(8138002, 1);
          gWarriorF.fillCircle(24, 16, 14);
          gWarriorF.fillStyle(16765363, 1);
          gWarriorF.fillCircle(24, 14, 10);
          gWarriorF.fillStyle(292951, 1);
          gWarriorF.fillCircle(20, 13, 2.5);
          gWarriorF.fillCircle(28, 13, 2.5);
          gWarriorF.fillStyle(16777215, 1);
          gWarriorF.fillCircle(19, 12, 1);
          gWarriorF.fillCircle(27, 12, 1);
          gWarriorF.fillStyle(16007006, 0.8);
          gWarriorF.fillCircle(19, 16, 2);
          gWarriorF.fillCircle(29, 16, 2);
          gWarriorF.lineStyle(2, 3462041, 1);
          gWarriorF.strokeCircle(24, 5, 7);
          gWarriorF.lineStyle(4, 16317180, 1);
          gWarriorF.lineBetween(34, 22, 46, 8);
          gWarriorF.generateTexture("chibi_warrior_f", 48, 48);
          const gMageM = this.make.graphics({ x: 0, y: 0, add: false });
          gMageM.fillStyle(2450411, 1);
          gMageM.fillRect(14, 18, 20, 22);
          gMageM.fillStyle(16765363, 1);
          gMageM.fillCircle(24, 14, 11);
          gMageM.fillStyle(1920728, 1);
          gMageM.fillCircle(20, 13, 2.5);
          gMageM.fillCircle(28, 13, 2.5);
          gMageM.fillStyle(16777215, 1);
          gMageM.fillCircle(19, 12, 1);
          gMageM.fillCircle(27, 12, 1);
          gMageM.fillStyle(15857145, 1);
          gMageM.fillTriangle(17, 18, 31, 18, 24, 30);
          gMageM.fillStyle(1982639, 1);
          gMageM.fillTriangle(8, 8, 40, 8, 24, -5);
          gMageM.lineStyle(3, 7877903, 1);
          gMageM.lineBetween(36, 38, 36, 2);
          gMageM.fillStyle(3718648, 1);
          gMageM.fillCircle(36, 2, 7);
          gMageM.generateTexture("chibi_mage_m", 48, 48);
          const gMageF = this.make.graphics({ x: 0, y: 0, add: false });
          gMageF.fillStyle(2450411, 1);
          gMageF.fillRect(14, 18, 20, 22);
          gMageF.fillStyle(1973067, 1);
          gMageF.fillCircle(24, 16, 14);
          gMageF.fillStyle(16765363, 1);
          gMageF.fillCircle(24, 14, 10);
          gMageF.fillStyle(3718648, 1);
          gMageF.fillCircle(20, 13, 2.5);
          gMageF.fillCircle(28, 13, 2.5);
          gMageF.fillStyle(16777215, 1);
          gMageF.fillCircle(19, 12, 1);
          gMageF.fillCircle(27, 12, 1);
          gMageF.fillStyle(1982639, 1);
          gMageF.fillTriangle(8, 8, 40, 8, 24, -5);
          gMageF.lineStyle(3, 7877903, 1);
          gMageF.lineBetween(36, 38, 36, 2);
          gMageF.fillStyle(3718648, 1);
          gMageF.fillCircle(36, 2, 7);
          gMageF.generateTexture("chibi_mage_f", 48, 48);
          const gArcherM = this.make.graphics({ x: 0, y: 0, add: false });
          gArcherM.fillStyle(366185, 1);
          gArcherM.fillRect(14, 18, 20, 22);
          gArcherM.fillStyle(16765363, 1);
          gArcherM.fillCircle(24, 14, 11);
          gArcherM.fillStyle(413243, 1);
          gArcherM.fillCircle(20, 13, 2.5);
          gArcherM.fillCircle(28, 13, 2.5);
          gArcherM.fillStyle(16777215, 1);
          gArcherM.fillCircle(19, 12, 1);
          gArcherM.fillCircle(27, 12, 1);
          gArcherM.fillStyle(4528643, 1);
          gArcherM.fillRect(19, 17, 10, 3);
          gArcherM.fillStyle(292951, 1);
          gArcherM.fillTriangle(10, 10, 38, 10, 24, 1);
          gArcherM.fillStyle(15680580, 1);
          gArcherM.fillTriangle(32, 4, 40, 0, 34, 8);
          gArcherM.lineStyle(3, 14251782, 1);
          gArcherM.strokeTriangle(34, 10, 46, 24, 34, 38);
          gArcherM.generateTexture("chibi_archer_m", 48, 48);
          const gArcherF = this.make.graphics({ x: 0, y: 0, add: false });
          gArcherF.fillStyle(366185, 1);
          gArcherF.fillRect(14, 18, 20, 22);
          gArcherF.fillStyle(11817737, 1);
          gArcherF.fillCircle(24, 16, 14);
          gArcherF.fillStyle(16765363, 1);
          gArcherF.fillCircle(24, 14, 10);
          gArcherF.fillStyle(366185, 1);
          gArcherF.fillCircle(20, 13, 2.5);
          gArcherF.fillCircle(28, 13, 2.5);
          gArcherF.fillStyle(16777215, 1);
          gArcherF.fillCircle(19, 12, 1);
          gArcherF.fillCircle(27, 12, 1);
          gArcherF.fillStyle(292951, 1);
          gArcherF.fillTriangle(10, 10, 38, 10, 24, 1);
          gArcherF.lineStyle(3, 14251782, 1);
          gArcherF.strokeTriangle(34, 10, 46, 24, 34, 38);
          gArcherF.generateTexture("chibi_archer_f", 48, 48);
          const gSamuraiM = this.make.graphics({ x: 0, y: 0, add: false });
          gSamuraiM.fillStyle(10033947, 1);
          gSamuraiM.fillRect(14, 18, 20, 22);
          gSamuraiM.fillStyle(16765363, 1);
          gSamuraiM.fillCircle(24, 14, 11);
          gSamuraiM.fillStyle(8330525, 1);
          gSamuraiM.fillCircle(20, 13, 2.5);
          gSamuraiM.fillCircle(28, 13, 2.5);
          gSamuraiM.fillStyle(16777215, 1);
          gSamuraiM.fillCircle(19, 12, 1);
          gSamuraiM.fillCircle(27, 12, 1);
          gSamuraiM.fillStyle(1579035, 1);
          gSamuraiM.fillRect(12, 2, 24, 8);
          gSamuraiM.fillStyle(16498468, 1);
          gSamuraiM.fillTriangle(10, 2, 24, -6, 38, 2);
          gSamuraiM.lineStyle(4, 16317180, 1);
          gSamuraiM.lineBetween(32, 26, 48, 4);
          gSamuraiM.lineStyle(2, 16096779, 1);
          gSamuraiM.lineBetween(32, 26, 48, 4);
          gSamuraiM.generateTexture("chibi_samurai_m", 48, 48);
          const gSamuraiF = this.make.graphics({ x: 0, y: 0, add: false });
          gSamuraiF.fillStyle(8591427, 1);
          gSamuraiF.fillRect(14, 18, 20, 22);
          gSamuraiF.fillStyle(1579035, 1);
          gSamuraiF.fillCircle(24, 16, 14);
          gSamuraiF.fillStyle(16765363, 1);
          gSamuraiF.fillCircle(24, 14, 10);
          gSamuraiF.fillStyle(12458077, 1);
          gSamuraiF.fillCircle(20, 13, 2.5);
          gSamuraiF.fillCircle(28, 13, 2.5);
          gSamuraiF.fillStyle(16777215, 1);
          gSamuraiF.fillCircle(19, 12, 1);
          gSamuraiF.fillCircle(27, 12, 1);
          gSamuraiF.fillStyle(16020150, 1);
          gSamuraiF.fillCircle(14, 6, 5);
          gSamuraiF.lineStyle(3, 16317180, 1);
          gSamuraiF.lineBetween(32, 24, 46, 6);
          gSamuraiF.generateTexture("chibi_samurai_f", 48, 48);
          const gKatanaBeam = this.make.graphics({ x: 0, y: 0, add: false });
          gKatanaBeam.lineStyle(8, 16096779, 0.9);
          gKatanaBeam.lineBetween(0, 10, 48, 10);
          gKatanaBeam.lineStyle(4, 16777215, 1);
          gKatanaBeam.lineBetween(0, 10, 48, 10);
          gKatanaBeam.generateTexture("proj_katana_beam", 52, 20);
          const drawPetTexture = (key, drawFn) => {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            drawFn(g);
            g.generateTexture(key, 48, 48);
          };
          drawPetTexture("pet_flame_drake", (g) => {
            g.fillStyle(14251782, 1);
            g.fillCircle(24, 26, 16);
            g.fillStyle(15680580, 1);
            g.fillTriangle(6, 20, 18, 14, 12, 34);
            g.fillTriangle(42, 20, 30, 14, 36, 34);
            g.fillStyle(16498468, 1);
            g.fillTriangle(18, 14, 22, 4, 24, 14);
            g.fillTriangle(30, 14, 26, 4, 24, 14);
            g.fillStyle(16707722, 1);
            g.fillCircle(18, 22, 3.5);
            g.fillCircle(30, 22, 3.5);
            g.fillStyle(0, 1);
            g.fillCircle(18, 22, 1.5);
            g.fillCircle(30, 22, 1.5);
          });
          drawPetTexture("pet_thunder_kitsune", (g) => {
            g.fillStyle(165063, 1);
            g.fillCircle(24, 26, 15);
            g.fillStyle(3718648, 1);
            g.fillTriangle(10, 20, 18, 6, 22, 22);
            g.fillTriangle(38, 20, 30, 6, 26, 22);
            g.fillStyle(14742270, 1);
            g.fillTriangle(12, 18, 18, 10, 20, 20);
            g.fillTriangle(36, 18, 30, 10, 28, 20);
            g.fillStyle(3718648, 1);
            g.fillCircle(10, 34, 6);
            g.fillCircle(38, 34, 6);
            g.fillCircle(24, 40, 7);
            g.fillStyle(16777215, 1);
            g.fillCircle(18, 24, 3);
            g.fillCircle(30, 24, 3);
          });
          drawPetTexture("pet_void_behemoth", (g) => {
            g.fillStyle(5774471, 0.9);
            g.fillCircle(24, 24, 18);
            g.fillStyle(8266446, 1);
            g.fillCircle(24, 24, 12);
            g.fillStyle(12616956, 1);
            g.fillCircle(24, 24, 7);
            g.fillStyle(16777215, 1);
            g.fillCircle(24, 24, 3);
            g.lineStyle(3, 11032055, 0.9);
            g.strokeCircle(24, 24, 21);
          });
          drawPetTexture("pet_ice_fenrir", (g) => {
            g.fillStyle(1981066, 1);
            g.fillCircle(24, 26, 16);
            g.fillStyle(6333946, 1);
            g.fillTriangle(8, 18, 16, 4, 22, 22);
            g.fillTriangle(40, 18, 32, 4, 26, 22);
            g.fillStyle(9684477, 1);
            g.fillTriangle(24, 8, 20, 2, 28, 2);
            g.fillStyle(3718648, 1);
            g.fillCircle(18, 24, 3.5);
            g.fillCircle(30, 24, 3.5);
          });
          drawPetTexture("pet_golden_gryphon", (g) => {
            g.fillStyle(14251782, 1);
            g.fillCircle(24, 26, 16);
            g.fillStyle(16498468, 1);
            g.fillTriangle(4, 20, 18, 10, 14, 36);
            g.fillTriangle(44, 20, 30, 10, 34, 36);
            g.fillStyle(16707722, 1);
            g.fillTriangle(20, 24, 28, 24, 24, 36);
            g.fillStyle(16777215, 1);
            g.fillCircle(18, 20, 3.5);
            g.fillCircle(30, 20, 3.5);
          });
          drawPetTexture("pet_abyssal_kraken", (g) => {
            g.fillStyle(1013358, 1);
            g.fillCircle(24, 20, 16);
            g.fillStyle(1357990, 1);
            g.fillCircle(10, 36, 5);
            g.fillCircle(18, 38, 5);
            g.fillCircle(24, 40, 5);
            g.fillCircle(30, 38, 5);
            g.fillCircle(38, 36, 5);
            g.fillStyle(13433841, 1);
            g.fillCircle(18, 18, 4);
            g.fillCircle(30, 18, 4);
            g.fillStyle(988970, 1);
            g.fillCircle(18, 18, 2);
            g.fillCircle(30, 18, 2);
          });
          drawPetTexture("pet_mecha_sentinel", (g) => {
            g.fillStyle(3359061, 1);
            g.fillRect(12, 12, 24, 24);
            g.lineStyle(3, 440020, 1);
            g.strokeCircle(24, 24, 18);
            g.fillStyle(440020, 1);
            g.fillRect(16, 20, 16, 6);
            g.fillStyle(16777215, 1);
            g.fillRect(18, 21, 12, 4);
          });
          drawPetTexture("pet_star_unicorn", (g) => {
            g.fillStyle(16020150, 1);
            g.fillCircle(24, 26, 15);
            g.fillStyle(16498468, 1);
            g.fillTriangle(20, 14, 28, 14, 24, -2);
            g.fillStyle(12458077, 1);
            g.fillTriangle(10, 16, 16, 6, 20, 20);
            g.fillTriangle(38, 16, 32, 6, 28, 20);
            g.fillStyle(16777215, 1);
            g.fillCircle(18, 24, 3.5);
            g.fillCircle(30, 24, 3.5);
          });
          drawPetTexture("pet_sunfire_lion", (g) => {
            g.fillStyle(16096779, 1);
            g.fillCircle(24, 24, 20);
            g.fillStyle(7877903, 1);
            g.fillCircle(24, 24, 14);
            g.fillStyle(16498468, 1);
            g.fillCircle(24, 24, 10);
            g.fillStyle(0, 1);
            g.fillCircle(19, 21, 2.5);
            g.fillCircle(29, 21, 2.5);
          });
          drawPetTexture("pet_emerald_serpent", (g) => {
            g.fillStyle(292951, 1);
            g.fillCircle(24, 24, 17);
            g.fillStyle(3462041, 1);
            g.fillCircle(24, 24, 12);
            g.fillStyle(11006928, 1);
            g.fillTriangle(14, 8, 20, 8, 16, 2);
            g.fillTriangle(34, 8, 28, 8, 32, 2);
            g.fillStyle(16777215, 1);
            g.fillCircle(18, 22, 3);
            g.fillCircle(30, 22, 3);
          });
          const generateMonster = (key, baseColor, accentColor, isBoss = false) => {
            const size = isBoss ? 72 : 48;
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(baseColor, 1);
            g.fillCircle(size / 2, size / 2, size / 2 - 4);
            g.fillStyle(accentColor, 1);
            g.fillCircle(size / 2 - 8, size / 2 - 4, 5);
            g.fillCircle(size / 2 + 8, size / 2 - 4, 5);
            if (isBoss) {
              g.fillStyle(16498468, 1);
              g.fillTriangle(size / 2 - 14, 10, size / 2 + 14, 10, size / 2, 0);
            }
            g.generateTexture(key, size, size);
          };
          generateMonster("m_slime_emerald", 1096065, 16777215);
          generateMonster("m_slime_ruby", 15680580, 16777215);
          generateMonster("m_goblin", 8702998, 1409085);
          generateMonster("m_drake", 16347926, 16498468);
          generateMonster("m_skeleton", 9741240, 988970);
          generateMonster("m_beholder", 9133302, 440020);
          generateMonster("m_demon", 440020, 3900150);
          generateMonster("m_golem", 7877903, 16096779);
          generateMonster("m_wyvern", 4674921, 15680580);
          generateMonster("m_dragon_boss", 11032055, 16498468, true);
          const gBossDemon = this.make.graphics({ x: 0, y: 0, add: false });
          gBossDemon.fillStyle(8330525, 1);
          gBossDemon.fillCircle(36, 36, 30);
          gBossDemon.fillStyle(15680580, 1);
          gBossDemon.fillCircle(36, 36, 22);
          gBossDemon.fillStyle(16498468, 1);
          gBossDemon.fillCircle(24, 28, 6);
          gBossDemon.fillCircle(48, 28, 6);
          gBossDemon.fillStyle(0, 1);
          gBossDemon.fillCircle(24, 28, 3);
          gBossDemon.fillCircle(48, 28, 3);
          gBossDemon.fillStyle(14251782, 1);
          gBossDemon.fillTriangle(14, 24, 22, 10, 10, 6);
          gBossDemon.fillTriangle(58, 24, 50, 10, 62, 6);
          gBossDemon.fillStyle(16777215, 1);
          gBossDemon.fillTriangle(26, 44, 30, 44, 28, 52);
          gBossDemon.fillTriangle(42, 44, 46, 44, 44, 52);
          gBossDemon.generateTexture("boss_infernal_demon", 72, 72);
          const gBossBehemoth = this.make.graphics({ x: 0, y: 0, add: false });
          gBossBehemoth.fillStyle(4988309, 1);
          gBossBehemoth.fillCircle(36, 36, 32);
          gBossBehemoth.fillStyle(9133302, 1);
          gBossBehemoth.fillCircle(36, 36, 24);
          gBossBehemoth.fillStyle(440020, 1);
          gBossBehemoth.fillCircle(24, 28, 7);
          gBossBehemoth.fillCircle(48, 28, 7);
          gBossBehemoth.fillStyle(16777215, 1);
          gBossBehemoth.fillCircle(24, 28, 3);
          gBossBehemoth.fillCircle(48, 28, 3);
          gBossBehemoth.fillStyle(440020, 1);
          gBossBehemoth.fillTriangle(36, 6, 28, 18, 44, 18);
          gBossBehemoth.fillTriangle(16, 14, 12, 28, 26, 22);
          gBossBehemoth.fillTriangle(56, 14, 60, 28, 46, 22);
          gBossBehemoth.generateTexture("boss_abyssal_behemoth", 72, 72);
          const gSkely = this.make.graphics({ x: 0, y: 0, add: false });
          gSkely.fillStyle(16317180, 1);
          gSkely.fillCircle(18, 16, 14);
          gSkely.fillStyle(988970, 1);
          gSkely.fillCircle(12, 14, 3.5);
          gSkely.fillCircle(24, 14, 3.5);
          gSkely.fillRect(14, 24, 8, 4);
          gSkely.generateTexture("skely_minion", 36, 36);
          const gWind = this.make.graphics({ x: 0, y: 0, add: false });
          gWind.lineStyle(2, 16777215, 0.8);
          gWind.arc(12, 12, 10, -0.6, 0.6, false);
          gWind.generateTexture("wind_gust", 24, 24);
          const gRune = this.make.graphics({ x: 0, y: 0, add: false });
          gRune.fillStyle(16498468, 1);
          gRune.fillCircle(16, 16, 12);
          gRune.fillStyle(15485081, 1);
          gRune.fillCircle(16, 16, 8);
          gRune.lineStyle(2, 16777215, 1);
          gRune.strokeCircle(16, 16, 14);
          gRune.generateTexture("drop_rune", 32, 32);
          const gKey = this.make.graphics({ x: 0, y: 0, add: false });
          gKey.fillStyle(16498468, 1);
          gKey.fillCircle(16, 10, 8);
          gKey.lineStyle(4, 16498468, 1);
          gKey.lineBetween(16, 18, 16, 28);
          gKey.lineBetween(16, 24, 22, 24);
          gKey.generateTexture("drop_key", 32, 32);
          const gSlash = this.make.graphics({ x: 0, y: 0, add: false });
          gSlash.lineStyle(6, 1096065, 1);
          gSlash.arc(18, 18, 16, -0.8, 0.8, false);
          gSlash.generateTexture("proj_slash", 36, 36);
          const gOrb = this.make.graphics({ x: 0, y: 0, add: false });
          gOrb.fillStyle(15680580, 1);
          gOrb.fillCircle(12, 12, 10);
          gOrb.lineStyle(3, 16498468, 1);
          gOrb.strokeCircle(12, 12, 12);
          gOrb.generateTexture("proj_orb", 24, 24);
          const gArrow = this.make.graphics({ x: 0, y: 0, add: false });
          gArrow.lineStyle(10, 3462041, 0.4);
          gArrow.lineBetween(0, 18, 56, 18);
          gArrow.lineStyle(6, 1096065, 1);
          gArrow.lineBetween(4, 18, 56, 18);
          gArrow.lineStyle(3, 16777215, 1);
          gArrow.lineBetween(10, 18, 56, 18);
          gArrow.fillStyle(16498468, 1);
          gArrow.fillTriangle(44, 4, 64, 18, 44, 32);
          gArrow.fillStyle(16777215, 1);
          gArrow.fillTriangle(48, 8, 62, 18, 48, 28);
          gArrow.fillStyle(3462041, 1);
          gArrow.fillTriangle(0, 4, 12, 18, 0, 18);
          gArrow.fillTriangle(0, 32, 12, 18, 0, 18);
          gArrow.generateTexture("proj_arrow", 64, 36);
          const gDragon = this.make.graphics({ x: 0, y: 0, add: false });
          gDragon.fillStyle(14251782, 1);
          gDragon.fillEllipse(32, 34, 46, 24);
          gDragon.fillStyle(15680580, 1);
          gDragon.fillTriangle(44, 20, 60, 16, 52, 32);
          gDragon.fillStyle(16498468, 1);
          gDragon.fillCircle(54, 20, 3);
          gDragon.fillStyle(12131356, 1);
          gDragon.fillTriangle(20, 24, 6, 8, 36, 16);
          gDragon.fillStyle(12131356, 1);
          gDragon.fillTriangle(20, 24, 6, 44, 36, 32);
          gDragon.fillStyle(15680580, 1);
          gDragon.fillTriangle(14, 32, 0, 36, 18, 38);
          gDragon.fillStyle(7877903, 1);
          gDragon.fillRect(24, 24, 16, 14);
          gDragon.lineStyle(2, 16498468, 1);
          gDragon.strokeRect(24, 24, 16, 14);
          gDragon.generateTexture("mount_flame_dragon", 64, 64);
          const gStallion = this.make.graphics({ x: 0, y: 0, add: false });
          gStallion.fillStyle(1981066, 1);
          gStallion.fillEllipse(32, 34, 42, 22);
          gStallion.fillStyle(3900150, 1);
          gStallion.fillRect(44, 18, 10, 20);
          gStallion.fillStyle(6333946, 1);
          gStallion.fillTriangle(44, 18, 60, 14, 52, 26);
          gStallion.fillStyle(3718648, 1);
          gStallion.fillTriangle(34, 10, 48, 12, 40, 22);
          gStallion.fillStyle(165063, 1);
          gStallion.fillRect(16, 42, 5, 14);
          gStallion.fillRect(38, 42, 5, 14);
          gStallion.fillStyle(7877903, 1);
          gStallion.fillRect(24, 24, 16, 14);
          gStallion.lineStyle(2, 3718648, 1);
          gStallion.strokeRect(24, 24, 16, 14);
          gStallion.generateTexture("mount_thunder_stallion", 64, 64);
          const gPhoenix = this.make.graphics({ x: 0, y: 0, add: false });
          gPhoenix.fillStyle(14251782, 1);
          gPhoenix.fillEllipse(32, 34, 40, 22);
          gPhoenix.fillStyle(16498468, 1);
          gPhoenix.fillTriangle(42, 22, 58, 18, 48, 30);
          gPhoenix.fillStyle(16096779, 1);
          gPhoenix.fillTriangle(22, 26, 4, 6, 36, 18);
          gPhoenix.fillStyle(16096779, 1);
          gPhoenix.fillTriangle(22, 26, 4, 46, 36, 34);
          gPhoenix.fillStyle(16498468, 1);
          gPhoenix.fillTriangle(16, 32, 0, 22, 0, 42);
          gPhoenix.fillStyle(7877903, 1);
          gPhoenix.fillRect(24, 24, 16, 14);
          gPhoenix.lineStyle(2, 16498468, 1);
          gPhoenix.strokeRect(24, 24, 16, 14);
          gPhoenix.generateTexture("mount_celestial_phoenix", 64, 64);
          const gDrake = this.make.graphics({ x: 0, y: 0, add: false });
          gDrake.fillStyle(3215426, 1);
          gDrake.fillEllipse(32, 34, 44, 26);
          gDrake.fillStyle(7020968, 1);
          gDrake.fillTriangle(44, 20, 60, 16, 52, 32);
          gDrake.fillStyle(12616956, 1);
          gDrake.fillCircle(54, 20, 3);
          gDrake.fillStyle(5774471, 1);
          gDrake.fillTriangle(20, 24, 4, 6, 36, 16);
          gDrake.fillStyle(5774471, 1);
          gDrake.fillTriangle(20, 24, 4, 46, 36, 32);
          gDrake.fillStyle(11032055, 1);
          gDrake.fillTriangle(14, 32, 0, 36, 18, 38);
          gDrake.fillStyle(1973067, 1);
          gDrake.fillRect(24, 24, 16, 14);
          gDrake.lineStyle(2, 11032055, 1);
          gDrake.strokeRect(24, 24, 16, 14);
          gDrake.generateTexture("mount_void_drake", 64, 64);
          this.load.image("dungeon_ruin_castle_bg", "assets/dungeon_ruin_castle_bg.jpg");
        }
        create() {
          self.phaserScene = this;
          const width = this.cameras.main.width;
          const height = this.cameras.main.height;
          this.bgCastleSprite = this.add.image(width / 2, height / 2, "dungeon_ruin_castle_bg").setDepth(0);
          this.bgCastleSprite.setDisplaySize(width * 1.6, height * 1.6);
          this.bgCastleSprite.setTint(3686994);
          this.bgCastleSprite.setAlpha(0.7);
          this.bgGrid = this.add.graphics().setDepth(1);
          this.rangeGraphics = this.add.graphics().setDepth(2);
          this.pickupRangeGraphics = this.add.graphics().setDepth(3);
          this.auraGraphics = this.add.graphics().setDepth(5);
          this.enemyAuraGraphics = this.add.graphics().setDepth(6);
          this.skillGraphics = this.add.graphics().setDepth(8);
          const spriteKey = this.getHeroSpriteKey();
          this.mountSprite = this.add.sprite(width / 2, height / 2 + 10, "mount_flame_dragon").setDepth(9);
          this.mountSprite.setScale(2.4);
          this.mountSprite.setVisible(false);
          this.player = this.add.sprite(width / 2, height / 2, spriteKey).setDepth(10);
          this.player.setScale(2);
          this.heroOverheadText = this.add.text(width / 2, height / 2 - 65, "", {
            fontFamily: "Arial, Helvetica, 'Segoe UI', sans-serif",
            fontSize: "13px",
            fontStyle: "bold",
            color: "#facc15",
            stroke: "#000000",
            strokeThickness: 3.5
          }).setOrigin(0.5).setDepth(110);
          this.heroAutosaveText = this.add.text(width / 2, height / 2 - 90, "", {
            fontFamily: "Arial, Helvetica, 'Segoe UI', sans-serif",
            fontSize: "11px",
            fontStyle: "bold",
            color: "#34d399",
            stroke: "#000000",
            strokeThickness: 3.5,
            backgroundColor: "rgba(2, 6, 23, 0.88)",
            padding: { x: 8, y: 3 }
          }).setOrigin(0.5).setDepth(115).setAlpha(0);
          this.tweens.add({
            targets: [this.player, this.mountSprite],
            scaleY: 2.1,
            duration: 900,
            yoyo: true,
            repeat: -1
          });
          this.enemies = this.add.group();
          this.droppedItems = this.add.group();
          this.skeletonMinions = this.add.group();
          this.porterGraphics = this.add.graphics().setDepth(15);
          this.porterText = this.add.text(width / 2 - 45, height / 2 + 20, "", {
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "11px",
            fontStyle: "bold",
            color: "#facc15",
            stroke: "#000000",
            strokeThickness: 3
          }).setOrigin(0.5).setDepth(16);
          this.locatorGraphics = this.add.graphics().setDepth(100);
          window.toggleAscendWarningModal = (show) => {
            const modal = document.getElementById("modal-ascend-warning");
            if (!modal) return;
            if (show) {
              if (self.gameState.state.level < 21) {
                self.ui.showToast(`\u26A0\uFE0F Level 21+ required to ascend Mountain Peak! (Your Level: ${self.gameState.state.level})`, "warning");
                return;
              }
              modal.classList.remove("hidden");
              self.audio.playSound("click");
            } else {
              modal.classList.add("hidden");
            }
          };
          window.confirmAscendMountainPeak = () => {
            const modal = document.getElementById("modal-ascend-warning");
            if (modal) modal.classList.add("hidden");
            const res = self.gameState.ascendMountainPeak();
            if (res.success) {
              self.audio.playSound("levelup");
              self.ui.showToast(res.message, "success");
            } else {
              self.ui.showToast(res.message, "warning");
            }
            this.updateSoulKillMeterDOM();
          };
          this.drawGrid();
          this.ensureMinimumMonsters(10);
          this.spawnTimer = this.time.addEvent({ delay: 3500, callback: () => this.autoSpawnLoop(), loop: true });
          this.monsterAttackTimer = this.time.addEvent({ delay: 1800, callback: () => this.monsterAttackHeroLoop(), loop: true });
          this.monsterAbilityTimer = this.time.addEvent({ delay: 3800, callback: () => this.executeMonsterBossAbilities(), loop: true });
          this.autoBattleTimer = this.time.addEvent({ delay: 300, callback: () => this.runAutoBattleLogic(), loop: true });
          this.autoSkillTimer = this.time.addEvent({ delay: 60, callback: () => this.runAutomaticSkillLogic(), loop: true });
          this.porterTimer = this.time.addEvent({ delay: 60, callback: () => this.updatePorterCollector(), loop: true });
          this.time.addEvent({
            delay: 1e3,
            callback: () => {
              if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
              const current = self.gameState.state.heroAuraMeter || 0;
              if (current < 100) {
                self.gameState.state.heroAuraMeter = Math.min(100, current + 2);
                this.updateHeroAuraMeterDOM();
              }
            },
            loop: true
          });
          this.time.addEvent({
            delay: 7e3,
            callback: () => {
              if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
              this.executeAutomaticUniquePower();
            },
            loop: true
          });
          this.cursors = this.input.keyboard.createCursorKeys();
          this.wasd = this.input.keyboard.addKeys("W,A,S,D,Q");
          if (this.input && this.input.keyboard) {
            this.input.keyboard.clearCaptures();
          }
          this.input.on("pointerdown", (pointer) => {
            if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;
            ScreenManager.getInstance().resetDungeonAfkTimer();
            const clickedObjects = this.input.hitTestPointer(pointer);
            let hitEnemy = false;
            clickedObjects.forEach((obj) => {
              if (obj.isEnemy) {
                hitEnemy = true;
                this.attackEnemy(obj);
              }
            });
            if (!hitEnemy) {
              this.attackTowardsPointer(pointer.x, pointer.y);
            }
          });
        }
        getHeroSpriteKey() {
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          const gender = self.gameState.state.gender || "MALE";
          return `chibi_${jobClass.toLowerCase()}_${gender === "FEMALE" ? "f" : "m"}`;
        }
        updateHeroTextureIfChanged() {
          if (!this.player) return;
          const expectedKey = this.getHeroSpriteKey();
          if (this.player.texture.key !== expectedKey) {
            this.player.setTexture(expectedKey);
          }
        }
        drawGrid() {
          const width = this.cameras.main.width;
          const height = this.cameras.main.height;
          this.bgGrid.clear();
          const centerX = width / 2;
          const centerY = height / 2;
          for (let r = 160; r <= 850; r += 120) {
            const alpha = Math.max(0.04, 0.25 - r / 1200);
            this.bgGrid.lineStyle(1.5, 3718648, alpha);
            const rx = r * 1.4;
            const ry = r * 0.75;
            this.bgGrid.strokeEllipse(centerX, centerY, rx, ry);
          }
        }
        renderRadarMinimap() {
          const canvas = document.getElementById("minimap-canvas");
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const w = canvas.width;
          const h = canvas.height;
          const center = w / 2;
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = "#090d16";
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(center, center, 24, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(center, center, 48, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(center, center, 68, 0, Math.PI * 2);
          ctx.stroke();
          this.radarSweepAngle += 0.04;
          ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(center, center);
          ctx.lineTo(center + Math.cos(this.radarSweepAngle) * 70, center + Math.sin(this.radarSweepAngle) * 70);
          ctx.stroke();
          const px = this.player ? this.player.x : center;
          const py = this.player ? this.player.y : center;
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            const relX = (e.x - px) * 0.18;
            const relY = (e.y - py) * 0.18;
            const ex = center + relX;
            const ey = center + relY;
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#f87171";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ex, ey, 7, 0, Math.PI * 2);
            ctx.stroke();
          });
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(center, center, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#60a5fa";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(center, center, 9, 0, Math.PI * 2);
          ctx.stroke();
        }
        getAttackRangeRadius() {
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          if (jobClass === "WARRIOR") return 160;
          if (jobClass === "SAMURAI") return 240;
          if (jobClass === "MAGE") return 280;
          return 340;
        }
        spawnAnimeWindTrail() {
          const px = this.player.x + (Math.random() * 20 - 10);
          const py = this.player.y + 24;
          const wind = this.add.sprite(px, py, "wind_gust");
          wind.setAlpha(0.8);
          wind.setScale(0.8);
          this.tweens.add({
            targets: wind,
            y: py + 15,
            alpha: 0,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 350,
            onComplete: () => wind.destroy()
          });
        }
        executeMonsterBossAbilities() {
          if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
          this.enemies.getChildren().forEach((e) => {
            if (!e.active || Math.random() > 0.35) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist <= 260) {
              const randAbility = Math.random();
              if (randAbility < 0.4) {
                const lungeX = this.player.x + (e.x > this.player.x ? 65 : -65);
                const lungeY = this.player.y + (e.y > this.player.y ? 65 : -65);
                this.tweens.add({
                  targets: e,
                  x: lungeX,
                  y: lungeY,
                  duration: 250,
                  yoyo: true
                });
              } else if (randAbility < 0.7) {
                this.cameras.main.shake(140, 8e-3);
                const slamRing = this.add.graphics();
                slamRing.lineStyle(4, 15680580, 0.9);
                slamRing.strokeCircle(e.x, e.y, 40);
                this.tweens.add({ targets: slamRing, alpha: 0, scaleX: 2, scaleY: 2, duration: 300, onComplete: () => slamRing.destroy() });
              } else {
                const stompRing = this.add.graphics();
                stompRing.lineStyle(4, 16096779, 0.9);
                stompRing.strokeCircle(e.x, e.y, 60);
                this.tweens.add({ targets: stompRing, alpha: 0, scaleX: 2.5, scaleY: 2.5, duration: 350, onComplete: () => stompRing.destroy() });
              }
            }
          });
        }
        getHeroMoveSpeed() {
          const equippedMount = self.gameState.state.equippedMount;
          const mountSpeedMult = equippedMount ? 1.45 : 1;
          const baseSpeed = 4.8 * mountSpeedMult;
          return this.isHeroTitanMode ? baseSpeed * 1.9 : baseSpeed;
        }
        // AUTOPILOT ULTRA-FAST MOVEMENT SPEED & HYPER-ACTIVE AUTO METERS
        runAutoBattleLogic() {
          if (!self.isAutoBattle || ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) {
            return;
          }
          const soulCount = self.gameState.state.killMeter || 0;
          const equippedCutscene = self.gameState.state.equippedCutscene;
          if (soulCount >= 100 && equippedCutscene && !this.isCutsceneActive) {
            this.triggerCutscene();
          }
          const auraCount = self.gameState.state.heroAuraMeter || 0;
          if (auraCount >= 100 && !this.isHeroTitanMode) {
            this.triggerHeroTitanAuraMode();
          }
          if (this.petSquadMeter >= 100 && !this.isSuperPetMode) {
            this.triggerSuperPetMode();
          }
          const uniquePower = self.gameState.state.equippedUniquePower;
          if (uniquePower) {
            const now = this.time.now;
            if (!this.lastUniquePowerTime || now - this.lastUniquePowerTime > 7500) {
              this.lastUniquePowerTime = now;
              this.executeAutomaticUniquePower();
            }
          }
          const maxRange = this.getAttackRangeRadius();
          let targetEnemy = null;
          let minDist = Infinity;
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist < minDist) {
              minDist = dist;
              targetEnemy = e;
            }
          });
          const speed = this.getHeroMoveSpeed() * 1.65;
          if (targetEnemy) {
            if (minDist <= maxRange) {
              this.attackEnemy(targetEnemy);
              const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetEnemy.x, targetEnemy.y);
              const dodgeSide = Math.sin(this.time.now * 8e-3) > 0 ? 1 : -1;
              const dodgeAngle = angle + Math.PI / 2 * dodgeSide + (minDist < 60 ? Math.PI : 0);
              const dodgeSpeed = speed * 1.15;
              const dx = Math.cos(dodgeAngle) * dodgeSpeed;
              const dy = Math.sin(dodgeAngle) * dodgeSpeed;
              this.spawnAnimeWindTrail();
              this.earthRotationAngleX += dx * 4e-3;
              this.earthRotationAngleY += dy * 4e-3;
              this.drawGrid();
              this.enemies.getChildren().forEach((e) => {
                e.x -= dx;
                e.y -= dy;
              });
              this.droppedItems.getChildren().forEach((i) => {
                i.x -= dx;
                i.y -= dy;
              });
              this.isHeroMoving = true;
            } else {
              const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetEnemy.x, targetEnemy.y);
              const dx = Math.cos(angle) * speed;
              const dy = Math.sin(angle) * speed;
              this.spawnAnimeWindTrail();
              this.earthRotationAngleX += dx * 5e-3;
              this.earthRotationAngleY += dy * 5e-3;
              this.drawGrid();
              this.enemies.getChildren().forEach((e) => {
                e.x -= dx;
                e.y -= dy;
              });
              this.droppedItems.getChildren().forEach((i) => {
                i.x -= dx;
                i.y -= dy;
              });
              this.isHeroMoving = true;
            }
          } else {
            this.autoRoamAngle += 0.08;
            const dx = Math.cos(this.autoRoamAngle) * speed;
            const dy = Math.sin(this.autoRoamAngle) * speed;
            this.spawnAnimeWindTrail();
            this.earthRotationAngleX += dx * 5e-3;
            this.earthRotationAngleY += dy * 5e-3;
            this.drawGrid();
            this.droppedItems.getChildren().forEach((i) => {
              i.x -= dx;
              i.y -= dy;
            });
            this.isHeroMoving = true;
          }
        }
        // 5 AUTOMATIC CASTING SKILLS SYSTEM
        runAutomaticSkillLogic() {
          if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
          const skill = self.gameState.state.equippedSkill;
          this.skillGraphics.clear();
          if (!skill || !skill.skillId) return;
          const px = this.player.x;
          const py = this.player.y;
          const level = skill.level || 1;
          const cpDamage = (skill.cpBonus || 25) * level;
          if (skill.skillId === "spinning_stone") {
            this.spinningStonesAngle += 0.25;
            const numStones = 1 + Math.floor((level - 1) / 5);
            const radius = 85;
            for (let i = 0; i < numStones; i++) {
              const a = this.spinningStonesAngle + i * Math.PI * 2 / numStones;
              const sx = px + Math.cos(a) * radius;
              const sy = py + Math.sin(a) * radius;
              this.skillGraphics.fillStyle(7877903, 1);
              this.skillGraphics.fillCircle(sx, sy, 14);
              this.skillGraphics.lineStyle(2, 14251782, 1);
              this.skillGraphics.strokeCircle(sx, sy, 16);
              this.enemies.getChildren().forEach((e) => {
                if (!e.active) return;
                const dist = Phaser.Math.Distance.Between(sx, sy, e.x, e.y);
                if (dist <= 35) {
                  this.applyAttackImpact(e, e.x, e.y);
                }
              });
            }
          } else if (skill.skillId === "flaming_field") {
            const maxRange = this.getAttackRangeRadius();
            const time = this.time.now * 8e-3;
            this.skillGraphics.lineStyle(5, 15680580, 0.95);
            this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 4) * 10);
            this.skillGraphics.lineStyle(3, 16347926, 0.85);
            this.skillGraphics.strokeCircle(px, py, maxRange * 0.7 + Math.cos(time * 3) * 6);
            this.skillGraphics.fillStyle(15680580, 0.18);
            this.skillGraphics.fillCircle(px, py, maxRange);
            for (let i = 0; i < 6; i++) {
              const emberAngle = time * 3 + i * Math.PI / 3;
              const ex = px + Math.cos(emberAngle) * (maxRange * 0.85);
              const ey = py + Math.sin(emberAngle) * (maxRange * 0.85);
              this.skillGraphics.fillStyle(16498468, 0.9);
              this.skillGraphics.fillCircle(ex, ey, 5);
            }
            this.enemies.getChildren().forEach((e) => {
              if (!e.active) return;
              const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
              if (dist <= maxRange) {
                const tickDamage = Math.max(6, Math.floor(cpDamage * 0.15));
                e.hp -= tickDamage;
                this.showDamageText(tickDamage, e.x, e.y);
                if (e.hp <= 0) this.onEnemyDefeated(e, e.x, e.y);
              }
            });
          } else if (skill.skillId === "necromancer") {
            const maxRange = this.getAttackRangeRadius();
            this.skillGraphics.lineStyle(4, 0, 0.95);
            this.skillGraphics.strokeCircle(px, py, maxRange);
            this.skillGraphics.fillStyle(1579035, 0.35);
            this.skillGraphics.fillCircle(px, py, maxRange);
            if (this.skeletonMinions.getChildren().length < 2) {
              const minion = this.add.sprite(px + (Math.random() * 80 - 40), py + (Math.random() * 80 - 40), "skely_minion");
              minion.hp = 100;
              this.skeletonMinions.add(minion);
            }
            this.skeletonMinions.getChildren().forEach((m) => {
              if (!m.active) return;
              let nearEnemy = null;
              let minDist = Infinity;
              this.enemies.getChildren().forEach((e) => {
                if (!e.active) return;
                const d = Phaser.Math.Distance.Between(m.x, m.y, e.x, e.y);
                if (d < minDist) {
                  minDist = d;
                  nearEnemy = e;
                }
              });
              if (nearEnemy && minDist <= maxRange) {
                const angle = Phaser.Math.Angle.Between(m.x, m.y, nearEnemy.x, nearEnemy.y);
                m.x += Math.cos(angle) * 4;
                m.y += Math.sin(angle) * 4;
                if (minDist <= 40) {
                  this.applyAttackImpact(nearEnemy, nearEnemy.x, nearEnemy.y);
                }
              } else {
                m.hp -= 4;
                if (m.hp <= 0) m.destroy();
              }
            });
          } else if (skill.skillId === "acid_rain") {
            const maxRange = this.getAttackRangeRadius();
            const time = this.time.now * 6e-3;
            const cloudX = px;
            const cloudY = py - 150;
            this.skillGraphics.lineStyle(4, 1096065, 0.95);
            this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 3) * 6);
            this.skillGraphics.fillStyle(1096065, 0.18);
            this.skillGraphics.fillCircle(px, py, maxRange);
            const numPuffs = 7;
            for (let i = 0; i < numPuffs; i++) {
              const offsetX = (i - (numPuffs - 1) / 2) * 32;
              const waveY = Math.sin(time * 2.5 + i * 1.2) * 7;
              const waveX = Math.cos(time * 1.8 + i * 0.8) * 5;
              const puffRadius = 36 + Math.sin(time * 3 + i) * 5;
              this.skillGraphics.fillStyle(366185, 0.45);
              this.skillGraphics.fillCircle(cloudX + offsetX + waveX, cloudY + waveY, puffRadius + 8);
              this.skillGraphics.fillStyle(1096065, 0.85);
              this.skillGraphics.fillCircle(cloudX + offsetX + waveX, cloudY + waveY, puffRadius);
              this.skillGraphics.fillStyle(8702998, 0.95);
              this.skillGraphics.fillCircle(cloudX + offsetX + waveX - 4, cloudY + waveY - 4, puffRadius * 0.45);
            }
            const numRainDrops = 14;
            for (let i = 0; i < numRainDrops; i++) {
              const rx = px + Math.sin(i * 1.7 + time * 2) * (maxRange * 0.85);
              const fallProgress = (this.time.now * 0.5 + i * 85) % 150;
              const ry = cloudY + 25 + fallProgress;
              this.skillGraphics.lineStyle(3, 8702998, 0.95);
              this.skillGraphics.lineBetween(rx, ry, rx - 0.5, ry - 14);
              if (fallProgress >= 135) {
                const splashY = py + Math.cos(i * 2.3) * 35;
                this.skillGraphics.lineStyle(2, 1096065, 0.85);
                this.skillGraphics.strokeCircle(rx, splashY, 6 + fallProgress % 8);
              }
            }
            this.enemies.getChildren().forEach((e) => {
              if (!e.active) return;
              const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
              if (dist <= maxRange) {
                const acidDamage = Math.max(6, Math.floor(cpDamage * 0.16));
                e.hp -= acidDamage;
                this.showDamageText(acidDamage, e.x, e.y);
                if (e.hp <= 0) this.onEnemyDefeated(e, e.x, e.y);
              }
            });
          } else if (skill.skillId === "cyborg") {
            const maxRange = this.getAttackRangeRadius();
            this.skillGraphics.lineStyle(5, 440020, 0.95);
            this.skillGraphics.strokeCircle(px, py, maxRange);
            this.skillGraphics.fillStyle(440020, 0.14);
            this.skillGraphics.fillCircle(px, py, maxRange);
            let laserCount = 0;
            this.enemies.getChildren().forEach((e) => {
              if (!e.active || laserCount >= 3) return;
              const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
              if (dist <= maxRange) {
                laserCount++;
                this.skillGraphics.lineStyle(16, 3718648, 0.45);
                this.skillGraphics.lineBetween(px, py, e.x, e.y);
                this.skillGraphics.lineStyle(8, 440020, 0.95);
                this.skillGraphics.lineBetween(px, py, e.x, e.y);
                this.skillGraphics.lineStyle(3, 16777215, 1);
                this.skillGraphics.lineBetween(px, py, e.x, e.y);
                this.skillGraphics.fillStyle(3718648, 0.9);
                this.skillGraphics.fillCircle(e.x, e.y, 14);
                this.skillGraphics.lineStyle(2, 16777215, 1);
                this.skillGraphics.strokeCircle(e.x, e.y, 18);
                this.applyAttackImpact(e, e.x, e.y);
              }
            });
          } else if (skill.skillId === "teleporter") {
            const maxRange = this.getAttackRangeRadius();
            const time = this.time.now * 8e-3;
            this.skillGraphics.lineStyle(5, 14251782, 0.95);
            this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 3) * 8);
            this.skillGraphics.lineStyle(3, 15680580, 0.85);
            this.skillGraphics.strokeCircle(px, py, maxRange);
            this.skillGraphics.fillStyle(10033947, 0.22);
            this.skillGraphics.fillCircle(px, py, maxRange);
            for (let i = 0; i < 8; i++) {
              const mistAngle = time * 2.5 + i * Math.PI / 4;
              const mx = px + Math.cos(mistAngle) * (maxRange * 0.7);
              const my = py + Math.sin(mistAngle) * (maxRange * 0.7);
              this.skillGraphics.fillStyle(15680580, 0.85);
              this.skillGraphics.fillCircle(mx, my, 4);
            }
            let executed = false;
            this.enemies.getChildren().forEach((e) => {
              if (!e.active || executed) return;
              const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
              if (dist <= maxRange) {
                executed = true;
                const mistFx = this.add.graphics();
                mistFx.fillStyle(15680580, 0.9);
                mistFx.fillCircle(e.x, e.y, 32);
                mistFx.lineStyle(4, 10033947, 0.95);
                mistFx.strokeCircle(e.x, e.y, 45);
                this.tweens.add({ targets: mistFx, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 300, onComplete: () => mistFx.destroy() });
                this.skillGraphics.lineStyle(6, 15680580, 1);
                this.skillGraphics.lineBetween(e.x - 25, e.y - 25, e.x + 25, e.y + 25);
                this.skillGraphics.lineBetween(e.x + 25, e.y - 25, e.x - 25, e.y + 25);
                const execDamage = Math.max(15, Math.floor(cpDamage * 2.2));
                e.hp -= execDamage;
                this.showDamageText(execDamage, e.x, e.y);
                if (e.hp <= 0) this.onEnemyDefeated(e, e.x, e.y);
              }
            });
          }
        }
        updatePorterCollector() {
          if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
          const porter = self.gameState.state.equippedPorter;
          if (!porter || !this.player || !this.player.active) {
            if (this.porterGraphics) this.porterGraphics.clear();
            if (this.porterText) this.porterText.setVisible(false);
            return;
          }
          const px = this.player.x;
          const py = this.player.y;
          if (!this.porterPos) this.porterPos = { x: px - 45, y: py + 20 };
          let targetItem = null;
          let minDist = Infinity;
          const radius = porter.porterRadiusPx || 200;
          this.droppedItems.getChildren().forEach((item) => {
            if (!item.active) return;
            const dist = Phaser.Math.Distance.Between(this.porterPos.x, this.porterPos.y, item.x, item.y);
            if (dist < minDist) {
              minDist = dist;
              targetItem = item;
            }
          });
          const speedMult = porter.rarity === "mythic" ? 9 : porter.rarity === "legendary" ? 6.5 : porter.rarity === "rare" ? 4.8 : 3.2;
          const moveSpeed = speedMult * (1 + ((porter.level || 1) - 1) * 0.1);
          if (targetItem && minDist <= radius) {
            const angle = Phaser.Math.Angle.Between(this.porterPos.x, this.porterPos.y, targetItem.x, targetItem.y);
            this.porterPos.x += Math.cos(angle) * moveSpeed;
            this.porterPos.y += Math.sin(angle) * moveSpeed;
            const itemAngle = Phaser.Math.Angle.Between(targetItem.x, targetItem.y, this.porterPos.x, this.porterPos.y);
            targetItem.x += Math.cos(itemAngle) * (moveSpeed * 1.4);
            targetItem.y += Math.sin(itemAngle) * (moveSpeed * 1.4);
            if (minDist <= 30) {
              this.collectDroppedItem(targetItem);
            }
          } else {
            const targetX = px - 45;
            const targetY = py + 20;
            const heroDist = Phaser.Math.Distance.Between(this.porterPos.x, this.porterPos.y, targetX, targetY);
            if (heroDist > 15) {
              const idleAngle = Phaser.Math.Angle.Between(this.porterPos.x, this.porterPos.y, targetX, targetY);
              this.porterPos.x += Math.cos(idleAngle) * (moveSpeed * 0.85);
              this.porterPos.y += Math.sin(idleAngle) * (moveSpeed * 0.85);
            }
          }
          this.droppedItems.getChildren().forEach((item) => {
            if (!item.active) return;
            const pDist = Phaser.Math.Distance.Between(px, py, item.x, item.y);
            if (pDist <= radius * 0.75) {
              const pAngle = Phaser.Math.Angle.Between(item.x, item.y, px, py);
              item.x += Math.cos(pAngle) * 7.5;
              item.y += Math.sin(pAngle) * 7.5;
              if (pDist <= 35) {
                this.collectDroppedItem(item);
              }
            }
          });
          if (this.porterGraphics && this.porterText) {
            this.porterGraphics.clear();
            const pX = this.porterPos.x;
            const pY = this.porterPos.y;
            let ringColor = 1096065;
            if (porter.rarity === "rare") ringColor = 3718648;
            if (porter.rarity === "legendary") ringColor = 16096779;
            if (porter.rarity === "mythic") ringColor = 11032055;
            this.porterGraphics.lineStyle(3, ringColor, 0.95);
            this.porterGraphics.fillStyle(132631, 0.88);
            this.porterGraphics.fillCircle(pX, pY, 15);
            this.porterGraphics.strokeCircle(pX, pY, 17);
            this.porterText.setPosition(pX, pY - 26);
            this.porterText.setText(`${porter.icon || "\u{1F392}"} Lvl ${porter.level || 1}`);
            this.porterText.setVisible(true);
          }
        }
        collectDroppedItem(item) {
          if (!item || !item.active) return;
          if (item.isKey) {
            self.gameState.state.towerKeys = Math.min(20, (self.gameState.state.towerKeys || 0) + 1);
            self.ui.showToast("\u{1F511} Tower Key Collected by Porter!", "info");
          } else if (item.isPetDrop) {
            self.gameState.state.gold += 500;
            self.ui.showToast("\u{1FA99} Companion Essence Collected by Porter (+500 Gold)!", "info");
          } else if (item.element) {
            self.gameState.state.gold += 150;
            self.ui.showToast(`\u2728 ${item.element.toUpperCase()} Rune Collected by Porter (+150 Gold)!`, "info");
          } else {
            self.gameState.state.gold += 80;
          }
          item.destroy();
          self.gameState.notify();
        }
        showAutosaveBadgeOverhead() {
          if (!this.heroAutosaveText || !this.player || !this.player.active) return;
          this.heroAutosaveText.setPosition(this.player.x, this.player.y - 90);
          this.heroAutosaveText.setText("\u{1F4BE} AUTOSAVED TO FIREBASE DB");
          this.heroAutosaveText.setAlpha(1);
          if (this.autosaveTween) this.autosaveTween.stop();
          this.autosaveTween = this.tweens.add({
            targets: this.heroAutosaveText,
            alpha: 0,
            y: this.player.y - 110,
            duration: 1800,
            ease: "Power2",
            onComplete: () => {
              if (this.heroAutosaveText && this.player) {
                this.heroAutosaveText.setY(this.player.y - 90);
              }
            }
          });
        }
        ensureMinimumMonsters(minCount = 10) {
          const activeEnemies = this.enemies.getChildren().filter((e) => e.active);
          const activeCount = activeEnemies.length;
          const needed = minCount - activeCount;
          const currentTier = self.gameState.getWorldTier();
          const isTier10Multiple = currentTier > 0 && currentTier % 10 === 0;
          const hasMegaBoss = activeEnemies.some((e) => e.isMegaBoss);
          if (isTier10Multiple && !hasMegaBoss) {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            const spawnX = Math.random() * (width - 300) + 150;
            const spawnY = Math.random() * (height - 300) + 150;
            this.spawnRandomEnemy(spawnX, spawnY, "boss_abyssal_behemoth", `\u{1F432} TIER ${currentTier} MYTHIC MOUNT SOVEREIGN`, 60, 5500, "lightning", true, true);
          }
          for (let i = 0; i < needed; i++) {
            const width = this.cameras.main.width;
            const height = this.cameras.main.height;
            const spawnX = Math.random() * (width - 240) + 120;
            const spawnY = Math.random() * (height - 240) + 120;
            const monsterVariants = [
              { key: "m_slime_emerald", name: "Emerald Slime", lvl: 1, hp: 40, element: "nature", isBoss: false },
              { key: "m_slime_ruby", name: "Ruby Slime", lvl: 3, hp: 55, element: "fire", isBoss: false },
              { key: "m_goblin", name: "Goblin Scout", lvl: 5, hp: 65, element: "none", isBoss: false },
              { key: "m_drake", name: "Shadow Drake", lvl: 8, hp: 85, element: "fire", isBoss: false },
              { key: "m_skeleton", name: "Skeleton Warrior", lvl: 12, hp: 110, element: "none", isBoss: false },
              { key: "m_beholder", name: "Void Beholder", lvl: 15, hp: 140, element: "lightning", isBoss: false },
              { key: "m_demon", name: "Frost Demon", lvl: 18, hp: 180, element: "lightning", isBoss: false },
              { key: "m_golem", name: "Infernal Golem", lvl: 22, hp: 230, element: "fire", isBoss: false },
              { key: "m_wyvern", name: "Dark Wyvern", lvl: 25, hp: 300, element: "nature", isBoss: false },
              { key: "boss_infernal_demon", name: "\u{1F479} Infernal Archdemon", lvl: 30, hp: 600, element: "fire", isBoss: true },
              { key: "boss_abyssal_behemoth", name: "\u{1F47E} Abyssal Behemoth", lvl: 35, hp: 800, element: "lightning", isBoss: true }
            ];
            const monster = monsterVariants[Math.floor(Math.random() * monsterVariants.length)];
            this.spawnRandomEnemy(spawnX, spawnY, monster.key, monster.name, monster.lvl, monster.hp, monster.element, monster.isBoss, false);
          }
        }
        autoSpawnLoop() {
          if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead || this.isSpawnPaused || this.isCutsceneActive) return;
          this.ensureMinimumMonsters(10);
        }
        spawnRandomEnemy(x, y, spriteKey, name, lvl, baseHp, element, isBoss = false, isMegaBoss = false) {
          const scaledLvl = self.gameState.getScaledMonsterLvl(lvl);
          let scaledHp = self.gameState.getScaledMonsterHp(baseHp);
          if (isMegaBoss) {
            scaledHp = Math.floor(scaledHp * 25);
          } else if (isBoss) {
            scaledHp = Math.floor(scaledHp * 5);
          }
          const enemy = this.add.sprite(x, y, spriteKey);
          enemy.setInteractive();
          enemy.setScale(isMegaBoss ? 5.2 : isBoss ? 2.6 : 1.2);
          enemy.isEnemy = true;
          enemy.enemyName = name;
          enemy.lvl = scaledLvl;
          enemy.hp = scaledHp;
          enemy.maxHp = scaledHp;
          enemy.element = element;
          enemy.isBoss = isBoss;
          enemy.isMegaBoss = isMegaBoss;
          this.enemies.add(enemy);
        }
        spawnElementRuneDrop(x, y, element) {
          const drop = this.add.sprite(x, y, "drop_rune");
          drop.isKey = false;
          drop.element = element;
          this.tweens.add({ targets: drop, y: y - 12, scaleX: 1.2, scaleY: 1.2, duration: 550, yoyo: true, repeat: -1 });
          this.time.delayedCall(12e3, () => {
            if (drop.active) drop.destroy();
          });
          this.droppedItems.add(drop);
        }
        spawnTowerKeyDrop(x, y) {
          const drop = this.add.sprite(x, y, "drop_key");
          drop.isKey = true;
          this.tweens.add({ targets: drop, y: y - 12, scaleX: 1.2, scaleY: 1.2, duration: 550, yoyo: true, repeat: -1 });
          this.time.delayedCall(12e3, () => {
            if (drop.active) drop.destroy();
          });
          this.droppedItems.add(drop);
        }
        spawnCompanionPetDrop(x, y) {
          const drop = this.add.sprite(x + 25, y, "chibi_archer_f");
          drop.setScale(1.2);
          drop.setTint(16020150);
          drop.isPetDrop = true;
          this.tweens.add({ targets: drop, y: y - 14, scaleX: 1.3, scaleY: 1.3, duration: 500, yoyo: true, repeat: -1 });
          this.time.delayedCall(12e3, () => {
            if (drop.active) drop.destroy();
          });
          this.droppedItems.add(drop);
        }
        monsterAttackHeroLoop() {
          if (ScreenManager.getInstance().getCurrentScreen() !== "dungeon" || this.isDead) return;
          this.enemies.getChildren().forEach((e) => {
            if (!e.active || this.isDead) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist <= 85) {
              const damage = Math.floor(Math.random() * 8) + 8;
              self.gameState.state.hp = Math.max(0, self.gameState.state.hp - damage);
              self.gameState.notify();
              self.audio.playSound("hit");
              this.cameras.main.flash(180, 239, 68, 68);
              if (this.player) {
                this.player.setTint(15680580);
                this.time.delayedCall(120, () => {
                  if (this.player && this.player.active) this.player.clearTint();
                });
              }
              this.showHeroDamageText(damage, this.player.x, this.player.y);
              this.cameras.main.shake(100, 5e-3);
              if (self.gameState.state.hp <= 0) {
                this.handleHeroDeath();
              }
            }
          });
        }
        handleHeroDeath() {
          if (this.isDead) return;
          this.isDead = true;
          self.audio.playSound("hit");
          const overlay = document.getElementById("death-respawn-overlay");
          const timerText = document.getElementById("respawn-timer-text");
          if (overlay) overlay.classList.remove("hidden");
          let secondsLeft = 5;
          if (timerText) timerText.innerText = `${secondsLeft}s`;
          const countdownTimer = setInterval(() => {
            secondsLeft--;
            if (timerText) timerText.innerText = `${secondsLeft}s`;
            if (secondsLeft <= 0) {
              clearInterval(countdownTimer);
              if (overlay) overlay.classList.add("hidden");
              self.gameState.state.hp = self.gameState.state.maxHp;
              self.gameState.notify();
              self.gameState.saveToFirebase();
              this.isDead = false;
              self.audio.playSound("levelup");
              this.spawnGoldenResurrectionLight();
            }
          }, 1e3);
        }
        spawnGoldenResurrectionLight() {
          const px = this.player.x;
          const py = this.player.y;
          const resFx = this.add.graphics();
          resFx.fillStyle(16498468, 0.9);
          resFx.fillCircle(px, py, 60);
          this.tweens.add({
            targets: resFx,
            alpha: 0,
            scaleX: 2.8,
            scaleY: 2.8,
            duration: 750,
            onComplete: () => resFx.destroy()
          });
          this.cameras.main.flash(500, 251, 191, 36);
          const el = document.createElement("div");
          el.className = "level-up-float-text";
          el.innerText = "\u2728 HERO RESURRECTED \u2728";
          el.style.left = `${px}px`;
          el.style.top = `${py - 80}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 1200);
        }
        executeAutomaticUniquePower() {
          const power = self.gameState.state.equippedUniquePower;
          if (!power || !this.player || !this.player.active) return;
          const px = this.player.x;
          const py = this.player.y;
          const level = power.level || 1;
          const damage = Math.floor((power.cpBonus || 800) * level * 2.5);
          const ring = this.add.graphics().setDepth(25);
          ring.lineStyle(8, 16096779, 1);
          ring.strokeCircle(px, py, 40);
          this.tweens.add({
            targets: ring,
            scaleX: 6,
            scaleY: 6,
            alpha: 0,
            duration: 650,
            onComplete: () => ring.destroy()
          });
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
            if (dist <= 380) {
              e.hp -= damage;
              this.showDamageText(damage, e.x, e.y);
              if (e.hp <= 0) {
                this.onEnemyDefeated(e, e.x, e.y);
              }
            }
          });
          self.audio.playSound("levelup");
          this.showFloatingPetText(`\u{1F451} ${power.name} ACTIVATED!`, px, py);
        }
        performRollDash(moveDx, moveDy) {
          const now = this.time.now;
          if (now - this.lastDashTime < 800 || this.isDashing || this.isDead) return;
          this.lastDashTime = now;
          this.isDashing = true;
          self.audio.playSound("attack");
          let dirX = 0;
          let dirY = 0;
          if (this.cursors.left.isDown || this.wasd.A.isDown) dirX -= 1;
          if (this.cursors.right.isDown || this.wasd.D.isDown) dirX += 1;
          if (this.cursors.up.isDown || this.wasd.W.isDown) dirY -= 1;
          if (this.cursors.down.isDown || this.wasd.S.isDown) dirY += 1;
          if (dirX === 0 && dirY === 0) {
            dirX = 1;
            dirY = 0;
          }
          const dashDistance = 180;
          const targetShiftX = dirX * dashDistance;
          const targetShiftY = dirY * dashDistance;
          for (let i = 1; i <= 3; i++) {
            this.time.delayedCall(i * 45, () => {
              if (!this.player || !this.player.active) return;
              const ghost = this.add.sprite(this.player.x, this.player.y, this.player.texture.key);
              ghost.setAlpha(0.65);
              ghost.setTint(3718648);
              ghost.setScale(1.8);
              this.tweens.add({ targets: ghost, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 250, onComplete: () => ghost.destroy() });
            });
          }
          const rotationDirection = dirX >= 0 ? Math.PI * 2 : -Math.PI * 2;
          this.tweens.add({
            targets: this.player,
            rotation: rotationDirection,
            duration: 280,
            ease: "Cubic.easeOut",
            onComplete: () => {
              if (this.player) this.player.setRotation(0);
              this.isDashing = false;
            }
          });
          this.enemies.getChildren().forEach((e) => {
            this.tweens.add({
              targets: e,
              x: e.x - targetShiftX,
              y: e.y - targetShiftY,
              duration: 240,
              ease: "Cubic.easeOut"
            });
          });
          this.droppedItems.getChildren().forEach((item) => {
            this.tweens.add({
              targets: item,
              x: item.x - targetShiftX,
              y: item.y - targetShiftY,
              duration: 240,
              ease: "Cubic.easeOut"
            });
          });
          const el = document.createElement("div");
          el.className = "exp-popup-text";
          el.innerText = "\u26A1 ROLL DASH!";
          el.style.color = "#38bdf8";
          el.style.left = `${this.player.x}px`;
          el.style.top = `${this.player.y - 50}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 700);
        }
        update() {
          if (!this.player || this.isDead) return;
          const activeEl = document.activeElement;
          const isTypingInInput = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
          if (isTypingInInput || ScreenManager.getInstance().getCurrentScreen() !== "dungeon") {
            return;
          }
          this.updateHeroTextureIfChanged();
          if (this.heroOverheadText) {
            const lvl = self.gameState.state.level || 1;
            const rein = self.gameState.state.ascensionLevel || 0;
            const title = self.gameState.getClassTitle();
            this.heroOverheadText.setText(`[LVL ${lvl} | REIN ${rein}] ${title}`);
            const offsetY = this.isHeroTitanMode ? 140 : 65;
            this.heroOverheadText.setPosition(this.player.x, this.player.y - offsetY);
          }
          const Phaser2 = window.Phaser;
          if (this.wasd && this.wasd.Q && Phaser2.Input.Keyboard.JustDown(this.wasd.Q)) {
            this.performRollDash(0, 0);
          }
          const speed = this.getHeroMoveSpeed();
          let dx = 0;
          let dy = 0;
          if (this.cursors.left.isDown || this.wasd.A.isDown) dx += speed;
          if (this.cursors.right.isDown || this.wasd.D.isDown) dx -= speed;
          if (this.cursors.up.isDown || this.wasd.W.isDown) dy += speed;
          if (this.cursors.down.isDown || this.wasd.S.isDown) dy -= speed;
          if (dx !== 0 || dy !== 0) {
            this.isHeroMoving = true;
            ScreenManager.getInstance().resetDungeonAfkTimer();
            this.spawnAnimeWindTrail();
            this.earthRotationAngleX += dx * 3e-3;
            this.earthRotationAngleY += dy * 3e-3;
            this.drawGrid();
            this.enemies.getChildren().forEach((e) => {
              e.x += dx;
              e.y += dy;
            });
            this.droppedItems.getChildren().forEach((i) => {
              i.x += dx;
              i.y += dy;
            });
          } else if (!self.isAutoBattle) {
            this.isHeroMoving = false;
          }
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            const dist = Phaser2.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist > 70) {
              const angle = Phaser2.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
              e.x += Math.cos(angle) * 0.7;
              e.y += Math.sin(angle) * 0.7;
            }
          });
          const pickupRange = self.isAutoBattle ? 950 : 250;
          this.droppedItems.getChildren().forEach((item) => {
            if (!item.active) return;
            const dist = Phaser2.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
            if (dist <= pickupRange || item.isBeingCollected) {
              const angle = Phaser2.Math.Angle.Between(item.x, item.y, this.player.x, this.player.y);
              const pullSpeed = Math.max(22, (pickupRange - dist) * 0.25);
              item.x += Math.cos(angle) * pullSpeed;
              item.y += Math.sin(angle) * pullSpeed;
              if (dist <= 85 || item.isBeingCollected) {
                if (!item.isBeingCollected) {
                  item.isBeingCollected = true;
                  this.collectLootDrop(item);
                }
              }
            }
          });
          this.renderSuperSaiyanAura();
          this.renderEnemyAuras();
          this.renderAttackRangeCircle();
          this.renderFadedYellowPickupRangeCircle();
          this.updateEnemyLocators();
          this.renderRadarMinimap();
          this.updateCompanionPetLogic();
          this.updateSoulKillMeterDOM();
        }
        collectLootDrop(item) {
          if (!item.active) return;
          self.audio.playSound("potion");
          if (item.isKey) {
            const currentKeys = self.gameState.state.towerKeys || 0;
            if (currentKeys < 20) {
              self.gameState.state.towerKeys = Math.min(20, currentKeys + 1);
              self.ui.showToast("\u{1F511} Picked up Tower Key (+1 Key)!", "success");
            } else {
              self.ui.showToast("\u{1F511} Picked up Tower Key (20/20 Max Keys)!", "info");
            }
          } else {
            const elem = item.element || "fire";
            const runeName = `${elem.toUpperCase()} Rune`;
            const existing = self.gameState.state.inventory.find((i) => i.name === runeName);
            if (existing) {
              existing.count++;
              existing.level = (existing.level || 1) + 1;
              existing.cpBonus = 30 * existing.level;
              self.ui.showToast(`\u2728 Upgraded ${runeName} to Lvl ${existing.level} (+1)!`, "success");
            } else {
              self.gameState.state.inventory.push({
                id: `rune-${Date.now()}`,
                name: runeName,
                type: "rune",
                rarity: "rare",
                icon: elem === "fire" ? "\u{1F525}" : elem === "lightning" ? "\u26A1" : "\u{1F33F}",
                element: elem,
                cpBonus: 30,
                level: 1,
                count: 1,
                description: `An elemental rune channeling ${elem} aura energy.`,
                isLocked: false
              });
              self.ui.showToast(`\u2728 Picked up Elemental Rune: ${runeName}!`, "success");
            }
          }
          self.gameState.notify();
          self.gameState.saveToFirebase();
          item.destroy();
        }
        renderSuperSaiyanAura() {
          this.auraGraphics.clear();
          const px = this.player.x;
          const py = this.player.y;
          const time = this.time.now * 8e-3;
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          const rune = self.gameState.state.equippedRune;
          const isAuto = self.isAutoBattle;
          let flameColor = jobClass === "WARRIOR" ? 15680580 : jobClass === "MAGE" ? 9133302 : 1096065;
          let coreColor = jobClass === "WARRIOR" ? 16096779 : jobClass === "MAGE" ? 3718648 : 3462041;
          if (rune?.element === "fire") {
            flameColor = 15680580;
            coreColor = 16498468;
          } else if (rune?.element === "lightning") {
            flameColor = 3718648;
            coreColor = 6333946;
          } else if (rune?.element === "nature") {
            flameColor = 1096065;
            coreColor = 3462041;
          }
          if (this.isHeroTitanMode) {
            flameColor = 16777215;
            coreColor = 0;
          }
          const numPoints = 32;
          const baseRadius = this.isHeroTitanMode ? 280 : isAuto ? 46 : 38;
          if (this.isHeroTitanMode) {
            const now = this.time.now;
            if (!this.lastAuraPulse || now - this.lastAuraPulse > 350) {
              this.lastAuraPulse = now;
              this.enemies.getChildren().forEach((e) => {
                if (!e.active) return;
                const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                if (dist <= 280) {
                  const titanDmg = Math.floor((self.gameState.state.cp || 35) * 1.6);
                  e.hp -= titanDmg;
                  this.showDamageText(titanDmg, e.x, e.y);
                  const shock = this.add.graphics().setDepth(30);
                  shock.lineStyle(4, 16777215, 0.95);
                  shock.lineBetween(px, py, e.x, e.y);
                  this.tweens.add({ targets: shock, alpha: 0, duration: 150, onComplete: () => shock.destroy() });
                  if (e.hp <= 0) {
                    this.onEnemyDefeated(e, e.x, e.y);
                  }
                }
              });
            }
          }
          const lineW = this.isHeroTitanMode ? 7 : 4;
          const fillAlpha = this.isHeroTitanMode ? 0.65 : 0.22;
          this.auraGraphics.lineStyle(lineW, flameColor, 0.95);
          this.auraGraphics.fillStyle(coreColor, fillAlpha);
          this.auraGraphics.beginPath();
          for (let i = 0; i <= numPoints; i++) {
            const angle = i / numPoints * Math.PI * 2;
            const wave = Math.sin(angle * 6 + time * 5) * 7 + Math.cos(angle * 12 - time * 3) * 5;
            const upwardFlameBoost = Math.sin(angle) < 0 ? Math.abs(Math.sin(angle)) * 14 : 0;
            const r = baseRadius + wave + upwardFlameBoost;
            const x = px + Math.cos(angle) * r;
            const y = py + Math.sin(angle) * r;
            if (i === 0) this.auraGraphics.moveTo(x, y);
            else this.auraGraphics.lineTo(x, y);
          }
          this.auraGraphics.closePath();
          this.auraGraphics.fillPath();
          this.auraGraphics.strokePath();
          this.auraGraphics.lineStyle(3, flameColor, 0.95);
          this.auraGraphics.beginPath();
          for (let i = 0; i <= numPoints; i++) {
            const angle = i / numPoints * Math.PI * 2;
            const wave = Math.sin(angle * 8 + time * 6) * 4;
            const r = baseRadius * 0.65 + wave;
            const x = px + Math.cos(angle) * r;
            const y = py + Math.sin(angle) * r;
            if (i === 0) this.auraGraphics.moveTo(x, y);
            else this.auraGraphics.lineTo(x, y);
          }
          this.auraGraphics.closePath();
          this.auraGraphics.strokePath();
          for (let i = 0; i < 12; i++) {
            const pTime = time * 2.8 + i * 1.1;
            const emberX = px + Math.sin(pTime * 1.5 + i) * (30 + i * 5);
            const emberY = py - pTime * 48 % 105 + 35;
            const emberSize = 3 + i % 4;
            let pColor = coreColor;
            if (this.isHeroTitanMode) {
              pColor = i % 3 === 0 ? 15680580 : i % 3 === 1 ? 16777215 : 0;
            }
            this.auraGraphics.fillStyle(pColor, 0.95);
            this.auraGraphics.fillCircle(emberX, emberY, emberSize * (this.isHeroTitanMode ? 1.5 : 1));
          }
          if (this.isHeroTitanMode) {
            this.auraGraphics.lineStyle(3, 15680580, 0.95);
            for (let k = 0; k < 4; k++) {
              const arcAngle1 = Math.random() * Math.PI * 2;
              const arcAngle2 = arcAngle1 + (Math.random() * 0.8 - 0.4);
              const r1 = 60 + Math.random() * 180;
              const r2 = 60 + Math.random() * 180;
              this.auraGraphics.lineBetween(
                px + Math.cos(arcAngle1) * r1,
                py + Math.sin(arcAngle1) * r1,
                px + Math.cos(arcAngle2) * r2,
                py + Math.sin(arcAngle2) * r2
              );
            }
          }
          if (!this.menacingTexts) this.menacingTexts = [];
          if (this.menacingTexts.length === 0) {
            for (let k = 0; k < 3; k++) {
              const mText = this.add.text(px, py, "\u30B4", {
                fontFamily: "monospace",
                fontSize: "18px",
                fontStyle: "bold",
                color: "#a855f7",
                stroke: "#000000",
                strokeThickness: 3
              }).setDepth(102);
              this.menacingTexts.push(mText);
            }
          }
          this.menacingTexts.forEach((mText, k) => {
            const mTime = time * 1.2 + k * 2.2;
            const mX = px + (k - 1) * 36 + Math.sin(mTime) * 14;
            const mY = py - 35 - mTime * 28 % 55;
            mText.setPosition(mX, mY);
            mText.setAlpha(Math.max(0.1, 1 - (py - mY) / 75));
            if (this.isHeroTitanMode) {
              mText.setColor(k % 2 === 0 ? "#ffffff" : "#000000");
            } else {
              mText.setColor(k % 2 === 0 ? "#a855f7" : "#f59e0b");
            }
          });
        }
        renderAngryEntitiesAndHoppingAnimation() {
          if (!this.enemyCubeGraphics) {
            this.enemyCubeGraphics = this.add.graphics().setDepth(14);
          }
          this.enemyCubeGraphics.clear();
          const time = this.time.now * 8e-3;
          this.enemies.getChildren().forEach((e, index) => {
            if (!e.active) return;
            const hopTime = time * 8.5 + index * 1.8;
            const hopY = Math.abs(Math.sin(hopTime)) * (e.isMegaBoss ? 10 : 18);
            const squashY = 1 + Math.sin(hopTime * 2) * 0.16;
            const squashX = 1 - Math.sin(hopTime * 2) * 0.1;
            const baseScale = e.isMegaBoss ? 5.2 : e.isBoss ? 2.6 : 1.25;
            e.setScale(baseScale * squashX, baseScale * squashY);
            const drawX = e.x;
            const drawY = e.y - hopY;
            const size = e.isMegaBoss ? 110 : e.isBoss ? 52 : 24;
            const eyeColor = e.isMegaBoss ? 16498468 : e.isBoss ? 15680580 : 16096779;
            const eyeOffset = size * 0.22;
            const eyeY = drawY - size * 0.15;
            this.enemyCubeGraphics.fillStyle(0, 0.95);
            this.enemyCubeGraphics.fillCircle(drawX - eyeOffset, eyeY, size * 0.18);
            this.enemyCubeGraphics.fillCircle(drawX + eyeOffset, eyeY, size * 0.18);
            this.enemyCubeGraphics.fillStyle(eyeColor, 1);
            this.enemyCubeGraphics.fillCircle(drawX - eyeOffset, eyeY, size * 0.12);
            this.enemyCubeGraphics.fillCircle(drawX + eyeOffset, eyeY, size * 0.12);
            this.enemyCubeGraphics.fillStyle(16777215, 1);
            this.enemyCubeGraphics.fillCircle(drawX - eyeOffset + 1, eyeY - 1, size * 0.05);
            this.enemyCubeGraphics.fillCircle(drawX + eyeOffset + 1, eyeY - 1, size * 0.05);
            if (e.isBoss || e.isMegaBoss) {
              this.enemyCubeGraphics.fillStyle(16777215, 0.95);
              this.enemyCubeGraphics.beginPath();
              this.enemyCubeGraphics.moveTo(drawX - size * 0.4, drawY - size * 0.4);
              this.enemyCubeGraphics.lineTo(drawX - size * 0.6, drawY - size * 0.8);
              this.enemyCubeGraphics.lineTo(drawX - size * 0.2, drawY - size * 0.5);
              this.enemyCubeGraphics.closePath();
              this.enemyCubeGraphics.fillPath();
              this.enemyCubeGraphics.beginPath();
              this.enemyCubeGraphics.moveTo(drawX + size * 0.4, drawY - size * 0.4);
              this.enemyCubeGraphics.lineTo(drawX + size * 0.6, drawY - size * 0.8);
              this.enemyCubeGraphics.lineTo(drawX + size * 0.2, drawY - size * 0.5);
              this.enemyCubeGraphics.closePath();
              this.enemyCubeGraphics.fillPath();
            }
          });
        }
        renderEnemyAuras() {
          this.enemyAuraGraphics.clear();
          this.renderAngryEntitiesAndHoppingAnimation();
          const time = this.time.now * 8e-3;
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            if (e.isBoss || e.isMegaBoss) {
              const bossColor = e.isMegaBoss ? 16498468 : e.texture.key === "boss_infernal_demon" ? 15680580 : 9133302;
              const coreColor = 16498468;
              const numPoints = 28;
              const baseRadius = e.isMegaBoss ? 130 : 58;
              this.enemyAuraGraphics.lineStyle(5, bossColor, 0.95);
              this.enemyAuraGraphics.fillStyle(bossColor, 0.25);
              this.enemyAuraGraphics.beginPath();
              for (let i = 0; i <= numPoints; i++) {
                const angle = i / numPoints * Math.PI * 2;
                const wave = Math.sin(angle * 7 + time * 6) * 10 + Math.cos(angle * 14 - time * 4) * 6;
                const upwardFlameBoost = Math.sin(angle) < 0 ? Math.abs(Math.sin(angle)) * 18 : 0;
                const r = baseRadius + wave + upwardFlameBoost;
                const x = e.x + Math.cos(angle) * r;
                const y = e.y + Math.sin(angle) * r;
                if (i === 0) this.enemyAuraGraphics.moveTo(x, y);
                else this.enemyAuraGraphics.lineTo(x, y);
              }
              this.enemyAuraGraphics.closePath();
              this.enemyAuraGraphics.fillPath();
              this.enemyAuraGraphics.strokePath();
              this.enemyAuraGraphics.lineStyle(3, coreColor, 0.9);
              this.enemyAuraGraphics.strokeCircle(e.x, e.y, (e.isMegaBoss ? 75 : 45) + Math.sin(time * 5) * 5);
              for (let i = 0; i < 5; i++) {
                const pTime = time * 2 + i * 1.5;
                const emberX = e.x + Math.sin(pTime) * ((e.isMegaBoss ? 60 : 35) + i * 6);
                const emberY = e.y - pTime * 38 % 85 + 30;
                this.enemyAuraGraphics.fillStyle(coreColor, 0.9);
                this.enemyAuraGraphics.fillCircle(emberX, emberY, 4);
              }
            }
          });
        }
        renderAttackRangeCircle() {
          this.rangeGraphics.clear();
          const radius = this.getAttackRangeRadius();
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          const color = jobClass === "WARRIOR" ? 1096065 : jobClass === "MAGE" ? 3900150 : 366185;
          this.rangeGraphics.lineStyle(2, color, 0.6);
          this.rangeGraphics.fillStyle(color, 0.08);
          this.rangeGraphics.fillCircle(this.player.x, this.player.y, radius);
          this.rangeGraphics.strokeCircle(this.player.x, this.player.y, radius);
        }
        renderFadedYellowPickupRangeCircle() {
          this.pickupRangeGraphics.clear();
          this.pickupRangeGraphics.lineStyle(2, 16436245, 0.55);
          this.pickupRangeGraphics.fillStyle(16436245, 0.08);
          this.pickupRangeGraphics.fillCircle(this.player.x, this.player.y, 140);
          this.pickupRangeGraphics.strokeCircle(this.player.x, this.player.y, 140);
        }
        renderHeroDungeonHUD() {
          if (!this.player || !this.player.active) return;
          const hp = self.gameState.state.hp;
          const maxHp = self.gameState.state.maxHp || 120;
          const hpRatio = Math.max(0, Math.min(100, hp / maxHp * 100));
          const exp = self.gameState.state.exp || 0;
          const maxExp = self.gameState.state.maxExp || 100;
          const expRatio = Math.max(0, Math.min(100, exp / maxExp * 100));
          const nameEl = document.getElementById("hero-hud-name");
          const rankEl = document.getElementById("hero-hud-rank");
          const hpTextEl = document.getElementById("hero-hud-hp-text");
          const hpBarEl = document.getElementById("hero-hud-hp-bar");
          const expTextEl = document.getElementById("hero-hud-exp-text");
          const expBarEl = document.getElementById("hero-hud-exp-bar");
          const lvlTextEl = document.getElementById("hero-hud-level-text");
          const cpTextEl = document.getElementById("hero-hud-cp-text");
          const iconEl = document.getElementById("hero-hud-class-icon");
          const heroRank = self.gameState.getHeroRank(self.gameState.state.level);
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          if (nameEl) nameEl.innerText = self.gameState.state.name || "Hero";
          if (rankEl) {
            rankEl.innerText = `RANK ${heroRank.rank}`;
            rankEl.style.color = heroRank.color;
          }
          if (hpTextEl) hpTextEl.innerText = `${Math.floor(hp)} / ${maxHp}`;
          if (hpBarEl) hpBarEl.style.width = `${hpRatio}%`;
          if (expTextEl) expTextEl.innerText = `${exp} / ${maxExp}`;
          if (expBarEl) expBarEl.style.width = `${expRatio}%`;
          if (lvlTextEl) lvlTextEl.innerText = `LVL ${self.gameState.state.level} (REIN ${self.gameState.state.ascensionLevel || 0})`;
          if (cpTextEl) cpTextEl.innerText = `\u26A1 ${self.gameState.state.cp || 35} CP`;
          if (iconEl) iconEl.innerText = jobClass === "WARRIOR" ? "\u{1F5E1}\uFE0F" : jobClass === "SAMURAI" ? "\u{1F977}" : jobClass === "MAGE" ? "\u{1F52E}" : "\u{1F3F9}";
          this.updateWorldTierDOM();
          this.updateMountDisplay();
        }
        updateMountDisplay() {
          if (!this.player || !this.mountSprite) return;
          const eqMount = self.gameState.state.equippedMount;
          const centerX = this.cameras.main.width / 2;
          const centerY = this.cameras.main.height / 2;
          if (!eqMount) {
            this.player.setPosition(centerX, centerY);
            this.mountSprite.setVisible(false);
            if (this.heroOverheadText) this.heroOverheadText.setPosition(centerX, centerY - 65);
            return;
          }
          let mountKey = "mount_flame_dragon";
          const name = eqMount.name || "";
          if (name.includes("Stallion") || name.includes("Thunder")) mountKey = "mount_thunder_stallion";
          else if (name.includes("Phoenix") || name.includes("Celestial")) mountKey = "mount_celestial_phoenix";
          else if (name.includes("Drake") || name.includes("Void")) mountKey = "mount_void_drake";
          if (this.mountSprite.texture.key !== mountKey) {
            this.mountSprite.setTexture(mountKey);
          }
          this.mountSprite.setVisible(true);
          this.mountSprite.setScale(2.4);
          if (this.isHeroMoving) {
            const runTime = this.time.now * 0.016;
            const legStride = Math.sin(runTime) * 3;
            const gallopBounce = Math.abs(Math.sin(runTime)) * 3;
            const tiltRotation = Math.sin(runTime) * 0.07;
            this.mountSprite.setPosition(centerX + legStride, centerY + 14 - gallopBounce);
            this.mountSprite.setRotation(tiltRotation);
            this.player.setPosition(centerX, centerY - 14 - gallopBounce);
            if (this.heroOverheadText) this.heroOverheadText.setPosition(centerX, centerY - 76 - gallopBounce);
          } else {
            this.mountSprite.setPosition(centerX, centerY + 14);
            this.mountSprite.setRotation(0);
            this.player.setPosition(centerX, centerY - 14);
            if (this.heroOverheadText) this.heroOverheadText.setPosition(centerX, centerY - 76);
          }
        }
        updateEnemyLocators() {
          this.locatorGraphics.clear();
          this.renderHeroDungeonHUD();
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) {
              if (e.lvlText) {
                e.lvlText.destroy();
                e.lvlText = null;
              }
              return;
            }
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            const inRange = dist <= this.getAttackRangeRadius();
            const radius = e.isMegaBoss ? 115 : e.isBoss ? 56 : 30;
            this.locatorGraphics.lineStyle(e.isMegaBoss ? 7 : e.isBoss ? 5 : 2, e.isMegaBoss ? 16498468 : e.isBoss ? 16096779 : inRange ? 1096065 : 15680580, 0.9);
            this.locatorGraphics.strokeCircle(e.x, e.y, radius);
            const barWidth = e.isMegaBoss ? 180 : e.isBoss ? 96 : 58;
            const barHeight = e.isMegaBoss ? 12 : e.isBoss ? 8 : 5;
            const drawX = e.x - barWidth / 2;
            const drawY = e.y - (e.isMegaBoss ? 150 : e.isBoss ? 76 : 50);
            const borderColor = e.isBoss || e.isMegaBoss ? 16498468 : inRange ? 3462041 : 16281969;
            this.locatorGraphics.lineStyle(1.5, borderColor, 0.95);
            this.locatorGraphics.strokeRect(drawX - 1.5, drawY - 1.5, barWidth + 3, barHeight + 3);
            this.locatorGraphics.fillStyle(988970, 0.9);
            this.locatorGraphics.fillRect(drawX, drawY, barWidth, barHeight);
            const hpRatio = Math.max(0, Math.min(1, e.hp / (e.maxHp || 50)));
            const fillColor = e.isBoss ? 14251782 : inRange ? 1096065 : 15680580;
            this.locatorGraphics.fillStyle(fillColor, 1);
            this.locatorGraphics.fillRect(drawX, drawY, barWidth * hpRatio, barHeight);
            this.locatorGraphics.fillStyle(16777215, 0.45);
            this.locatorGraphics.fillRect(drawX, drawY, barWidth * hpRatio, Math.max(1, Math.floor(barHeight / 3)));
            if (!e.lvlText) {
              e.lvlText = this.add.text(drawX, drawY - 12, "", {
                fontFamily: "monospace",
                fontSize: "8px",
                fontStyle: "bold",
                color: e.isBoss ? "#fbbf24" : "#ffffff",
                stroke: "#000000",
                strokeThickness: 2
              }).setDepth(101);
            }
            if (e.lvlText && e.lvlText.active) {
              e.lvlText.setPosition(drawX - 2, drawY - 12);
              e.lvlText.setText(`LVL ${e.lvl}`);
            }
          });
        }
        attackTowardsPointer(targetX, targetY) {
          if (this.isDead) return;
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, targetX, targetY);
          const maxRange = this.getAttackRangeRadius();
          if (dist > maxRange) {
            self.ui.showToast(`\u26A0\uFE0F Location outside attack range (${Math.round(dist)}px > ${maxRange}px)!`, "warning");
            return;
          }
          self.audio.playSound("attack");
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          const startX = this.player.x;
          const startY = this.player.y;
          const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
          this.tweens.add({
            targets: this.player,
            rotation: angle,
            scaleX: 2.1,
            duration: 100,
            yoyo: true,
            onComplete: () => this.player.setRotation(0)
          });
          if (jobClass === "SAMURAI") {
            const dashDist = dist + 80;
            const pastX = startX + Math.cos(angle) * dashDist;
            const pastY = startY + Math.sin(angle) * dashDist;
            const slashGraphic = this.add.graphics().setDepth(25);
            slashGraphic.lineStyle(8, 16096779, 0.95);
            slashGraphic.lineBetween(startX, startY, pastX, pastY);
            slashGraphic.lineStyle(4, 16777215, 1);
            slashGraphic.lineBetween(startX, startY, pastX, pastY);
            this.tweens.add({ targets: slashGraphic, alpha: 0, scaleY: 2, duration: 300, onComplete: () => slashGraphic.destroy() });
            for (let i = 1; i <= 3; i++) {
              const ratio = i / 4;
              const gx = startX + Math.cos(angle) * (dashDist * ratio);
              const gy = startY + Math.sin(angle) * (dashDist * ratio);
              const ghost = this.add.sprite(gx, gy, "chibi_samurai_m").setDepth(15);
              ghost.setAlpha(0.7);
              ghost.setTint(16498468);
              ghost.setScale(2.2);
              this.tweens.add({ targets: ghost, alpha: 0, scaleX: 2.6, scaleY: 2.6, duration: 250, onComplete: () => ghost.destroy() });
            }
            this.enemies.getChildren().forEach((e) => {
              if (!e.active) return;
              const dToLine = Phaser.Math.Distance.Between(targetX, targetY, e.x, e.y);
              if (dToLine <= 85) {
                this.applyAttackImpact(e, e.x, e.y);
              }
            });
            return;
          }
          let projKey = "proj_slash";
          if (jobClass === "MAGE") projKey = "proj_orb";
          if (jobClass === "ARCHER") projKey = "proj_arrow";
          const proj = this.add.sprite(startX, startY, projKey);
          proj.setRotation(angle);
          if (jobClass === "ARCHER") {
            proj.setScale(2.5);
          }
          this.tweens.add({
            targets: proj,
            x: targetX,
            y: targetY,
            duration: 220,
            onComplete: () => {
              proj.destroy();
              this.checkRangeImpact(targetX, targetY);
            }
          });
        }
        checkRangeImpact(x, y) {
          this.enemies.getChildren().forEach((e) => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
            if (dist <= 40) {
              this.applyAttackImpact(e, e.x, e.y);
            }
          });
        }
        attackEnemy(enemy) {
          if (!enemy || !enemy.active || this.isDead) return;
          this.attackTowardsPointer(enemy.x, enemy.y);
        }
        applyAttackImpact(enemy, x, y) {
          if (!enemy || !enemy.active) return;
          self.audio.playSound("hit");
          this.cameras.main.shake(120, 6e-3);
          enemy.setTint(15680580);
          this.time.delayedCall(120, () => {
            if (enemy && enemy.active) enemy.clearTint();
          });
          const spark = this.add.graphics().setDepth(20);
          spark.lineStyle(5, 15680580, 1);
          spark.lineBetween(x - 18, y - 18, x + 18, y + 18);
          spark.lineBetween(x + 18, y - 18, x - 18, y + 18);
          this.tweens.add({ targets: spark, alpha: 0, scaleX: 1.6, scaleY: 1.6, duration: 160, onComplete: () => spark.destroy() });
          const jobClass = self.gameState.state.jobClass || "WARRIOR";
          const cp = self.gameState.state.cp || 35;
          let baseDamage = Math.floor(cp * 1.5) + Math.floor(Math.random() * (cp * 0.5));
          if (jobClass === "WARRIOR") baseDamage = Math.floor(baseDamage * 1.3);
          enemy.hp -= baseDamage;
          const fx = this.add.graphics();
          fx.fillStyle(16498468, 0.95);
          fx.fillCircle(x, y, 24);
          this.tweens.add({ targets: fx, alpha: 0, scaleX: 1.8, scaleY: 1.8, duration: 220, onComplete: () => fx.destroy() });
          this.tweens.add({ targets: enemy, x: enemy.x + 8, duration: 40, yoyo: true, repeat: 3 });
          this.showDamageText(baseDamage, x, y);
          if (enemy.hp <= 0) {
            this.onEnemyDefeated(enemy, x, y);
          }
        }
        // WAVE SYSTEM & WORLD TIER INCREASE NOTICE
        onEnemyDefeated(enemy, x, y) {
          if (!enemy || !enemy.active) return;
          if (enemy.lvlText) {
            enemy.lvlText.destroy();
            enemy.lvlText = null;
          }
          const tier = self.gameState.getWorldTier();
          const isBoss = enemy.isBoss;
          const reinExpMult = self.gameState.getReincarnationExpMultiplier();
          const baseExp = (25 + (tier - 1) * 15) * (isBoss ? 8 : 1);
          const expGained = Math.floor(baseExp * reinExpMult);
          const goldGained = (60 + (tier - 1) * 35) * (isBoss ? 6 : 1);
          self.gameState.state.exp += expGained;
          self.gameState.state.gold += goldGained;
          self.gameState.state.redGems = (self.gameState.state.redGems || 0) + (isBoss ? 25 : 5);
          if (isBoss) {
            self.gameState.state.purpleGems = (self.gameState.state.purpleGems || 0) + 2;
          }
          self.gameState.state.waveKills = (self.gameState.state.waveKills || 0) + (isBoss ? 3 : 1);
          self.gameState.state.killMeter = Math.min(100, (self.gameState.state.killMeter || 0) + 1);
          this.updateSoulKillMeterDOM();
          this.petSquadMeter = Math.min(100, (this.petSquadMeter || 0) + (isBoss ? 3 : 1));
          this.updatePetSquadMeterDOM();
          if (this.petSquadMeter >= 100 && !this.isSuperPetMode) {
            this.triggerSuperPetMode();
          }
          this.showFloatingExpText(expGained, this.player.x, this.player.y);
          if (enemy.isMegaBoss) {
            this.rewardMythicMountFromBoss(x, y);
          }
          if (isBoss) {
            this.spawnTowerKeyDrop(x, y);
          } else if (enemy.element && enemy.element !== "none" && Math.random() <= 0.12) {
            this.spawnElementRuneDrop(x, y, enemy.element);
          } else if (Math.random() <= 0.08) {
            this.spawnElementRuneDrop(x, y, "fire");
          }
          while (self.gameState.state.exp >= self.gameState.state.maxExp) {
            self.gameState.state.level++;
            self.gameState.state.exp -= self.gameState.state.maxExp;
            self.gameState.state.maxExp = self.gameState.getNextLevelMaxExp(self.gameState.state.level);
            self.gameState.state.statPoints += 3;
            self.gameState.state.maxHp += 20;
            self.gameState.state.hp = self.gameState.state.maxHp;
            self.audio.playSound("levelup");
            this.showFloatingLevelUpText(self.gameState.state.level);
            self.gameState.triggerStatGlowEffect();
          }
          if (self.gameState.state.waveKills >= 8) {
            self.gameState.state.waveKills = 0;
            const currentWave = self.gameState.state.wave || 1;
            if (currentWave >= 10) {
              self.gameState.state.wave = 1;
              self.gameState.state.worldTier = (self.gameState.state.worldTier || 1) + 1;
              this.triggerWorldTierIncreasedNotice(self.gameState.state.worldTier);
            } else {
              self.gameState.state.wave = currentWave + 1;
              this.triggerWaveCompletedNotice(currentWave, self.gameState.state.wave, self.gameState.state.worldTier);
            }
          }
          self.gameState.notify();
          self.gameState.saveToFirebase();
          enemy.destroy();
          this.ensureMinimumMonsters(10);
        }
        triggerWaveCompletedNotice(clearedWave, nextWave, worldTierNum) {
          self.audio.playSound("levelup");
          const banner = document.getElementById("dungeon-wave-banner");
          const textEl = document.getElementById("wave-banner-text");
          const subEl = document.getElementById("wave-sub-text");
          if (banner && textEl && subEl) {
            textEl.innerText = `\u{1F30A} WAVE ${clearedWave}/10 CLEARED! \u{1F30A}`;
            subEl.innerText = `ADVANCING TO WAVE ${nextWave}/10 (WORLD TIER ${worldTierNum})`;
            banner.classList.remove("hidden");
            setTimeout(() => {
              banner.classList.add("hidden");
            }, 2e3);
          }
          const tierBanner = document.getElementById("dungeon-world-banner");
          if (tierBanner) {
            tierBanner.classList.add("scale-150", "text-amber-400");
            setTimeout(() => {
              tierBanner.classList.remove("scale-150", "text-amber-400");
            }, 1e3);
          }
        }
        rewardMythicMountFromBoss(x, y) {
          const mountPool = [
            { id: `mount-dragon-${Date.now()}`, name: "Flame Dragon Mount", type: "mount", rarity: "mythic", icon: "\u{1F409}", cpBonus: 2500, level: 1, count: 1, description: "Legendary Flame Dragon mount granting +45% move speed boost.", isLocked: false },
            { id: `mount-stallion-${Date.now()}`, name: "Thunder Stallion Mount", type: "mount", rarity: "mythic", icon: "\u{1F40E}", cpBonus: 2400, level: 1, count: 1, description: "Mythic Thunder Stallion mount granting +45% move speed boost.", isLocked: false },
            { id: `mount-phoenix-${Date.now()}`, name: "Celestial Phoenix Mount", type: "mount", rarity: "mythic", icon: "\u{1F985}", cpBonus: 2600, level: 1, count: 1, description: "Divine Phoenix mount granting +45% move speed boost.", isLocked: false },
            { id: `mount-voiddrake-${Date.now()}`, name: "Void Shadow Drake Mount", type: "mount", rarity: "mythic", icon: "\u{1F432}", cpBonus: 2800, level: 1, count: 1, description: "Supreme Void Drake mount granting +45% move speed boost.", isLocked: false }
          ];
          const mount = mountPool[Math.floor(Math.random() * mountPool.length)];
          if (!self.gameState.state.inventory) self.gameState.state.inventory = [];
          const existing = self.gameState.state.inventory.find((i) => i.name === mount.name);
          if (existing) {
            existing.count = (existing.count || 1) + 1;
            existing.level = (existing.level || 1) + 1;
            existing.cpBonus = Math.floor((mount.cpBonus || 2500) * (1 + 0.2 * existing.level));
            self.ui.showToast(`\u{1F409} Upgraded ${mount.name} to Lvl ${existing.level}! (+${existing.cpBonus} CP)`, "success");
          } else {
            self.gameState.state.inventory.push(mount);
            self.ui.showToast(`\u{1F409} VICTORY! Obtained ${mount.name} (+${mount.cpBonus} CP)!`, "success");
          }
          self.gameState.recalculateCP();
          self.gameState.notify();
          self.gameState.saveToFirebase();
          const banner = document.getElementById("dungeon-wave-banner");
          const textEl = document.getElementById("wave-banner-text");
          const subEl = document.getElementById("wave-sub-text");
          if (banner && textEl && subEl) {
            textEl.innerText = `\u{1F409} 2X SIZE MOUNT BOSS SLAIN! \u{1F409}`;
            subEl.innerText = `OBTAINED MYTHIC MOUNT: ${mount.name.toUpperCase()}!`;
            banner.classList.remove("hidden");
            setTimeout(() => {
              banner.classList.add("hidden");
            }, 3200);
          }
        }
        triggerWorldTierIncreasedNotice(newTierNum) {
          self.audio.playSound("levelup");
          const banner = document.getElementById("dungeon-wave-banner");
          const textEl = document.getElementById("wave-banner-text");
          const subEl = document.getElementById("wave-sub-text");
          if (banner && textEl && subEl) {
            textEl.innerText = `\u{1F3C6} WAVE 10/10 CLEARED! \u{1F3C6}`;
            subEl.innerText = `WORLD TIER INCREASED TO TIER ${newTierNum}!`;
            banner.classList.remove("hidden");
            setTimeout(() => {
              banner.classList.add("hidden");
            }, 2400);
          }
          const tierTextEl = document.getElementById("dungeon-world-tier-text");
          const containerEl = document.getElementById("world-tier-floating-container");
          if (tierTextEl) {
            tierTextEl.innerText = `WORLD TIER ${newTierNum}`;
          }
          const targetAnimEl = containerEl || tierTextEl;
          if (targetAnimEl) {
            targetAnimEl.classList.remove("scale-100");
            targetAnimEl.classList.add("scale-150", "md:scale-[2.2]", "drop-shadow-[0_0_50px_rgba(245,158,11,1)]", "animate-pulse");
            setTimeout(() => {
              targetAnimEl.classList.remove("scale-150", "md:scale-[2.2]", "drop-shadow-[0_0_50px_rgba(245,158,11,1)]", "animate-pulse");
              targetAnimEl.classList.add("scale-100");
            }, 900);
          }
        }
        showFloatingExpText(expAmount, x, y) {
          const el = document.createElement("div");
          el.className = "exp-popup-text";
          el.innerText = `+${expAmount} EXP`;
          el.style.left = `${x}px`;
          el.style.top = `${y - 45}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 1e3);
        }
        showFloatingLevelUpText(level) {
          const el = document.createElement("div");
          el.className = "level-up-float-text";
          el.innerText = `\u2B50 LEVEL UP! LEVEL ${level} \u2B50`;
          el.style.left = `${this.player.x}px`;
          el.style.top = `${this.player.y - 70}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 1200);
        }
        attackNearestEnemy() {
          if (this.isDead) return;
          const enemies = this.enemies.getChildren();
          const maxRange = this.getAttackRangeRadius();
          let targetEnemy = null;
          let minDist = Infinity;
          enemies.forEach((e) => {
            if (!e.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
            if (dist <= maxRange && dist < minDist) {
              minDist = dist;
              targetEnemy = e;
            }
          });
          if (targetEnemy) {
            this.attackEnemy(targetEnemy);
          } else {
            this.attackTowardsPointer(this.player.x + 100, this.player.y);
          }
        }
        showDamageText(damage, x, y) {
          const el = document.createElement("div");
          el.className = "damage-popup";
          el.innerText = `-${damage}`;
          el.style.left = `${x}px`;
          el.style.top = `${y - 40}px`;
          setTimeout(() => el.remove(), 800);
        }
        showHeroDamageText(damage, x, y) {
          const el = document.createElement("div");
          el.className = "damage-popup";
          el.innerText = `\u{1F4A5} -${damage} HP`;
          el.style.color = "#ef4444";
          el.style.fontWeight = "bold";
          el.style.left = `${x}px`;
          el.style.top = `${y - 45}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 700);
        }
        updateSoulKillMeterDOM() {
          const equippedCutscene = self.gameState.state.equippedCutscene;
          const containerEl = document.getElementById("soul-killmeter-container");
          if (!equippedCutscene || ScreenManager.getInstance().getCurrentScreen() !== "dungeon") {
            if (containerEl) containerEl.classList.add("hidden");
            return;
          } else {
            if (containerEl && !this.isCutsceneActive) containerEl.classList.remove("hidden");
          }
          const count = self.gameState.state.killMeter || 0;
          const textEl = document.getElementById("soul-meter-text");
          const btnEl = document.getElementById("soul-killmeter-btn");
          const ascEl = document.getElementById("ascension-lvl-text");
          if (textEl) textEl.innerText = `${count}/100`;
          if (ascEl) ascEl.innerText = `Lvl ${self.gameState.state.ascensionLevel || 0}`;
          if (btnEl) {
            if (count >= 100) {
              btnEl.classList.add("animate-bounce", "ring-4", "ring-purple-400", "shadow-[0_0_30px_rgba(168,85,247,1)]");
            } else {
              btnEl.classList.remove("animate-bounce", "ring-4", "ring-purple-400", "shadow-[0_0_30px_rgba(168,85,247,1)]");
            }
          }
        }
        triggerSuperPetMode() {
          if (this.isSuperPetMode) return;
          this.isSuperPetMode = true;
          this.petSquadMeter = 0;
          this.updatePetSquadMeterDOM();
          self.audio.playSound("levelup");
          self.ui.showToast("\u{1F525} PET RUSH MODE ACTIVATED! (5s 5X BOOST)", "success");
          this.time.delayedCall(5e3, () => {
            this.isSuperPetMode = false;
            self.ui.showToast("\u{1F43E} PET RUSH Mode ended.", "info");
          });
        }
        triggerHeroTitanAuraMode() {
          const count = self.gameState.state.heroAuraMeter || 0;
          if (count < 100) {
            self.ui.showToast(`\u{1F5A4} BANKAI Meter not full yet! (${count}/100 Kills)`, "warning");
            return;
          }
          if (this.isHeroTitanMode) return;
          this.isHeroTitanMode = true;
          self.gameState.state.heroAuraMeter = 0;
          this.updateHeroAuraMeterDOM();
          const originalCP = self.gameState.state.cp || 35;
          self.gameState.state.cp = Math.floor(originalCP * 2);
          self.gameState.notify();
          self.audio.playSound("levelup");
          self.ui.showToast("\u{1F5A4} BANKAI ACTIVATED! (2X CP BOOST, MOVE & ATTACK SPEED, MONOCHROME BLACK & WHITE FLAME AURA FOR 8S)", "success");
          this.cameras.main.flash(500, 0, 0, 0);
          this.time.delayedCall(8e3, () => {
            this.isHeroTitanMode = false;
            self.gameState.state.cp = originalCP;
            self.gameState.notify();
            self.gameState.saveToFirebase();
            self.ui.showToast("\u{1F5A4} BANKAI Mode ended. CP returned to normal.", "info");
          });
        }
        updateWorldTierDOM() {
          const tierTextEl = document.getElementById("dungeon-world-tier-text");
          const waveTextEl = document.getElementById("dungeon-wave-text");
          const tier = self.gameState.state.worldTier || 1;
          const wave = self.gameState.state.wave || 1;
          const waveKills = self.gameState.state.waveKills || 0;
          if (tierTextEl) tierTextEl.innerText = `WORLD TIER ${tier}`;
          if (waveTextEl) waveTextEl.innerText = `WAVE ${wave}/10 (${waveKills}/8 KILLS)`;
        }
        updateHeroAuraMeterDOM() {
          const textEl = document.getElementById("hero-aura-text");
          const btnEl = document.getElementById("hero-aura-meter-btn");
          const count = self.gameState.state.heroAuraMeter || 0;
          if (textEl) textEl.innerText = `${count}/100`;
          if (btnEl) {
            if (count >= 100 && !this.isHeroTitanMode) {
              btnEl.classList.add("animate-bounce", "ring-4", "ring-amber-400", "shadow-[0_0_30px_rgba(245,158,11,1)]");
            } else {
              btnEl.classList.remove("animate-bounce", "ring-4", "ring-amber-400", "shadow-[0_0_30px_rgba(245,158,11,1)]");
            }
          }
        }
        updatePetSquadMeterDOM() {
          const textEl = document.getElementById("pet-meter-text");
          const btnEl = document.getElementById("pet-squad-meter-btn");
          const containerEl = document.getElementById("pet-squad-meter-container");
          const count = this.petSquadMeter || 0;
          let activePets = self.gameState.state.equippedPets || [];
          if (activePets.length === 0 && self.gameState.state.equippedPet) {
            activePets = [self.gameState.state.equippedPet];
          }
          if (activePets.length === 0 || ScreenManager.getInstance().getCurrentScreen() !== "dungeon") {
            if (containerEl) containerEl.classList.add("hidden");
            return;
          } else {
            if (containerEl) containerEl.classList.remove("hidden");
          }
          if (textEl) textEl.innerText = `${count}/100`;
          if (btnEl) {
            if (count >= 100 && !this.isSuperPetMode) {
              btnEl.classList.add("ring-4", "ring-pink-400", "shadow-[0_0_30px_rgba(244,114,182,1)]");
            } else {
              btnEl.classList.remove("ring-4", "ring-pink-400", "shadow-[0_0_30px_rgba(244,114,182,1)]");
            }
          }
        }
        updateCompanionPetLogic() {
          let activePets = self.gameState.state.equippedPets || [];
          if (activePets.length === 0 && self.gameState.state.equippedPet) {
            activePets = [self.gameState.state.equippedPet];
          }
          if (!this.petSprites) this.petSprites = [];
          if (!this.petStates) this.petStates = [];
          if (!this.petKillCounts) this.petKillCounts = [];
          while (this.petSprites.length > activePets.length) {
            const sprite = this.petSprites.pop();
            if (sprite) sprite.destroy();
            this.petStates.pop();
            this.petKillCounts.pop();
          }
          const px = this.player.x;
          const py = this.player.y;
          const maxHeroRange = this.getAttackRangeRadius();
          const isSuper = this.isSuperPetMode;
          activePets.forEach((petData, index) => {
            if (!this.petSprites[index] || !this.petSprites[index].active) {
              const offsetX = (index % 3 - 1) * 45;
              const offsetY = (Math.floor(index / 3) + 1) * 35;
              let spriteKey = "pet_flame_drake";
              const name = petData.name || "";
              if (name.includes("Kitsune")) spriteKey = "pet_thunder_kitsune";
              else if (name.includes("Void") || name.includes("Behemoth")) spriteKey = "pet_void_behemoth";
              else if (name.includes("Fenrir") || name.includes("Wolf")) spriteKey = "pet_ice_fenrir";
              else if (name.includes("Gryphon")) spriteKey = "pet_golden_gryphon";
              else if (name.includes("Kraken")) spriteKey = "pet_abyssal_kraken";
              else if (name.includes("Sentinel") || name.includes("Mecha")) spriteKey = "pet_mecha_sentinel";
              else if (name.includes("Unicorn")) spriteKey = "pet_star_unicorn";
              else if (name.includes("Lion")) spriteKey = "pet_sunfire_lion";
              else if (name.includes("Serpent")) spriteKey = "pet_emerald_serpent";
              const sprite = this.add.sprite(px + offsetX, py + offsetY, spriteKey);
              sprite.setScale(2.2);
              sprite.setDepth(12);
              this.petSprites[index] = sprite;
              this.petStates[index] = "hunting";
              this.petKillCounts[index] = 0;
            }
            const pet = this.petSprites[index];
            const atkType = petData.petAttackType || "slash";
            const currentScale = isSuper ? 4.4 : 2.2;
            const currentSpeed = isSuper ? 18 : 6.5;
            const currentDmgMult = isSuper ? 5 : 1;
            pet.setScale(currentScale);
            if (isSuper) {
              let rarityColor = 9741240;
              if (petData.rarity === "rare") rarityColor = 1096065;
              if (petData.rarity === "epic") rarityColor = 440020;
              if (petData.rarity === "legendary") rarityColor = 16096779;
              if (petData.rarity === "mythic") rarityColor = 15680580;
              const time = this.time.now * 0.01;
              this.auraGraphics.lineStyle(6, rarityColor, 0.95);
              this.auraGraphics.strokeCircle(pet.x, pet.y, 45 + Math.sin(time * 6) * 6);
              this.auraGraphics.fillStyle(rarityColor, 0.25);
              this.auraGraphics.fillCircle(pet.x, pet.y, 45);
            }
            activePets.forEach((otherPetData, otherIndex) => {
              if (index === otherIndex) return;
              const otherPet = this.petSprites[otherIndex];
              if (!otherPet || !otherPet.active) return;
              const distBetweenPets = Phaser.Math.Distance.Between(pet.x, pet.y, otherPet.x, otherPet.y);
              const minSeparation = 55;
              if (distBetweenPets < minSeparation && distBetweenPets > 0) {
                const repAngle = Phaser.Math.Angle.Between(otherPet.x, otherPet.y, pet.x, pet.y);
                const pushForce = (minSeparation - distBetweenPets) * 0.25;
                pet.x += Math.cos(repAngle) * pushForce;
                pet.y += Math.sin(repAngle) * pushForce;
              }
            });
            if ((this.petKillCounts[index] || 0) >= 3) {
              this.petStates[index] = "returning";
            }
            if (this.petStates[index] === "returning") {
              const distToHero = Phaser.Math.Distance.Between(pet.x, pet.y, px, py);
              const angle = Phaser.Math.Angle.Between(pet.x, pet.y, px, py);
              pet.x += Math.cos(angle) * (currentSpeed * 1.2);
              pet.y += Math.sin(angle) * (currentSpeed * 1.2);
              if (distToHero <= 40) {
                this.petKillCounts[index] = 0;
                this.petStates[index] = "hunting";
                this.showFloatingPetText(`\u2728 RECHARGED ${petData.name}! \u{1F43E}`, px, py);
                self.audio.playSound("levelup");
              }
            } else {
              const activeEnemies = this.enemies.getChildren().filter((e) => e.active);
              let targetEnemy = null;
              if (activeEnemies.length > 0) {
                targetEnemy = activeEnemies[index % activeEnemies.length];
              }
              if (targetEnemy) {
                const petOffsetAngle = index * (2 * Math.PI / Math.max(1, activePets.length));
                const destX = targetEnemy.x + Math.cos(petOffsetAngle) * 35;
                const destY = targetEnemy.y + Math.sin(petOffsetAngle) * 35;
                const distToEnemy = Phaser.Math.Distance.Between(pet.x, pet.y, destX, destY);
                const angle = Phaser.Math.Angle.Between(pet.x, pet.y, destX, destY);
                pet.x += Math.cos(angle) * currentSpeed;
                pet.y += Math.sin(angle) * currentSpeed;
                if (distToEnemy <= (atkType === "sniper" || atkType === "laser" ? 240 : 65)) {
                  const petDamage = Math.floor((petData.cpBonus || 45) * (petData.level || 1) * 1.6 * currentDmgMult);
                  targetEnemy.hp -= petDamage;
                  this.showDamageText(petDamage, targetEnemy.x, targetEnemy.y);
                  this.showDamageText(petDamage, targetEnemy.x, targetEnemy.y);
                  if (atkType === "sniper") {
                    const bolt = this.add.graphics().setDepth(20);
                    bolt.lineStyle(3, 3718648, 1);
                    bolt.lineBetween(pet.x, pet.y, targetEnemy.x, targetEnemy.y);
                    this.tweens.add({ targets: bolt, alpha: 0, duration: 150, onComplete: () => bolt.destroy() });
                  } else if (atkType === "laser") {
                    const beam = this.add.graphics().setDepth(20);
                    beam.lineStyle(8, 440020, 0.9);
                    beam.lineBetween(pet.x, pet.y, targetEnemy.x, targetEnemy.y);
                    this.tweens.add({ targets: beam, alpha: 0, scaleY: 2, duration: 200, onComplete: () => beam.destroy() });
                  } else if (atkType === "mage") {
                    const nova = this.add.graphics().setDepth(20);
                    nova.lineStyle(4, 11032055, 1);
                    nova.strokeCircle(targetEnemy.x, targetEnemy.y, 25);
                    this.tweens.add({ targets: nova, alpha: 0, scaleX: 1.8, scaleY: 1.8, duration: 220, onComplete: () => nova.destroy() });
                  } else if (atkType === "shield") {
                    const shock = this.add.graphics().setDepth(20);
                    shock.lineStyle(5, 16436245, 1);
                    shock.strokeCircle(targetEnemy.x, targetEnemy.y, 35);
                    this.tweens.add({ targets: shock, alpha: 0, scaleX: 1.6, scaleY: 1.6, duration: 200, onComplete: () => shock.destroy() });
                  } else {
                    const clawFx = this.add.graphics().setDepth(20);
                    clawFx.lineStyle(5, 16020150, 1);
                    clawFx.lineBetween(targetEnemy.x - 20, targetEnemy.y - 20, targetEnemy.x + 20, targetEnemy.y + 20);
                    clawFx.lineBetween(targetEnemy.x - 10, targetEnemy.y - 25, targetEnemy.x + 25, targetEnemy.y + 10);
                    this.tweens.add({ targets: clawFx, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 180, onComplete: () => clawFx.destroy() });
                  }
                  if (targetEnemy.hp <= 0) {
                    this.petKillCounts[index] = (this.petKillCounts[index] || 0) + 1;
                    this.onEnemyDefeated(targetEnemy, targetEnemy.x, targetEnemy.y);
                  }
                }
              } else {
                const orbitAngle = index * (2 * Math.PI / Math.max(1, activePets.length));
                const heroStanceX = px + Math.cos(orbitAngle) * 70;
                const heroStanceY = py + Math.sin(orbitAngle) * 70;
                const distToStance = Phaser.Math.Distance.Between(pet.x, pet.y, heroStanceX, heroStanceY);
                if (distToStance > 15) {
                  const angle = Phaser.Math.Angle.Between(pet.x, pet.y, heroStanceX, heroStanceY);
                  pet.x += Math.cos(angle) * 5.5;
                  pet.y += Math.sin(angle) * 5.5;
                }
              }
            }
          });
        }
        showFloatingPetText(text, x, y) {
          const el = document.createElement("div");
          el.className = "level-up-float-text";
          el.innerText = text;
          el.style.color = "#f472b6";
          el.style.left = `${x}px`;
          el.style.top = `${y - 60}px`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 900);
        }
        triggerCutscene() {
          const count = self.gameState.state.killMeter || 0;
          if (count < 100) {
            self.ui.showToast(`\u{1F47B} Soul Meter not full yet! (${count}/100 Kills)`, "warning");
            return;
          }
          if (this.isCutsceneActive) return;
          this.isCutsceneActive = true;
          if (!self.isAutoBattle) {
            self.toggleAutoBattle();
          }
          ScreenManager.getInstance().resetDungeonAfkTimer();
          self.gameState.state.killMeter = 0;
          this.updateSoulKillMeterDOM();
          const cutscene = self.gameState.state.equippedCutscene;
          const cutsceneId = cutscene?.cutsceneId || "shadow_arise";
          const title = cutscene ? cutscene.name : "SHADOW ARISE";
          const overlay = document.getElementById("cutscene-overlay");
          const bgImage = document.getElementById("cutscene-bg-image");
          const strobeEl = document.getElementById("cutscene-strobe-flash");
          const titleEl = document.getElementById("cutscene-title");
          const subEl = document.getElementById("cutscene-subtitle");
          const titleBox = document.getElementById("cutscene-title-box");
          const titleSlashLine = document.getElementById("title-slash-line");
          const whiteFlashEl = document.getElementById("cutscene-white-flash");
          if (overlay) overlay.classList.remove("hidden");
          if (whiteFlashEl) whiteFlashEl.style.opacity = "0";
          if (titleEl) titleEl.innerText = title;
          if (subEl) {
            if (cutsceneId === "shadow_arise") subEl.innerText = "\u{1F311} SHADOW MONARCH ARMY ARISE \u2022 NOIR VOID SLASH!";
            else if (cutsceneId === "getsuga_tensho") subEl.innerText = "\u2694\uFE0F GETSUGA TENSHO \u2022 CRESCENT MOON KATANA BLADE!";
            else subEl.innerText = "\u{1F4A5} I AM ATOMIC \u2022 SCREEN SHATTERING ATOMIC EXPLOSION!";
          }
          if (titleBox) {
            titleBox.className = "relative z-20 text-center space-y-3 p-4 max-w-4xl pointer-events-none transform transition-all duration-500 scale-150 opacity-0";
            setTimeout(() => {
              titleBox.className = "relative z-20 text-center space-y-3 p-4 max-w-4xl pointer-events-none transform transition-all duration-500 scale-100 opacity-100";
            }, 100);
          }
          if (titleSlashLine) {
            titleSlashLine.className = "w-[140%] h-3.5 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-x-0 opacity-0 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,1)]";
            setTimeout(() => {
              titleSlashLine.className = "w-[140%] h-3.5 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-x-100 opacity-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,1)]";
              self.audio.playSound("hit");
            }, 450);
          }
          if (bgImage) {
            if (cutsceneId === "shadow_arise") {
              bgImage.className = "absolute inset-0 w-full h-full object-cover filter contrast-200 brightness-90 hue-rotate-270 opacity-80 transition-all duration-700 transform scale-105";
            } else if (cutsceneId === "i_am_atomic") {
              bgImage.className = "absolute inset-0 w-full h-full object-cover filter contrast-200 brightness-120 sepia opacity-85 transition-all duration-700 transform scale-105";
            } else {
              bgImage.className = "absolute inset-0 w-full h-full object-cover filter grayscale contrast-200 brightness-110 opacity-80 transition-all duration-700 transform scale-105";
            }
          }
          const header = document.querySelector("header");
          const footer = document.getElementById("hud-bottom-bar");
          const rightMeters = document.getElementById("hud-bottom-right-meters");
          if (header) header.classList.add("hidden");
          if (footer) footer.classList.add("hidden");
          if (rightMeters) rightMeters.classList.add("hidden");
          self.audio.playSound("levelup");
          const cutsceneGraphics = this.add.graphics().setDepth(200);
          let secondsLeft = 3;
          let isStrobeOn = false;
          const cutsceneInterval = setInterval(() => {
            secondsLeft -= 0.1;
            if (!this.player || !this.player.active || !cutsceneGraphics || !cutsceneGraphics.active) {
              clearInterval(cutsceneInterval);
              if (strobeEl) strobeEl.style.opacity = "0";
              this.isCutsceneActive = false;
              return;
            }
            if (strobeEl) {
              isStrobeOn = !isStrobeOn;
              strobeEl.style.opacity = isStrobeOn ? "0.7" : "0";
            }
            if (bgImage && secondsLeft <= 1) {
              bgImage.className = `absolute inset-0 w-full h-full object-cover filter contrast-300 brightness-150 transition-all duration-500 transform scale-140 ${cutsceneId === "shadow_arise" ? "hue-rotate-270" : cutsceneId === "i_am_atomic" ? "sepia" : "grayscale"}`;
              this.cameras.main.shake(120, 0.015);
            }
            cutsceneGraphics.clear();
            const px = this.player.x;
            const py = this.player.y;
            const time = this.time.now * 0.012;
            const slashAngle = time * 4.5;
            const slashRadius = 240 + Math.sin(time * 8) * 80;
            cutsceneGraphics.lineStyle(28, 16777215, 0.95);
            cutsceneGraphics.arc(px, py, slashRadius, slashAngle - 1.2, slashAngle + 1.2, false);
            cutsceneGraphics.lineStyle(14, 0, 1);
            cutsceneGraphics.arc(px, py, slashRadius - 8, slashAngle - 1, slashAngle + 1, false);
            for (let i = 0; i < 8; i++) {
              const angle = i * Math.PI / 4 + time;
              const startX = px + Math.cos(angle) * 50;
              const startY = py + Math.sin(angle) * 50;
              const endX = px + Math.cos(angle) * (200 + i * 25);
              const endY = py + Math.sin(angle) * (200 + i * 25);
              cutsceneGraphics.lineStyle(3, 16777215, 0.9);
              cutsceneGraphics.lineBetween(startX, startY, endX, endY);
            }
            if (secondsLeft <= 0) {
              clearInterval(cutsceneInterval);
              if (strobeEl) strobeEl.style.opacity = "0";
              if (cutsceneGraphics && cutsceneGraphics.active) cutsceneGraphics.destroy();
              if (whiteFlashEl) {
                whiteFlashEl.style.opacity = "1";
              }
              this.enemies.getChildren().forEach((e) => {
                if (e && e.active) {
                  e.hp = 0;
                  this.onEnemyDefeated(e, e.x, e.y);
                }
              });
              this.isSpawnPaused = true;
              this.time.delayedCall(1500, () => {
                this.isSpawnPaused = false;
                if (ScreenManager.getInstance().getCurrentScreen() === "dungeon" && !this.isDead) {
                  this.ensureMinimumMonsters(10);
                }
              });
              self.audio.playSound("levelup");
              self.ui.showToast("\u{1F4A5} ULTIMATE CUTSCENE EXECUTED! ALL ENEMIES ANNIHILATED!", "success");
              if (overlay) overlay.classList.add("hidden");
              if (header) header.classList.remove("hidden");
              if (footer) footer.classList.remove("hidden");
              if (rightMeters) rightMeters.classList.remove("hidden");
              this.isCutsceneActive = false;
              setTimeout(() => {
                if (whiteFlashEl) whiteFlashEl.style.opacity = "0";
              }, 200);
            }
          }, 100);
        }
      }
      this.phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: "game-container",
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "#01140e",
        scene: MainGameScene
      });
      window.addEventListener("resize", () => {
        if (this.phaserGame) {
          this.phaserGame.scale.resize(window.innerWidth, window.innerHeight);
        }
      });
      const autoBattleBtn = document.getElementById("btn-toggle-autobattle");
      if (autoBattleBtn) {
        autoBattleBtn.onclick = () => this.toggleAutoBattle();
      }
    }
    toggleAutoBattle() {
      this.isAutoBattle = !this.isAutoBattle;
      const btn = document.getElementById("btn-toggle-autobattle");
      const statusText = document.getElementById("autobattle-status-text");
      if (btn) {
        if (this.isAutoBattle) {
          btn.className = "w-20 h-20 md:w-24 md:h-24 rounded-3xl glass-panel border-2 border-emerald-400 bg-gradient-to-b from-emerald-600 via-emerald-800 to-black flex flex-col items-center justify-center text-emerald-200 shadow-[0_0_35px_rgba(16,185,129,1)] ring-4 ring-emerald-400 animate-pulse transition hover:scale-110 active:scale-95 group relative cursor-pointer";
          if (statusText) statusText.innerText = "ON \u{1F525}";
          this.ui.showToast("\u2694\uFE0F AUTO Mode (Battle & Loot Collect) Activated!", "success");
        } else {
          btn.className = "w-20 h-20 md:w-24 md:h-24 rounded-3xl glass-panel border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-950 via-slate-900 to-black flex flex-col items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition hover:scale-110 active:scale-95 group relative cursor-pointer";
          if (statusText) statusText.innerText = "OFF";
          this.ui.showToast("\u2694\uFE0F AUTO Mode Deactivated.", "info");
        }
      }
      ScreenManager.getInstance().resetDungeonAfkTimer();
      this.audio.playSound("click");
    }
    triggerAttack() {
      if (this.phaserScene) {
        this.phaserScene.attackNearestEnemy();
      }
    }
    triggerSuperPetMode() {
      if (this.phaserScene) {
        this.phaserScene.triggerSuperPetMode();
      }
    }
    triggerHeroTitanAuraMode() {
      if (this.phaserScene) {
        this.phaserScene.triggerHeroTitanAuraMode();
      }
    }
    triggerSoulCutscene() {
      if (this.phaserScene) {
        this.phaserScene.triggerCutscene();
      }
    }
    onEnter() {
      ScreenManager.getInstance().resetDungeonAfkTimer();
      ["dungeon-hero-stats-dock", "hero-aura-meter-container"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("hidden");
      });
      if (this.phaserScene) {
        this.phaserScene.updateSoulKillMeterDOM();
        this.phaserScene.updatePetSquadMeterDOM();
      }
    }
    onLeave() {
      ["dungeon-hero-stats-dock", "hero-aura-meter-container", "pet-squad-meter-container", "soul-killmeter-container"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
    }
  };

  // src/client/screens/IdleGroveScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var IdleGroveScreen = class {
    constructor() {
      __publicField(this, "updateTimer", null);
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
    }
    init() {
      window.handleClaimIdleVault = () => this.handleClaimVault();
      this.renderCampfireScene();
      const claimBtn = document.getElementById("btn-claim-idle-vault");
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
      if (this.updateTimer) return;
      this.updateTimer = setInterval(() => {
        this.updateVaultUI();
      }, 1e3);
    }
    stopVaultUIUpdate() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
    }
    updateVaultUI() {
      const vault = this.gameState.state.idleVault;
      const timeEl = document.getElementById("idle-vault-time-text");
      const expEl = document.getElementById("idle-stored-exp");
      const goldEl = document.getElementById("idle-stored-gold");
      const claimBtn = document.getElementById("btn-claim-idle-vault");
      if (timeEl) timeEl.innerText = `\u23F1\uFE0F Accumulated: ${this.gameState.getIdleVaultDurationText()}`;
      if (expEl) expEl.innerText = `+${(vault?.accumulatedExp || 0).toLocaleString()} EXP`;
      if (goldEl) goldEl.innerText = `+${(vault?.accumulatedGold || 0).toLocaleString()} \u{1FA99}`;
      if (claimBtn) {
        const now = Date.now();
        const lastClaim = vault?.lastClaimTime || 0;
        const cooldownRemaining = 5e3 - (now - lastClaim);
        if (cooldownRemaining > 0) {
          const secs = Math.ceil(cooldownRemaining / 1e3);
          claimBtn.disabled = true;
          claimBtn.innerHTML = `\u23F3 CLAIM COOLDOWN (${secs}s)`;
          claimBtn.className = "w-full py-3.5 bg-slate-800 text-slate-500 font-black text-xs rounded-2xl border border-slate-700 cursor-not-allowed opacity-60 shadow-none";
        } else {
          claimBtn.disabled = false;
          claimBtn.innerHTML = `\u{1F381} CLAIM STORAGE VAULT`;
          claimBtn.className = "w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-xs font-black text-white rounded-2xl shadow-2xl border border-emerald-300 animate-pulse transition hover:scale-105 cursor-pointer";
        }
      }
    }
    handleClaimVault() {
      const res = this.gameState.claimIdleVaultStorage();
      if (res.success) {
        this.audio.playSound("levelup");
        this.ui.showToast(res.message, "success");
        this.updateVaultUI();
        this.showClaimRewardEffect(res.expGained, res.goldGained);
      } else {
        this.audio.playSound("hit");
        this.ui.showToast(res.message, "warning");
      }
    }
    showClaimRewardEffect(exp, gold) {
      const btn = document.getElementById("btn-claim-idle-vault");
      if (btn) {
        btn.classList.add("scale-105", "ring-4", "ring-amber-300", "bg-amber-400");
        setTimeout(() => {
          btn.classList.remove("scale-105", "ring-4", "ring-amber-300", "bg-amber-400");
        }, 400);
      }
      const popup = document.createElement("div");
      popup.className = "level-up-float-text";
      popup.innerHTML = `\u{1F381} +${exp.toLocaleString()} EXP & +${gold.toLocaleString()} \u{1FA99} CLAIMED! \u{1F381}`;
      popup.style.left = `${window.innerWidth / 2}px`;
      popup.style.top = `${window.innerHeight / 2 - 80}px`;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 1400);
    }
    renderCampfireScene() {
      const container = document.getElementById("idle-campfire-container");
      if (!container) return;
      const chibiHTML = this.gameState.getChibiHeroHTML("scale-90");
      container.innerHTML = `
      <div class="relative w-full flex flex-col justify-between items-center space-y-4 p-4">
        <!-- Top Camp Background: Forest Trees & Adventurer Tent -->
        <div class="flex justify-between items-center w-full z-10 px-4">
          <div class="text-5xl opacity-80 animate-pulse">\u{1F332}</div>
          <div class="flex flex-col items-center">
            <div class="text-6xl animate-pulse drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">\u26FA</div>
            <span class="text-[10px] text-emerald-400 font-extrabold uppercase mt-1">Adventurer Camp</span>
          </div>
          <div class="text-5xl opacity-80 animate-pulse">\u{1F332}</div>
        </div>

        <!-- Center Campfire with Glowing Embers -->
        <div class="flex flex-col items-center relative my-2 z-10">
          <div class="text-6xl animate-bounce drop-shadow-[0_0_30px_rgba(245,158,11,0.9)]">\u{1F525}</div>
          <div class="absolute -top-4 text-amber-300 text-sm animate-ping">\u2728</div>
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
  };

  // src/client/screens/TowerScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var TowerScreen = class {
    constructor() {
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
    }
    init() {
      this.renderTowerFloor();
    }
    onEnter() {
      this.renderTowerFloor();
    }
    getFloorBossData(floor) {
      const bossList = [
        { name: "Goblin Chieftain", icon: "\u{1F47A}", title: "Ruler of Underdepths" },
        { name: "Frost Wyrm", icon: "\u{1F409}", title: "Glacial Ice Sovereign" },
        { name: "Infernal Golem", icon: "\u{1F5FF}", title: "Molten Core Destroyer" },
        { name: "Shadow Assassin", icon: "\u{1F977}", title: "Master of Dark Blade" },
        { name: "Ancient Tower Dragon", icon: "\u{1F432}", title: "Floor 5 Supreme Overseer" },
        { name: "Vampire Lord", icon: "\u{1F9DB}\u200D\u2642\uFE0F", title: "Sanguine Night Emperor" },
        { name: "Thunder Beholder", icon: "\u{1F441}\uFE0F", title: "Storm Eye Tyrant" },
        { name: "Necromancer Lich", icon: "\u{1F9D9}\u200D\u2642\uFE0F", title: "Dread Skeleton Commander" },
        { name: "Titan Colossus", icon: "\u{1F916}", title: "Automated Siege Machine" },
        { name: "Abyssal Demon King", icon: "\u{1F47F}", title: "Floor 10 Hellfire Sovereign" },
        { name: "Celestial Phoenix", icon: "\u{1F985}", title: "Solar Flame Archon" },
        { name: "Kraken Leviathan", icon: "\u{1F419}", title: "Tidal Wave Monarch" },
        { name: "Mythic Void Overlord", icon: "\u{1F47E}", title: "Floor 13+ Supreme Realm God" }
      ];
      const idx = Math.min(floor - 1, bossList.length - 1);
      const boss = bossList[idx] || {
        name: `Floor ${floor} Celestial Titan`,
        icon: "\u{1F409}",
        title: `Guardian of Floor ${floor}`
      };
      const isBossFloor = floor % 5 === 0 || floor >= 10;
      return {
        name: boss.name,
        icon: boss.icon,
        title: boss.title,
        isBossFloor,
        borderColor: isBossFloor ? "border-amber-400" : "border-emerald-500/60",
        glowEffect: isBossFloor ? "drop-shadow-[0_0_35px_rgba(251,191,36,1)]" : "drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]"
      };
    }
    renderTowerFloor() {
      const container = document.getElementById("tower-current-floor-container");
      if (!container) return;
      const floor = this.gameState.state.towerFloor || 1;
      const keyCount = Math.min(20, this.gameState.state.towerKeys || 0);
      const cp = this.gameState.state.cp;
      const requiredCp = floor * 40 + 15;
      const hasKeys = keyCount > 0;
      const bossData = this.getFloorBossData(floor);
      let sigilDropRate = "35% EPIC Celestial Sigil Drop";
      if (floor >= 13) sigilDropRate = "90% DIVINE Dominion Sovereign / Void Sigil Drop!";
      else if (floor >= 6) sigilDropRate = "65% MYTHIC Dragon King / Raijin Seal Drop!";
      container.innerHTML = `
      <div class="glass-panel spatial-window w-full max-w-xl p-8 rounded-3xl border-2 ${bossData.borderColor} shadow-2xl text-center bg-gradient-to-b from-emerald-950/95 via-slate-950 to-black space-y-6">
        
        <!-- Floor Title Header -->
        <div class="flex items-center justify-between border-b border-emerald-800 pb-4">
          <div>
            <span class="text-xs font-black text-amber-300 uppercase tracking-widest block">TOWER OF TRIALS</span>
            <h2 class="text-3xl font-black text-white">FLOOR ${floor}</h2>
          </div>
          <div class="px-4 py-2 bg-emerald-950 rounded-2xl border border-emerald-700 text-xs font-extrabold text-emerald-300 flex items-center gap-2">
            <span>\u{1F511} Keys:</span>
            <span class="text-amber-400 text-base font-mono font-black">${keyCount} / 20</span>
          </div>
        </div>

        <!-- Dynamic Floor Guardian Boss / Monster Banner -->
        <div class="bg-emerald-900/40 p-6 rounded-2xl border border-emerald-700/60 flex flex-col items-center space-y-3">
          <div class="text-7xl ${bossData.isBossFloor ? "animate-bounce" : "animate-pulse"} ${bossData.glowEffect}">
            ${bossData.icon}
          </div>
          <div>
            <div class="text-xl font-black text-white uppercase tracking-wider">
              ${bossData.name}
            </div>
            <span class="text-xs text-emerald-400 font-extrabold block mt-0.5">
              ${bossData.title}
            </span>
          </div>
          <div class="text-xs text-amber-300 font-mono font-bold">
            Recommended CP: ${requiredCp} CP (Your CP: ${cp} CP)
          </div>
          <div class="text-[11px] text-cyan-300 font-mono bg-slate-950/80 px-4 py-1.5 rounded-xl border border-cyan-800/80">
            \u2728 Tower Reward: ${sigilDropRate}
          </div>
        </div>

        <!-- Challenge Floor Button -->
        <button id="btn-challenge-tower" class="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-sm font-black text-slate-950 rounded-2xl shadow-xl border border-emerald-300 transition active:scale-95 flex items-center justify-center gap-2 ${!hasKeys ? "opacity-50 cursor-not-allowed" : ""}">
          \u2694\uFE0F CHALLENGE FLOOR ${floor} (Uses 1 \u{1F511} Key)
        </button>
      </div>
    `;
      const btn = document.getElementById("btn-challenge-tower");
      if (btn && hasKeys) {
        btn.onclick = () => this.challengeFloor();
      }
    }
    challengeFloor() {
      if ((this.gameState.state.towerKeys || 0) <= 0) {
        this.ui.showToast("\u26A0\uFE0F No Tower Keys remaining!", "warning");
        return;
      }
      const floor = this.gameState.state.towerFloor || 1;
      const cp = this.gameState.state.cp;
      const requiredCp = floor * 40 + 15;
      const bossData = this.getFloorBossData(floor);
      this.gameState.state.towerKeys--;
      if (cp >= requiredCp) {
        this.gameState.state.towerFloor = floor + 1;
        this.gameState.state.gold += 500 + floor * 100;
        this.gameState.state.exp += 300 + floor * 50;
        const reward = this.rollUniquePowerDrop(floor);
        const porterRes = this.gameState.grantOrUpgradePorter();
        this.audio.playSound("levelup");
        this.triggerBossSlainOverlay(bossData.name, floor, reward, porterRes.item);
        this.ui.showToast(`\u{1F381} TOWER REWARD: ${reward.name} & ${porterRes.message}`, "success");
      } else {
        this.audio.playSound("hit");
        this.ui.showToast(`\u274C CHALLENGE FAILED! Defeated by ${bossData.name} (CP ${cp} < ${requiredCp}).`, "warning");
      }
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.renderTowerFloor();
    }
    triggerBossSlainOverlay(bossName, floorNum, reward, porterItem) {
      const overlay = document.getElementById("tower-slain-overlay");
      const textEl = document.getElementById("tower-slain-text");
      const subEl = document.getElementById("tower-slain-sub");
      const rewardIconEl = document.getElementById("tower-reward-icon");
      const rewardTitleEl = document.getElementById("tower-reward-title");
      const rewardDescEl = document.getElementById("tower-reward-desc");
      if (overlay && textEl && subEl) {
        textEl.innerText = `\u{1F3C6} ${bossName.toUpperCase()} SLAIN! \u{1F3C6}`;
        subEl.innerText = `FLOOR ${floorNum} CLEARED! ADVANCING TO FLOOR ${floorNum + 1}...`;
        if (reward) {
          if (rewardIconEl) rewardIconEl.innerText = porterItem ? `${reward.icon || "\u{1F451}"} ${porterItem.icon || "\u{1F392}"}` : reward.icon || "\u{1F451}";
          if (rewardTitleEl) rewardTitleEl.innerText = `${reward.name} & ${porterItem ? porterItem.name : "Tower Reward"}`;
          if (rewardDescEl) rewardDescEl.innerText = porterItem ? `+${reward.cp} CP \u2022 Porter Lvl ${porterItem.level || 1} Speed: ${((porterItem.porterSpeedMs || 2500) / 1e3).toFixed(1)}s` : `+${reward.cp} CP \u2022 Added to Loadout`;
        }
        overlay.classList.remove("hidden");
        setTimeout(() => {
          overlay.classList.add("hidden");
        }, 2500);
      }
    }
    rollUniquePowerDrop(floor) {
      const uniquePowers = [
        { id: "kensei_katana_seal", name: "Kensei's Katana Seal", rarity: "legendary", icon: "\u{1F5E1}\uFE0F", cp: 1800, effect: "+40% Samurai Dash Range & Double Katana Slash Arc", desc: "Ancient Samurai seal granting hyper-speed katana dash momentum & lethal slash range." },
        { id: "dragon_infernal_seal", name: "Dragon King's Infernal Seal", rarity: "mythic", icon: "\u{1F432}", cp: 4500, effect: "Ignites enemies with Dragonfire AOE on hit (+25% Fire ATK)", desc: "Imbues all combat attacks with scorching Dragonfire flame eruptions." },
        { id: "void_sovereign_sigil", name: "Void Sovereign Sigil", rarity: "divine", icon: "\u{1F30C}", cp: 8500, effect: "Phase shifts through enemy attacks & releases Void Shockwaves", desc: "Divine void relic that turns your movement invulnerable & releases cosmic pulses." },
        { id: "aegis_guardian_core", name: "Aegis Guardian Core", rarity: "epic", icon: "\u{1F6E1}\uFE0F", cp: 950, effect: "Grants an orbital Aegis Shield absorbing damage", desc: "Constructs an orbital crystalline shield absorbing incoming attacks." },
        { id: "phantom_reaper_mark", name: "Phantom Reaper's Mark", rarity: "legendary", icon: "\u{1FA78}", cp: 2400, effect: "20% Vampiric Lifesteal & Execution Slash on low HP targets", desc: "Harvests soul essence from foes, healing your hero on every hit." },
        { id: "raijin_thunder_seal", name: "Thunder God Raijin Seal", rarity: "mythic", icon: "\u26A1", cp: 5200, effect: "Calls down Thunderbolts on every 3rd attack strike", desc: "Summons violent Raijin thunderbolts striking surrounding monsters." },
        { id: "celestial_empress_crown", name: "Celestial Empress Crown", rarity: "divine", icon: "\u{1F451}", cp: 10500, effect: "+50% All Attributes & Starlight Nova Burst", desc: "Supreme divine crown overflowing with starlight aura & massive CP multipliers." },
        { id: "frost_wyrm_cryo_core", name: "Frost Wyrm Cryo Core", rarity: "epic", icon: "\u2744\uFE0F", cp: 1300, effect: "Slows enemy speed by 50% & freezes on critical hit", desc: "Emits a freezing glacial chill aura surrounding your hero." },
        { id: "asura_demon_mark", name: "Asura Demon Mark", rarity: "mythic", icon: "\u{1F479}", cp: 6e3, effect: "Increases Attack Speed by +60% as HP decreases", desc: "Awakens demonic berserker speed when fighting formidable dungeon bosses." },
        { id: "dominion_sovereign_emblem", name: "Dominion Sovereign Emblem", rarity: "divine", icon: "\u2600\uFE0F", cp: 15e3, effect: "+100% Critical Strike Damage & Auto-Summon Phantom Blades", desc: "Legendary sovereign crest spawning phantom blades that slice enemies automatically." }
      ];
      let candidates = uniquePowers.filter((p) => p.rarity === "epic" || p.rarity === "legendary");
      if (floor >= 13) {
        candidates = uniquePowers.filter((p) => p.rarity === "divine" || p.rarity === "mythic");
      } else if (floor >= 6) {
        candidates = uniquePowers.filter((p) => p.rarity === "mythic" || p.rarity === "legendary");
      }
      const picked = candidates[Math.floor(Math.random() * candidates.length)] || uniquePowers[0];
      const existing = this.gameState.state.inventory.find((i) => i.id.startsWith(picked.id));
      if (existing) {
        existing.count++;
        existing.level = (existing.level || 1) + 1;
        existing.cpBonus = picked.cp * existing.level;
        return { name: picked.name, icon: picked.icon, cp: existing.cpBonus, level: existing.level, effect: picked.effect };
      } else {
        const newPower = {
          id: `${picked.id}-${Date.now()}`,
          name: picked.name,
          type: "unique_power",
          rarity: picked.rarity,
          icon: picked.icon,
          cpBonus: picked.cp,
          uniquePowerEffect: picked.effect,
          level: 1,
          count: 1,
          description: picked.desc,
          isLocked: false
        };
        this.gameState.state.inventory.push(newPower);
        return { name: picked.name, icon: picked.icon, cp: picked.cp, level: 1, effect: picked.effect };
      }
    }
  };

  // src/client/screens/CharacterStatsScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var CharacterStatsScreen = class {
    constructor() {
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
    }
    init() {
      ["str", "int", "agi", "vit"].forEach((stat) => {
        const btn = document.querySelector(`button[onclick="addStatPoint('${stat}')"]`);
        if (btn) {
          btn.onclick = (e) => {
            e.preventDefault();
            this.allocate(stat);
          };
        }
      });
      const genderMale = document.getElementById("btn-gender-male");
      const genderFemale = document.getElementById("btn-gender-female");
      if (genderMale) {
        genderMale.onclick = () => this.setGender("MALE");
      }
      if (genderFemale) {
        genderFemale.onclick = () => this.setGender("FEMALE");
      }
      window.toggleAutoStatAllocation = () => this.toggleAutoStatAllocation();
    }
    toggleAutoStatAllocation() {
      this.gameState.state.isAutoAllocateStats = !this.gameState.state.isAutoAllocateStats;
      this.audio.playSound("click");
      if (this.gameState.state.isAutoAllocateStats) {
        this.gameState.autoAllocateStatPoints();
        this.ui.showToast("\u26A1 AUTO STAT ALLOCATION ACTIVATED!", "success");
      } else {
        this.ui.showToast("\u26A1 Auto Stat Allocation turned OFF.", "info");
      }
      this.gameState.notify();
      this.gameState.saveToFirebase();
    }
    onEnter() {
      this.gameState.notify();
    }
    setGender(gender) {
      this.gameState.state.gender = gender;
      this.audio.playSound("click");
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.ui.showToast(`Updated Character Gender: ${gender}!`, "success");
    }
    allocate(stat) {
      if (this.gameState.state.statPoints <= 0) {
        this.ui.showToast("\u26A0\uFE0F No stat points available to allocate!", "warning");
        return;
      }
      const input = document.getElementById("input-stat-alloc-amount");
      const requested = Math.max(1, parseInt(input?.value || "1", 10));
      const toAllocate = Math.min(this.gameState.state.statPoints, requested);
      this.gameState.state.statPoints -= toAllocate;
      this.gameState.state[stat] += toAllocate;
      if (stat === "vit") {
        this.gameState.state.maxHp += 10 * toAllocate;
        this.gameState.state.hp = Math.min(this.gameState.state.maxHp, this.gameState.state.hp + 10 * toAllocate);
      }
      this.audio.playSound("levelup");
      this.gameState.triggerStatGlowEffect();
      this.gameState.updateCP();
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.ui.showToast(`Allocated +${toAllocate} to ${stat.toUpperCase()}!`, "success");
    }
  };

  // src/client/screens/CompanionScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var CompanionScreen = class {
    constructor() {
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
    }
    init() {
      this.renderCompanionView();
      const autoEquipBtn = document.getElementById("btn-auto-equip-pet");
      if (autoEquipBtn) {
        autoEquipBtn.onclick = () => {
          this.gameState.autoEquipBestPet();
          this.audio.playSound("levelup");
          this.ui.showToast("\u26A1 Auto-Equipped TOP 5 Companion Pet Squad!", "success");
          this.renderCompanionView();
        };
      }
    }
    onEnter() {
      this.renderCompanionView();
    }
    renderCompanionView() {
      this.renderEquippedPetCard();
      this.renderCompanionGrid();
    }
    renderEquippedPetCard() {
      const cardContainer = document.getElementById("companion-equipped-card");
      if (!cardContainer) return;
      let equippedPets = this.gameState.state.equippedPets || [];
      if (equippedPets.length === 0 && this.gameState.state.equippedPet) {
        equippedPets = [this.gameState.state.equippedPet];
        this.gameState.state.equippedPets = equippedPets;
      }
      let slotsHTML = "";
      for (let i = 0; i < 5; i++) {
        const pet = equippedPets[i];
        if (pet) {
          let atkBadge = "\u{1F43E} SLASH";
          if (pet.petAttackType === "sniper") atkBadge = "\u{1F3AF} SNIPER";
          if (pet.petAttackType === "laser") atkBadge = "\u26A1 LASER";
          if (pet.petAttackType === "mage") atkBadge = "\u{1F52E} MAGE";
          if (pet.petAttackType === "shield") atkBadge = "\u{1F6E1}\uFE0F SHIELD";
          slotsHTML += `
          <div class="glass-panel p-3 rounded-2xl border-2 border-pink-500/70 bg-gradient-to-r from-pink-950/80 to-slate-950 flex items-center justify-between shadow-xl relative group">
            <div class="flex items-center gap-3">
              <span class="text-3xl animate-bounce">${pet.icon}</span>
              <div class="text-left">
                <span class="text-xs font-black text-white block truncate max-w-[110px]">${pet.name}</span>
                <span class="text-[9px] font-extrabold text-pink-300 font-mono block">[Type: COMPANION]</span>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold border border-pink-500/40 mt-0.5 inline-block">${atkBadge}</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-[9px] text-amber-300 font-mono font-bold">+${(pet.cpBonus || 45) * (pet.level || 1)} CP</span>
              <button onclick="window.handleUnequipPet('${pet.id}')" class="text-[9px] bg-red-600/80 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg font-black shadow cursor-pointer">REMOVE</button>
            </div>
          </div>
        `;
        } else {
          slotsHTML += `
          <div class="glass-panel p-3 rounded-2xl border border-pink-900/50 bg-slate-950/60 flex items-center justify-between opacity-50">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-pink-700">\u{1F43E}</span>
              <div class="text-left">
                <span class="text-[10px] font-extrabold text-pink-400 block">SLOT ${i + 1}</span>
                <span class="text-[8px] text-slate-500 font-mono block">[Type: COMPANION]</span>
              </div>
            </div>
            <span class="text-[9px] font-bold text-slate-500 uppercase font-mono">EMPTY</span>
          </div>
        `;
        }
      }
      window.handleUnequipPet = (petId) => {
        const idx = (this.gameState.state.equippedPets || []).findIndex((p) => p.id === petId);
        if (idx >= 0) {
          this.gameState.state.equippedPets.splice(idx, 1);
          this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
          this.ui.showToast("Unequipped Companion Pet.", "info");
          this.gameState.notify();
          this.gameState.saveToFirebase();
          this.renderCompanionView();
        }
      };
      cardContainer.innerHTML = `
      <div class="w-full space-y-2.5">
        <div class="flex justify-between items-center border-b border-pink-800/60 pb-2">
          <span class="text-xs font-black text-pink-300 uppercase tracking-widest">\u{1F43E} EQUIPPED SQUAD (${equippedPets.length}/5)</span>
          <span class="text-[10px] text-amber-300 font-mono font-bold">5 Active Battle Pets</span>
        </div>
        <div class="flex flex-col gap-2.5">
          ${slotsHTML}
        </div>
      </div>
    `;
    }
    getRarityWeight(rarity) {
      if (rarity === "mythic") return 4;
      if (rarity === "legendary") return 3;
      if (rarity === "rare") return 2;
      return 1;
    }
    renderCompanionGrid() {
      const grid = document.getElementById("companion-inventory-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const pets = (this.gameState.state.inventory || []).filter((i) => i.type === "companion");
      const equippedPets = this.gameState.state.equippedPets || [];
      pets.sort((a, b) => {
        const eqA = equippedPets.some((p) => p.id === a.id) ? 1 : 0;
        const eqB = equippedPets.some((p) => p.id === b.id) ? 1 : 0;
        if (eqA !== eqB) return eqB - eqA;
        const wA = this.getRarityWeight(a.rarity);
        const wB = this.getRarityWeight(b.rarity);
        if (wA !== wB) return wB - wA;
        return (b.cpBonus || 45) * (b.level || 1) - (a.cpBonus || 45) * (a.level || 1);
      });
      if (pets.length === 0) {
        grid.innerHTML = '<div class="col-span-4 text-center text-xs text-pink-400 py-8">No Companion Pets found in inventory.</div>';
        return;
      }
      pets.forEach((pet) => {
        const isEquipped = equippedPets.some((p) => p.id === pet.id);
        const slot = document.createElement("div");
        let rarityClass = "rare";
        if (pet.rarity === "common") rarityClass = "common";
        if (pet.rarity === "legendary") rarityClass = "legendary";
        if (pet.rarity === "mythic") rarityClass = "mythic";
        let atkBadge = "\u{1F43E} SLASH";
        if (pet.petAttackType === "sniper") atkBadge = "\u{1F3AF} SNIPER";
        if (pet.petAttackType === "laser") atkBadge = "\u26A1 LASER";
        if (pet.petAttackType === "mage") atkBadge = "\u{1F52E} MAGE";
        if (pet.petAttackType === "shield") atkBadge = "\u{1F6E1}\uFE0F SHIELD";
        slot.className = `item-slot ${rarityClass} flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition hover:scale-105 relative ${isEquipped ? "ring-4 ring-pink-400 bg-pink-950/80" : ""}`;
        slot.innerHTML = `
        <span class="absolute top-1 left-1 text-[10px] z-10" onclick="event.stopPropagation(); window.toggleSingleItemLock('${pet.id}')">${pet.isLocked ? "\u{1F512}" : "\u{1F513}"}</span>
        ${isEquipped ? '<span class="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs md:text-sm font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-[0_0_12px_rgba(245,158,11,1)] z-20 leading-none">E</span>' : ""}
        <span class="text-3xl mb-1">${pet.icon}</span>
        <span class="text-xs font-black text-white truncate w-full text-center">${pet.name}</span>
        <span class="text-[8px] text-pink-300 font-mono font-bold mt-0.5">[Type: COMPANION] \u2022 ${atkBadge}</span>
        <span class="text-[9px] text-amber-300 font-mono font-bold">+${(pet.cpBonus || 45) * (pet.level || 1)} CP</span>
      `;
        slot.onclick = () => {
          this.showCompanionDetailModal(pet);
        };
        grid.appendChild(slot);
      });
    }
    showCompanionDetailModal(pet) {
      const modal = document.getElementById("modal-companion-detail");
      if (!modal) return;
      this.audio.playSound("potion");
      const iconEl = document.getElementById("pet-detail-icon");
      const nameEl = document.getElementById("pet-detail-name");
      const rarityEl = document.getElementById("pet-detail-rarity");
      const levelEl = document.getElementById("pet-detail-level");
      const attackEl = document.getElementById("pet-detail-attack");
      const cpEl = document.getElementById("pet-detail-cp");
      const storyEl = document.getElementById("pet-detail-story");
      const btnEquip = document.getElementById("btn-pet-detail-equip");
      const btnLock = document.getElementById("btn-pet-detail-lock");
      const btnSell = document.getElementById("btn-pet-detail-sell");
      const isEquipped = (this.gameState.state.equippedPets || []).some((p) => p.id === pet.id);
      if (iconEl) iconEl.innerText = pet.icon;
      if (nameEl) nameEl.innerText = `${pet.isLocked ? "\u{1F512} " : ""}${pet.name}`;
      if (rarityEl) rarityEl.innerText = pet.rarity.toUpperCase();
      if (levelEl) levelEl.innerText = `Level ${pet.level || 1}`;
      if (attackEl) attackEl.innerText = pet.petAttackType ? pet.petAttackType.toUpperCase() : "SLASH";
      if (cpEl) cpEl.innerText = `+${(pet.cpBonus || 45) * (pet.level || 1)} CP`;
      if (storyEl) storyEl.innerText = `[Type: COMPANION] ${pet.petStory || pet.description || "Loyal creature companion that attacks monsters in dungeon battles."}`;
      const totalCp = (pet.cpBonus || 45) * (pet.level || 1);
      if (iconEl) iconEl.innerText = pet.icon;
      if (nameEl) nameEl.innerText = pet.name;
      if (rarityEl) {
        rarityEl.innerText = pet.rarity.toUpperCase();
        let border = "border-gray-500 text-gray-300 bg-gray-950";
        if (pet.rarity === "rare") border = "border-blue-500 text-blue-300 bg-blue-950";
        if (pet.rarity === "epic") border = "border-cyan-500 text-cyan-300 bg-cyan-950";
        if (pet.rarity === "legendary") border = "border-amber-500 text-amber-300 bg-amber-950";
        if (pet.rarity === "mythic") border = "border-purple-400 text-purple-300 bg-purple-950 animate-pulse";
        rarityEl.className = `text-[10px] font-black px-2.5 py-0.5 rounded-full ${border} border uppercase`;
      }
      if (levelEl) levelEl.innerText = `LVL ${pet.level || 1}`;
      let atkBadge = "\u{1F43E} SLASH";
      if (pet.petAttackType === "sniper") atkBadge = "\u{1F3AF} SNIPER";
      if (pet.petAttackType === "laser") atkBadge = "\u26A1 LASER";
      if (pet.petAttackType === "mage") atkBadge = "\u{1F52E} MAGE";
      if (pet.petAttackType === "shield") atkBadge = "\u{1F6E1}\uFE0F SHIELD";
      if (attackEl) attackEl.innerText = atkBadge;
      if (cpEl) cpEl.innerText = `+${totalCp.toLocaleString()} CP`;
      if (storyEl) {
        storyEl.innerText = pet.petStory || pet.description || "A mysterious beast from ancient dungeon depths, bound by eternal loyalty.";
      }
      if (btnEquip) {
        btnEquip.innerText = isEquipped ? "REMOVE SQUAD" : "\u2694\uFE0F EQUIP SQUAD";
        btnEquip.className = isEquipped ? "py-3 bg-red-700 hover:bg-red-600 text-xs font-black text-white rounded-xl border border-red-400 shadow" : "py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-xs font-black text-white rounded-xl border border-pink-300 shadow";
        btnEquip.onclick = () => {
          if (isEquipped) {
            window.handleUnequipPet(pet.id);
          } else {
            this.gameState.equipPet(pet);
            this.audio.playSound("levelup");
            this.ui.showToast(`\u{1F43E} Equipped ${pet.name} to Pet Squad!`, "success");
          }
          modal.classList.add("hidden");
          this.renderCompanionView();
        };
      }
      if (btnLock) {
        btnLock.innerText = pet.isLocked ? "\u{1F512} LOCKED" : "\u{1F513} UNLOCKED";
        btnLock.onclick = () => {
          pet.isLocked = !pet.isLocked;
          this.audio.playSound("potion");
          this.ui.showToast(`${pet.isLocked ? "\u{1F512} Locked" : "\u{1F513} Unlocked"} ${pet.name}`, "info");
          this.gameState.notify();
          this.gameState.saveToFirebase();
          this.showCompanionDetailModal(pet);
        };
      }
      if (btnSell) {
        const sellPrice = this.gameState.getItemSellPrice(pet.rarity, pet.level || 1);
        btnSell.innerText = `\u{1FA99} SELL (${sellPrice} \u{1FA99})`;
        if (isEquipped || pet.isLocked) {
          btnSell.classList.add("opacity-50", "cursor-not-allowed");
          btnSell.onclick = () => {
            this.ui.showToast("\u26A0\uFE0F Cannot sell equipped or locked pet!", "warning");
          };
        } else {
          btnSell.classList.remove("opacity-50", "cursor-not-allowed");
          btnSell.onclick = () => {
            const idx = this.gameState.state.inventory.findIndex((i) => i.id === pet.id);
            if (idx !== -1) {
              this.gameState.state.inventory.splice(idx, 1);
              this.gameState.state.gold += sellPrice;
              this.audio.playSound("potion");
              this.ui.showToast(`\u{1F4B0} Sold ${pet.name} for +${sellPrice} \u{1FA99}!`, "success");
              this.gameState.notify();
              this.gameState.saveToFirebase();
              modal.classList.add("hidden");
              this.renderCompanionView();
            }
          };
        }
      }
      modal.classList.remove("hidden");
    }
  };

  // src/client/screens/InventoryScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var InventoryScreen = class {
    constructor() {
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
      __publicField(this, "activeFilter", "all");
      __publicField(this, "isMultiSelectMode", false);
      __publicField(this, "selectedItemIds", /* @__PURE__ */ new Set());
    }
    init() {
      this.renderInventory();
      const buyPotionBtn = document.getElementById("btn-buy-potion");
      if (buyPotionBtn) buyPotionBtn.onclick = () => this.buyPotion();
      const multiSelectBtn = document.getElementById("btn-toggle-multiselect");
      if (multiSelectBtn) {
        multiSelectBtn.onclick = () => this.toggleMultiSelectMode();
      }
      const batchSellBtn = document.getElementById("btn-execute-batch-sell");
      if (batchSellBtn) {
        batchSellBtn.onclick = () => this.executeBatchSell();
      }
      const autoEquipBtn = document.getElementById("btn-auto-equip-highest");
      if (autoEquipBtn) {
        autoEquipBtn.onclick = () => this.autoEquipHighestCP();
      }
      window.toggleEquippedSlotLock = (slotType) => {
        if (slotType === "weapon") this.gameState.state.isWeaponLocked = !this.gameState.state.isWeaponLocked;
        if (slotType === "armor") this.gameState.state.isArmorLocked = !this.gameState.state.isArmorLocked;
        if (slotType === "rune") this.gameState.state.isRuneLocked = !this.gameState.state.isRuneLocked;
        if (slotType === "skill") this.gameState.state.isSkillLocked = !this.gameState.state.isSkillLocked;
        if (slotType === "mount") this.gameState.state.isMountLocked = !this.gameState.state.isMountLocked;
        this.audio.playSound("potion");
        this.ui.showToast(`Toggled Lock for ${slotType.toUpperCase()} slot!`, "info");
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
      };
      window.autoEquipBestPetsFromUI = () => {
        const inv = this.gameState.state.inventory || [];
        const pets = inv.filter((i) => i.type === "companion");
        if (pets.length === 0) {
          this.ui.showToast("\u26A0\uFE0F No PETS found in inventory!", "warning");
          return;
        }
        pets.sort((a, b) => (b.cpBonus || 45) * (b.level || 1) - (a.cpBonus || 45) * (a.level || 1));
        this.gameState.state.equippedPets = pets.slice(0, 5);
        this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
        this.audio.playSound("levelup");
        this.ui.showToast(`\u26A1 Equipped top ${this.gameState.state.equippedPets.length} best PETS!`, "success");
        this.gameState.recalculateCP();
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
      };
      ["all", "weapon", "armor", "rune", "skill", "unique_power", "mount", "porter", "companion"].forEach((filter) => {
        const btn = document.getElementById(`inv-filter-${filter}`);
        if (btn) {
          btn.onclick = () => this.setFilter(filter);
        }
      });
    }
    onEnter() {
      this.renderInventory();
    }
    setFilter(filter) {
      this.activeFilter = filter;
      ["all", "weapon", "armor", "rune", "skill", "unique_power", "mount", "porter", "companion"].forEach((f) => {
        const btn = document.getElementById(`inv-filter-${f}`);
        if (btn) {
          if (f === filter) {
            btn.className = "px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg shadow whitespace-nowrap cursor-pointer";
          } else {
            btn.className = "px-3 py-1 bg-emerald-950/80 text-emerald-300 font-bold text-xs rounded-lg hover:bg-emerald-900 whitespace-nowrap cursor-pointer";
          }
        }
      });
      this.renderInventory();
    }
    toggleMultiSelectMode() {
      this.isMultiSelectMode = !this.isMultiSelectMode;
      this.selectedItemIds.clear();
      const btn = document.getElementById("btn-toggle-multiselect");
      const batchBar = document.getElementById("inventory-batch-sell-bar");
      if (btn) {
        if (this.isMultiSelectMode) {
          btn.className = "px-4 py-2 bg-amber-600 text-xs font-black text-white rounded-xl border border-amber-400 shadow-lg";
          if (batchBar) batchBar.classList.remove("hidden");
        } else {
          btn.className = "px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-xs font-black text-emerald-200 rounded-xl border border-emerald-600/50";
          if (batchBar) batchBar.classList.add("hidden");
        }
      }
      this.renderInventory();
    }
    getRarityWeight(rarity) {
      if (rarity === "mythic") return 4;
      if (rarity === "legendary") return 3;
      if (rarity === "rare") return 2;
      return 1;
    }
    updateEquippedSidebar() {
      const wIcon = document.getElementById("side-weapon-icon");
      const wName = document.getElementById("side-weapon-name");
      if (wIcon && wName) {
        const item = this.gameState.state.equippedWeapon;
        wIcon.innerText = item ? item.icon : "\u{1F5E1}\uFE0F";
        wName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Weapon";
      }
      const aIcon = document.getElementById("side-armor-icon");
      const aName = document.getElementById("side-armor-name");
      if (aIcon && aName) {
        const item = this.gameState.state.equippedArmor;
        aIcon.innerText = item ? item.icon : "\u{1F94B}";
        aName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Armor";
      }
      const rIcon = document.getElementById("side-rune-icon");
      const rName = document.getElementById("side-rune-name");
      if (rIcon && rName) {
        const item = this.gameState.state.equippedRune;
        rIcon.innerText = item ? item.icon : "\u{1F525}";
        rName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Rune/Aura";
      }
      const sIcon = document.getElementById("side-skill-icon");
      const sName = document.getElementById("side-skill-name");
      if (sIcon && sName) {
        const item = this.gameState.state.equippedSkill;
        sIcon.innerText = item ? item.icon : "\u26A1";
        sName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Skill";
      }
      const upIcon = document.getElementById("side-uniquepower-icon");
      const upName = document.getElementById("side-uniquepower-name");
      if (upIcon && upName) {
        const item = this.gameState.state.equippedUniquePower;
        upIcon.innerText = item ? item.icon : "\u{1F451}";
        upName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Unique Power";
      }
      const mIcon = document.getElementById("side-mount-icon");
      const mName = document.getElementById("side-mount-name");
      if (mIcon && mName) {
        const item = this.gameState.state.equippedMount;
        mIcon.innerText = item ? item.icon : "\u{1F409}";
        mName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Mount";
      }
      const pIcon = document.getElementById("side-porter-icon");
      const pName = document.getElementById("side-porter-name");
      if (pIcon && pName) {
        const item = this.gameState.state.equippedPorter;
        pIcon.innerText = item ? item.icon : "\u{1F392}";
        pName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : "No Porter";
      }
      const petContainer = document.getElementById("inv-side-pet-squad");
      if (petContainer) {
        petContainer.innerHTML = "";
        const equippedPets = this.gameState.state.equippedPets || [];
        for (let i = 0; i < 5; i++) {
          const pet = equippedPets[i];
          const slot = document.createElement("div");
          slot.className = "p-2 bg-slate-900/90 rounded-xl border border-pink-500/60 relative flex items-center justify-between gap-2 transition hover:bg-pink-950/40 cursor-pointer";
          if (pet) {
            slot.innerHTML = `
            <div class="flex items-center gap-2 overflow-hidden">
              <span class="text-xl">${pet.icon}</span>
              <div class="overflow-hidden text-left">
                <span class="text-[8px] font-extrabold text-pink-300 block uppercase font-mono">SLOT ${i + 1}</span>
                <span class="text-xs font-bold text-white truncate block">${pet.name}</span>
                <span class="text-[9px] text-amber-300 font-mono font-bold">+${(pet.cpBonus || 45) * (pet.level || 1)} CP</span>
              </div>
            </div>
            <span class="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded border border-white shadow">E</span>
          `;
            slot.onclick = () => {
              const idx = (this.gameState.state.equippedPets || []).findIndex((p) => p.id === pet.id);
              if (idx >= 0) {
                this.gameState.state.equippedPets.splice(idx, 1);
                this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
                this.ui.showToast(`Unequipped PET: ${pet.name}`, "info");
                this.gameState.notify();
                this.gameState.saveToFirebase();
                this.renderInventory();
              }
            };
          } else {
            slot.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-xl text-slate-600">\u{1F43E}</span>
              <div class="text-left">
                <span class="text-[8px] font-extrabold text-pink-400 block font-mono">SLOT ${i + 1}</span>
                <span class="text-[9px] text-slate-500 font-mono font-bold">EMPTY PET SLOT</span>
              </div>
            </div>
            <span class="text-[8px] font-bold text-slate-600 uppercase font-mono">EMPTY</span>
          `;
          }
          petContainer.appendChild(slot);
        }
      }
    }
    renderInventory() {
      this.updateEquippedSidebar();
      const grid = document.getElementById("inventory-items-grid") || document.querySelector("#view-inventory .grid-cols-4");
      if (!grid) return;
      grid.innerHTML = "";
      let items = [...this.gameState.state.inventory || []];
      items.sort((a, b) => {
        const eqA = this.isItemEquipped(a) ? 1 : 0;
        const eqB = this.isItemEquipped(b) ? 1 : 0;
        if (eqA !== eqB) return eqB - eqA;
        const wA = this.getRarityWeight(a.rarity);
        const wB = this.getRarityWeight(b.rarity);
        if (wA !== wB) return wB - wA;
        return (b.level || 1) - (a.level || 1);
      });
      if (this.activeFilter !== "all") {
        items = items.filter((i) => i.type === this.activeFilter);
      }
      if (items.length === 0) {
        grid.innerHTML = '<div class="col-span-4 text-center text-xs text-emerald-400 py-8">No items found matching filter.</div>';
        this.updateBatchSellBar();
        return;
      }
      items.forEach((item, index) => {
        const slot = document.createElement("div");
        slot.id = `inv-slot-${item.id}`;
        let rarityClass = "common";
        if (item.rarity === "rare") rarityClass = "rare";
        if (item.rarity === "legendary") rarityClass = "legendary";
        if (item.rarity === "mythic") rarityClass = "mythic";
        const isSelected = this.selectedItemIds.has(item.id);
        const isEquipped = this.gameState.state.equippedWeapon?.id === item.id || this.gameState.state.equippedArmor?.id === item.id || this.gameState.state.equippedRune?.id === item.id || this.gameState.state.equippedSkill?.id === item.id || this.gameState.state.equippedUniquePower?.id === item.id || this.gameState.state.equippedCutscene?.id === item.id || this.gameState.state.equippedMount?.id === item.id || this.gameState.state.equippedPorter?.id === item.id || this.gameState.state.equippedPets?.some((p) => p.id === item.id);
        slot.className = `item-slot ${rarityClass} flex flex-col items-center justify-center h-24 p-2 cursor-pointer transition hover:scale-105 relative ${isSelected ? "ring-4 ring-amber-400 bg-amber-950/80" : ""}`;
        slot.innerHTML = `
        <!-- SMALL CORNER LOCK ICON -->
        <span class="absolute top-1 left-1 text-[10px] z-10" onclick="event.stopPropagation(); window.toggleSingleItemLock('${item.id}')">
          ${item.isLocked ? "\u{1F512}" : "\u{1F513}"}
        </span>
        <!-- BIG 'E' BADGE FOR EQUIPPED ITEMS -->
        ${isEquipped ? '<span class="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs md:text-sm font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-[0_0_12px_rgba(245,158,11,1)] z-20 leading-none">E</span>' : ""}
        <span class="text-3xl">${item.icon}</span>
        <span class="text-[9px] font-bold text-white mt-1 text-center truncate w-full">${item.name}</span>
        ${item.level ? `<span class="text-[9px] text-amber-300 font-mono">Lvl ${item.level}</span>` : ""}
        ${this.isMultiSelectMode && isSelected ? '<span class="absolute bottom-1 right-1 bg-amber-400 text-slate-950 text-xs px-1 rounded font-black">\u2611\uFE0F</span>' : ""}
        ${!this.isMultiSelectMode && item.count > 1 ? `<span class="absolute bottom-1 right-1 bg-emerald-950/90 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">x${item.count}</span>` : ""}
      `;
        slot.onclick = () => {
          if (this.isMultiSelectMode) {
            if (this.selectedItemIds.has(item.id)) this.selectedItemIds.delete(item.id);
            else this.selectedItemIds.add(item.id);
            this.renderInventory();
            this.updateBatchSellBar();
          } else {
            this.showItemDetailModal(item, index);
          }
        };
        grid.appendChild(slot);
      });
      window.toggleSingleItemLock = (itemId) => {
        const item = this.gameState.state.inventory.find((i) => i.id === itemId);
        if (item) {
          item.isLocked = !item.isLocked;
          this.audio.playSound("potion");
          this.ui.showToast(`Item ${item.name} is now ${item.isLocked ? "LOCKED \u{1F512}" : "UNLOCKED \u{1F513}"}!`, "info");
          this.gameState.notify();
          this.gameState.saveToFirebase();
          this.renderInventory();
        }
      };
      this.updateBatchSellBar();
    }
    updateBatchSellBar() {
      const textEl = document.getElementById("batch-sell-text");
      if (!textEl) return;
      let totalGold = 0;
      this.selectedItemIds.forEach((id) => {
        const item = this.gameState.state.inventory.find((i) => i.id === id);
        if (item && !item.isLocked) {
          totalGold += this.gameState.getItemSellPrice(item.rarity, item.level || 1) * item.count;
        }
      });
      textEl.innerText = `${this.selectedItemIds.size} Items Selected (+${totalGold.toLocaleString()} \u{1FA99})`;
    }
    executeBatchSell() {
      if (this.selectedItemIds.size === 0) {
        this.ui.showToast("\u26A0\uFE0F No items selected to sell!", "warning");
        return;
      }
      let totalGoldGained = 0;
      this.selectedItemIds.forEach((id) => {
        const item = this.gameState.state.inventory.find((i) => i.id === id);
        if (item && !item.isLocked) {
          const slotEl = document.getElementById(`inv-slot-${item.id}`);
          if (slotEl) slotEl.className += " animate-shatter";
          totalGoldGained += this.gameState.getItemSellPrice(item.rarity, item.level || 1) * item.count;
          if (this.gameState.state.equippedWeapon?.id === item.id) this.gameState.state.equippedWeapon = null;
          if (this.gameState.state.equippedArmor?.id === item.id) this.gameState.state.equippedArmor = null;
          if (this.gameState.state.equippedRune?.id === item.id) this.gameState.state.equippedRune = null;
          if (this.gameState.state.equippedSkill?.id === item.id) this.gameState.state.equippedSkill = null;
        }
      });
      setTimeout(() => {
        this.gameState.state.inventory = this.gameState.state.inventory.filter((i) => !(this.selectedItemIds.has(i.id) && !i.isLocked));
        this.gameState.state.gold += totalGoldGained;
        this.audio.playSound("potion");
        this.ui.showToast(`\u{1F4B0} Sold selected unlocked items for +${totalGoldGained.toLocaleString()} \u{1FA99}!`, "success");
        this.selectedItemIds.clear();
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
      }, 300);
    }
    isItemEquipped(item) {
      if (this.gameState.state.equippedWeapon?.id === item.id) return true;
      if (this.gameState.state.equippedArmor?.id === item.id) return true;
      if (this.gameState.state.equippedRune?.id === item.id) return true;
      if (this.gameState.state.equippedSkill?.id === item.id) return true;
      if (this.gameState.state.equippedUniquePower?.id === item.id) return true;
      if (this.gameState.state.equippedCutscene?.id === item.id) return true;
      if (this.gameState.state.equippedMount?.id === item.id) return true;
      if (this.gameState.state.equippedPets && this.gameState.state.equippedPets.some((p) => p.id === item.id)) return true;
      return false;
    }
    showItemDetailModal(item, index) {
      const modal = document.getElementById("modal-item-detail");
      if (!modal) return;
      const iconEl = document.getElementById("item-detail-icon");
      const titleEl = document.getElementById("item-detail-title");
      const rarityEl = document.getElementById("item-detail-rarity");
      const typeEl = document.getElementById("detail-type");
      const levelEl = document.getElementById("detail-level");
      const cpEl = document.getElementById("detail-cp");
      const descEl = document.getElementById("item-detail-desc");
      const actionBtn = document.getElementById("btn-item-action");
      const sellBtn = document.getElementById("btn-item-sell");
      if (iconEl) iconEl.innerText = item.icon;
      if (titleEl) titleEl.innerText = `${item.isLocked ? "\u{1F512} " : ""}${item.name}`;
      if (rarityEl) {
        rarityEl.innerText = item.rarity.toUpperCase();
        rarityEl.className = `inline-block px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider mb-4 ${item.rarity === "mythic" ? "bg-purple-900 text-purple-200" : item.rarity === "legendary" ? "bg-amber-900 text-amber-200" : item.rarity === "rare" ? "bg-blue-900 text-blue-200" : "bg-gray-800 text-gray-200"}`;
      }
      if (typeEl) typeEl.innerText = item.type.toUpperCase();
      if (levelEl) levelEl.innerText = `Level ${item.level || 1}`;
      if (cpEl) cpEl.innerText = `+${(item.cpBonus || 25) * (item.level || 1)} CP`;
      if (descEl) {
        if (item.type === "porter") {
          const speedSec = ((item.porterSpeedMs || 2500) / 1e3).toFixed(1);
          descEl.innerHTML = `
          <div class="space-y-2 text-left">
            <p><span class="font-bold text-amber-300">\u26A1 Collection Speed:</span> ${speedSec}s per pickup</p>
            <p><span class="font-bold text-emerald-300">\u{1F9F2} Magnet Radius:</span> ${item.porterRadiusPx || 140}px</p>
            <p class="text-xs italic text-slate-300 mt-2 bg-slate-900/90 p-3 rounded-xl border border-emerald-800">${item.porterLore || item.description || ""}</p>
          </div>
        `;
        } else {
          descEl.innerText = `[Type: ${item.type.toUpperCase()}] ${item.description || `Special ${item.type} for hero progression.`}`;
        }
      }
      const goldPrice = this.gameState.getItemSellPrice(item.rarity, item.level || 1);
      if (sellBtn) {
        if (item.isLocked) {
          sellBtn.innerText = "LOCKED (Cannot Sell)";
          sellBtn.className = "w-full py-2.5 bg-gray-800 text-gray-400 text-xs font-black rounded-xl cursor-not-allowed";
          sellBtn.onclick = null;
        } else {
          sellBtn.innerText = `SELL (${goldPrice} \u{1FA99})`;
          sellBtn.className = "w-full py-2.5 bg-red-600 hover:bg-red-500 text-xs font-black text-white rounded-xl shadow-lg";
          sellBtn.onclick = () => {
            modal.classList.add("hidden");
            this.sellSingleItem(item, index);
          };
        }
      }
      const isEquipped = this.isItemEquipped(item);
      if (actionBtn) {
        if (["weapon", "armor", "rune", "skill", "unique_power", "companion", "cutscene", "mount", "porter"].includes(item.type)) {
          if (isEquipped) {
            actionBtn.innerText = item.type === "mount" ? "\u274C UNEQUIP MOUNT" : item.type === "porter" ? "\u274C UNEQUIP PORTER" : item.type === "companion" ? "\u274C UNEQUIP PET" : "\u274C UNEQUIP ITEM";
            actionBtn.className = "w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-black text-white rounded-xl shadow-lg cursor-pointer";
            actionBtn.onclick = () => {
              modal.classList.add("hidden");
              this.unequipItem(item);
            };
          } else {
            actionBtn.innerText = item.type === "mount" ? "\u26A1 EQUIP MOUNT" : item.type === "porter" ? "\u26A1 EQUIP PORTER" : item.type === "companion" ? "\u26A1 EQUIP PET" : "\u26A1 EQUIP ITEM";
            actionBtn.className = "w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white rounded-xl shadow-lg cursor-pointer";
            actionBtn.onclick = () => {
              modal.classList.add("hidden");
              this.equipItem(item);
            };
          }
        } else {
          actionBtn.innerText = "OK";
          actionBtn.onclick = () => modal.classList.add("hidden");
        }
      }
      modal.classList.remove("hidden");
      this.audio.playSound("click");
    }
    sellSingleItem(item, index) {
      if (item.isLocked) {
        this.ui.showToast("\u26A0\uFE0F Item is LOCKED! Unlock item first to sell.", "warning");
        return;
      }
      const slotEl = document.getElementById(`inv-slot-${item.id}`);
      if (slotEl) {
        slotEl.className += " animate-shatter";
      }
      setTimeout(() => {
        const goldPrice = this.gameState.getItemSellPrice(item.rarity, item.level || 1);
        this.gameState.state.gold += goldPrice;
        this.unequipItemSilent(item);
        item.count--;
        if (item.count <= 0) {
          this.gameState.state.inventory = this.gameState.state.inventory.filter((i) => i.id !== item.id);
        }
        this.audio.playSound("click");
        this.ui.showToast(`\u{1F4B0} Sold ${item.name} for +${goldPrice} \u{1FA99}!`, "success");
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
      }, 300);
    }
    unequipItemSilent(item) {
      if (this.gameState.state.equippedWeapon?.id === item.id) this.gameState.state.equippedWeapon = null;
      if (this.gameState.state.equippedArmor?.id === item.id) this.gameState.state.equippedArmor = null;
      if (this.gameState.state.equippedRune?.id === item.id) this.gameState.state.equippedRune = null;
      if (this.gameState.state.equippedSkill?.id === item.id) this.gameState.state.equippedSkill = null;
      if (this.gameState.state.equippedUniquePower?.id === item.id) this.gameState.state.equippedUniquePower = null;
      if (this.gameState.state.equippedCutscene?.id === item.id) this.gameState.state.equippedCutscene = null;
      if (this.gameState.state.equippedMount?.id === item.id) this.gameState.state.equippedMount = null;
      if (this.gameState.state.equippedPorter?.id === item.id) this.gameState.state.equippedPorter = null;
      if (this.gameState.state.equippedPets) {
        const idx = this.gameState.state.equippedPets.findIndex((p) => p.id === item.id);
        if (idx >= 0) {
          this.gameState.state.equippedPets.splice(idx, 1);
          this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
        }
      }
    }
    equipItem(item) {
      if (item.type === "weapon" && !this.gameState.state.isWeaponLocked) {
        const jobClass = this.gameState.state.jobClass || "WARRIOR";
        if (!this.gameState.isWeaponAllowedForClass(jobClass, item)) {
          this.ui.showToast(`\u26A0\uFE0F Class Restriction! ${jobClass} cannot equip ${item.name}!`, "warning");
          return;
        }
        this.gameState.state.equippedWeapon = item;
      }
      if (item.type === "armor" && !this.gameState.state.isArmorLocked) this.gameState.state.equippedArmor = item;
      if (item.type === "rune" && !this.gameState.state.isRuneLocked) this.gameState.state.equippedRune = item;
      if (item.type === "skill" && !this.gameState.state.isSkillLocked) this.gameState.state.equippedSkill = item;
      if (item.type === "unique_power" && !this.gameState.state.isUniquePowerLocked) this.gameState.state.equippedUniquePower = item;
      if (item.type === "cutscene" && !this.gameState.state.isCutsceneLocked) this.gameState.state.equippedCutscene = item;
      if (item.type === "mount" && !this.gameState.state.isMountLocked) this.gameState.state.equippedMount = item;
      if (item.type === "porter" && !this.gameState.state.isPorterLocked) this.gameState.state.equippedPorter = item;
      if (item.type === "companion" && !this.gameState.state.isPetLocked) this.gameState.equipPet(item);
      this.audio.playSound("click");
      this.ui.showToast(`\u26A1 Equipped ${item.name}!`, "success");
      this.gameState.recalculateCP();
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.renderInventory();
    }
    unequipItem(item) {
      this.unequipItemSilent(item);
      this.audio.playSound("click");
      this.ui.showToast(`\u274C Unequipped ${item.name}!`, "info");
      this.gameState.recalculateCP();
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.renderInventory();
    }
    autoEquipHighestCP() {
      const inv = this.gameState.state.inventory || [];
      if (inv.length === 0) {
        this.ui.showToast("\u26A0\uFE0F Inventory is empty!", "warning");
        return;
      }
      const jobClass = this.gameState.state.jobClass || "WARRIOR";
      let bestWeapon = null;
      let bestArmor = null;
      let bestRune = null;
      let bestSkill = null;
      let bestUniquePower = null;
      let bestMount = null;
      let maxWCP = -1;
      let maxACP = -1;
      let maxRCP = -1;
      let maxSCP = -1;
      let maxUPCP = -1;
      let maxMCP = -1;
      inv.forEach((item) => {
        const itemCP = (item.cpBonus || 25) * (item.level || 1);
        if (item.type === "weapon" && itemCP > maxWCP) {
          if (this.gameState.isWeaponAllowedForClass(jobClass, item)) {
            maxWCP = itemCP;
            bestWeapon = item;
          }
        } else if (item.type === "armor" && itemCP > maxACP) {
          maxACP = itemCP;
          bestArmor = item;
        } else if (item.type === "rune" && itemCP > maxRCP) {
          maxRCP = itemCP;
          bestRune = item;
        } else if (item.type === "skill" && itemCP > maxSCP) {
          maxSCP = itemCP;
          bestSkill = item;
        } else if (item.type === "unique_power" && itemCP > maxUPCP) {
          maxUPCP = itemCP;
          bestUniquePower = item;
        } else if (item.type === "mount" && itemCP > maxMCP) {
          maxMCP = itemCP;
          bestMount = item;
        }
      });
      let equippedCount = 0;
      if (bestWeapon && !this.gameState.state.isWeaponLocked) {
        this.gameState.state.equippedWeapon = bestWeapon;
        equippedCount++;
      }
      if (bestArmor && !this.gameState.state.isArmorLocked) {
        this.gameState.state.equippedArmor = bestArmor;
        equippedCount++;
      }
      if (bestRune && !this.gameState.state.isRuneLocked) {
        this.gameState.state.equippedRune = bestRune;
        equippedCount++;
      }
      if (bestSkill && !this.gameState.state.isSkillLocked) {
        this.gameState.state.equippedSkill = bestSkill;
        equippedCount++;
      }
      if (bestUniquePower && !this.gameState.state.isUniquePowerLocked) {
        this.gameState.state.equippedUniquePower = bestUniquePower;
        equippedCount++;
      }
      if (bestMount && !this.gameState.state.isMountLocked) {
        this.gameState.state.equippedMount = bestMount;
        equippedCount++;
      }
      this.gameState.autoEquipBestPorter();
      const pets = inv.filter((i) => i.type === "companion");
      if (pets.length > 0 && !this.gameState.state.isPetLocked) {
        pets.sort((a, b) => (b.cpBonus || 45) * (b.level || 1) - (a.cpBonus || 45) * (a.level || 1));
        this.gameState.state.equippedPets = pets.slice(0, 5);
        this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
        equippedCount += this.gameState.state.equippedPets.length;
      }
      if (equippedCount > 0) {
        this.audio.playSound("levelup");
        this.ui.showToast(`\u26A1 Automatically Equipped Best Gear & PETS (${equippedCount} slots equipped)!`, "success");
        this.gameState.recalculateCP();
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
      } else {
        this.ui.showToast("\u26A0\uFE0F No unlocked slots or equipment/pets found to swap.", "warning");
      }
    }
    buyPotion() {
      const cost = 100;
      if (this.gameState.state.gold < cost) {
        this.ui.showAlert("INSUFFICIENT GOLD", `Not enough Gold to buy HP Potion! Required: ${cost} \u{1FA99}`, "\u{1FA99}", "warning");
        return;
      }
      this.gameState.state.gold -= cost;
      const potion = this.gameState.state.inventory.find((i) => i.type === "consumable" && i.name.includes("Potion"));
      if (potion) {
        potion.count++;
      } else {
        this.gameState.state.inventory.push({
          id: `potion-${Date.now()}`,
          name: "HP Potion",
          type: "consumable",
          rarity: "common",
          icon: "\u{1F9EA}",
          bonusHp: 30,
          cpBonus: 0,
          level: 1,
          count: 1,
          description: "Restores +30 Health Points upon consumption.",
          isLocked: false
        });
      }
      this.audio.playSound("potion");
      this.ui.showToast("Purchased 1 HP Potion for 100 \u{1FA99}!", "success");
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.renderInventory();
    }
    usePotion(item, index) {
      if (this.gameState.state.hp >= this.gameState.state.maxHp) {
        this.ui.showToast("\u26A0\uFE0F Health is already at maximum!", "warning");
        return;
      }
      this.gameState.state.hp = Math.min(this.gameState.state.maxHp, this.gameState.state.hp + 30);
      this.audio.playSound("potion");
      if (item) {
        item.count--;
        if (item.count <= 0) {
          this.gameState.state.inventory = this.gameState.state.inventory.filter((i) => i.id !== item.id);
        }
      }
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.ui.showToast("Drank HP Potion (+30 HP)!", "success");
      this.renderInventory();
    }
  };

  // src/client/screens/GachaScreen.ts
  init_GameStateService();
  init_AudioService();
  init_UIService();
  var GachaScreen = class {
    constructor() {
      __publicField(this, "gameState", GameStateService.getInstance());
      __publicField(this, "audio", AudioService.getInstance());
      __publicField(this, "ui", UIService.getInstance());
      __publicField(this, "warriorPool", [
        { name: "Asura Blade of Eternity", type: "weapon", rarity: "mythic", icon: "\u26A1", bonusPower: 120, cpBonus: 150, classRequirement: "WARRIOR", description: "A legendary sword forged in celestial thunder." },
        { name: "Dragon Slayer Longsword", type: "weapon", rarity: "legendary", icon: "\u2694\uFE0F", bonusPower: 75, cpBonus: 90, classRequirement: "WARRIOR", description: "Heavy greatsword built to pierce dragon hide." },
        { name: "Viking Sentinel Blade", type: "weapon", rarity: "rare", icon: "\u{1F5E1}\uFE0F", bonusPower: 40, cpBonus: 45, classRequirement: "WARRIOR", description: "Sturdy steel sword crafted for northern champions." }
      ]);
      __publicField(this, "magePool", [
        { name: "Archmage Void Wand", type: "weapon", rarity: "mythic", icon: "\u{1F31F}", bonusPower: 120, cpBonus: 150, classRequirement: "MAGE", description: "Wand pulsing with dark void arcane magic." },
        { name: "Astral Crystal Staff", type: "weapon", rarity: "legendary", icon: "\u{1F52E}", bonusPower: 75, cpBonus: 90, classRequirement: "MAGE", description: "Great staff infused with starlight power." },
        { name: "Apprentice Magic Wand", type: "weapon", rarity: "rare", icon: "\u{1FA84}", bonusPower: 40, cpBonus: 45, classRequirement: "MAGE", description: "Focus wand for young sorcerers." }
      ]);
      __publicField(this, "archerPool", [
        { name: "Artemis Celestial Bow", type: "weapon", rarity: "mythic", icon: "\u{1F3AF}", bonusPower: 120, cpBonus: 150, classRequirement: "ARCHER", description: "Mythic bow blessed by the goddess of the hunt." },
        { name: "Shadow Windrunner Bow", type: "weapon", rarity: "legendary", icon: "\u{1F3F9}", bonusPower: 75, cpBonus: 90, classRequirement: "ARCHER", description: "Swift bow shooting high-speed storm arrows." },
        { name: "Hunter Recurve Bow", type: "weapon", rarity: "rare", icon: "\u{1F3F9}", bonusPower: 40, cpBonus: 45, classRequirement: "ARCHER", description: "Flexible composite bow used by forest rangers." }
      ]);
      __publicField(this, "samuraiPool", [
        { name: "Celestial Void Katana", type: "weapon", rarity: "mythic", icon: "\u{1F5E1}\uFE0F", bonusPower: 125, cpBonus: 160, description: "Mythic shadow katana infused with Iaijutsu void slashes." },
        { name: "Demon Blade Masamune Katana", type: "weapon", rarity: "legendary", icon: "\u2694\uFE0F", bonusPower: 80, cpBonus: 95, description: "Cursed katana forged by legendary swordsmiths." },
        { name: "Master Muramasa Katana", type: "weapon", rarity: "rare", icon: "\u{1F5E1}\uFE0F", bonusPower: 45, cpBonus: 50, description: "Razor-sharp samurai katana built for rapid dash strikes." }
      ]);
      __publicField(this, "generalPool", [
        { name: "Celestial Aegis Shield", type: "armor", rarity: "mythic", icon: "\u{1F6E1}\uFE0F", bonusHp: 500, cpBonus: 150, description: "Divine shield providing impenetrable defense." },
        { name: "Obsidian Guard Armor", type: "armor", rarity: "legendary", icon: "\u{1F94B}", bonusHp: 300, cpBonus: 85, description: "Plate mail forged from black obsidian stone." },
        { name: "Knight Vanguard Plate", type: "armor", rarity: "epic", icon: "\u{1F6E1}\uFE0F", bonusHp: 180, cpBonus: 65, description: "Heavy iron armor worn by royal vanguard knights." },
        { name: "Titan Guardian Helm", type: "armor", rarity: "rare", icon: "\u{1FA96}", bonusHp: 90, cpBonus: 35, description: "Sturdy steel helmet crafted for heavy defenders." },
        { name: "Leather Armored Robe", type: "armor", rarity: "common", icon: "\u{1F94B}", bonusHp: 30, cpBonus: 15, description: "Basic leather body armor." }
      ]);
      __publicField(this, "activeBanner", "gear");
      __publicField(this, "skillPool", [
        { name: "Spinning Stone Rune", type: "skill", rarity: "rare", icon: "\u{1FAA8}", cpBonus: 150, skillId: "spinning_stone", description: "Orbits rotating stones around character." },
        { name: "Flaming Field Rune", type: "skill", rarity: "rare", icon: "\u{1F525}", cpBonus: 180, skillId: "flaming_field", description: "Creates burning fire aura field." },
        { name: "Acid Rain Scroll", type: "skill", rarity: "legendary", icon: "\u{1F9EA}", cpBonus: 1100, skillId: "acid_rain", description: "Summons toxic green clouds with falling acid rain." },
        { name: "Cyborg Laser Matrix", type: "skill", rarity: "legendary", icon: "\u26A1", cpBonus: 1200, skillId: "cyborg", description: "Fires cybernetic laser beam cannons." },
        { name: "Necromancer Grimoire", type: "skill", rarity: "mythic", icon: "\u{1F480}", cpBonus: 2500, skillId: "necromancer", description: "Summons undead skeleton minions." }
      ]);
      __publicField(this, "petPool", [
        // EPIC (2)
        { name: "Abyssal Leviathan Kraken", type: "companion", rarity: "epic", icon: "\u{1F419}", cpBonus: 450, petAttackType: "slash", description: "Deep ocean kraken whipping corrosive tentacle strikes.", petStory: "Hatched in the abyssal ocean trench, whipping corrosive tidal waves that crush dungeon foes." },
        { name: "Mecha Cyber Sentinel", type: "companion", rarity: "epic", icon: "\u{1F916}", cpBonus: 430, petAttackType: "laser", description: "Sci-Fi robot drone firing dual plasma cannons.", petStory: "Forged in cybernetic laboratories, projecting precision laser beams that incinerate enemy lines." },
        // LEGENDARY (4)
        { name: "Thunder Spark Kitsune", type: "companion", rarity: "legendary", icon: "\u26A1", cpBonus: 1200, petAttackType: "sniper", description: "Nine-tailed celestial fox shooting lightning bolts.", petStory: "Born under sacred thunder peaks, firing high-voltage storm bolts that electrocute distant targets." },
        { name: "Frostbite Fenrir Wolf", type: "companion", rarity: "legendary", icon: "\u{1F43A}", cpBonus: 1150, petAttackType: "slash", description: "Gigantic ice wolf lunging with frozen claw strikes.", petStory: "Mythical wolf of northern glaciers, lunging with frost-bitten claw slashes that freeze foes solid." },
        { name: "Aegis Golden Gryphon", type: "companion", rarity: "legendary", icon: "\u{1F985}", cpBonus: 1100, petAttackType: "shield", description: "Holy gryphon casting golden divine shields.", petStory: "Guardian of holy sanctuaries, creating golden shockwave barriers that shield your hero squad." },
        { name: "Sunfire Golden Lion", type: "companion", rarity: "legendary", icon: "\u{1F981}", cpBonus: 1050, petAttackType: "shield", description: "Solar lion emitting roaring sunfire nova explosions.", petStory: "Wreathed in solar heat, emitting roaring sunfire novas that incinerate all nearby enemies." },
        // MYTHIC (4)
        { name: "Celestial Void Behemoth", type: "companion", rarity: "mythic", icon: "\u{1F30C}", cpBonus: 2900, petAttackType: "mage", description: "Cosmic shadow spirit emitting pulsing void shockwaves.", petStory: "Primordial entity born from outer space voids, spawning dark violet nova explosions." },
        { name: "Crimson Flame Drake", type: "companion", rarity: "mythic", icon: "\u{1F432}", cpBonus: 2800, petAttackType: "laser", description: "Mythic crimson dragon breathing high-temp flame lasers.", petStory: "Sovereign dragon of volcanic cores, spewing continuous white-hot flame beams across dungeon waves." },
        { name: "Ancient Emerald Serpent", type: "companion", rarity: "mythic", icon: "\u{1F409}", cpBonus: 2750, petAttackType: "mage", description: "Jade serpent spirit releasing toxic poison waves.", petStory: "Sacred dragon spirit of ancient bamboo forests, releasing toxic emerald poison blasts." },
        { name: "Astral Star Unicorn", type: "companion", rarity: "mythic", icon: "\u{1F984}", cpBonus: 2600, petAttackType: "sniper", description: "Radiant celestial unicorn firing starlight ray beams.", petStory: "Celestial unicorn channeling starlight energy, piercing monster hides with radiant beam rays." }
      ]);
    }
    init() {
    }
    onEnter() {
      this.switchBanner(this.activeBanner);
    }
    switchBanner(banner) {
      this.activeBanner = banner;
      this.audio.playSound("potion");
      const placeBg = document.getElementById("place-fullscreen-bg");
      if (placeBg) {
        let bgImg = "assets/murim_merchant_gacha_bg.jpg";
        if (banner === "pet") bgImg = "assets/gacha_pet_banner_bg.jpg";
        else if (banner === "skill") bgImg = "assets/gacha_skill_banner_bg.jpg";
        else if (banner === "gear") bgImg = "assets/gacha_equipment_banner_bg.jpg";
        placeBg.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.60), rgba(9, 13, 22, 0.85)), url('${bgImg}')`;
      }
      const btnGear = document.getElementById("btn-gacha-tab-gear");
      const btnPet = document.getElementById("btn-gacha-tab-pet");
      const btnSkill = document.getElementById("btn-gacha-tab-skill");
      const iconEl = document.getElementById("gacha-banner-icon");
      const titleEl = document.getElementById("gacha-banner-title");
      const descEl = document.getElementById("gacha-banner-desc");
      const singleIcon = document.getElementById("btn-icon-single");
      const multiIcon = document.getElementById("btn-icon-multi");
      const btnSingle = document.getElementById("btn-summon-single");
      const btnMulti = document.getElementById("btn-summon-multi");
      if (banner === "gear") {
        if (btnGear) btnGear.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-purple-900/40 backdrop-blur-sm border-purple-400 shadow-xl group";
        if (btnPet) btnPet.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-pink-500/40 hover:bg-pink-950/50 group";
        if (btnSkill) btnSkill.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-amber-500/40 hover:bg-amber-950/50 group";
        if (iconEl) iconEl.innerText = "\u2694\uFE0F";
        if (titleEl) titleEl.innerText = "MYSTICAL EQUIPMENT SHRINE";
        if (descEl) descEl.innerText = "Summon Mythic Asura Blades, Celestial Shields, and Super Saiyan Elemental Runes!";
        if (singleIcon) singleIcon.innerText = "\u{1F5E1}\uFE0F";
        if (multiIcon) multiIcon.innerText = "\u{1F381}";
        if (btnSingle) btnSingle.innerText = "100 \u{1FA99} Gold";
        if (btnMulti) btnMulti.innerText = "10 \u{1F48E} Gems";
      } else if (banner === "pet") {
        if (btnGear) btnGear.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-purple-500/40 hover:bg-purple-950/50 group";
        if (btnPet) btnPet.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-pink-900/40 backdrop-blur-sm border-pink-400 shadow-xl group";
        if (btnSkill) btnSkill.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-amber-500/40 hover:bg-amber-950/50 group";
        if (iconEl) iconEl.innerText = "\u{1F43E}";
        if (titleEl) titleEl.innerText = "\u{1F43E} PET COMPANION BANNER";
        if (descEl) descEl.innerText = "Summon 20 loyal Pets (Animals, Monsters, Demons, Elves, Dwarves, Mechas) with Red & Purple Gems!";
        if (singleIcon) singleIcon.innerText = "\u{1F43E}";
        if (multiIcon) multiIcon.innerText = "\u{1F409}";
        if (btnSingle) btnSingle.innerText = "100 \u{1F534} Red Gems";
        if (btnMulti) btnMulti.innerText = "10 \u{1F7E3} Purple Gems";
      } else {
        if (btnGear) btnGear.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-purple-500/40 hover:bg-purple-950/50 group";
        if (btnPet) btnPet.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-pink-500/40 hover:bg-pink-950/50 group";
        if (btnSkill) btnSkill.className = "w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-amber-900/40 backdrop-blur-sm border-amber-400 shadow-xl group";
        if (iconEl) iconEl.innerText = "\u{1F4DC}";
        if (titleEl) titleEl.innerText = "\u{1F4DC} ANCIENT SKILLS BANNER";
        if (descEl) descEl.innerText = "Summon Castable Magic & Attack Skills (Necromancer Grimoires, Acid Rain, Laser Matrix) with Skill Tomes!";
        if (singleIcon) singleIcon.innerText = "\u{1F4DC}";
        if (multiIcon) multiIcon.innerText = "\u{1F4D6}";
        if (btnSingle) btnSingle.innerText = "100 \u{1F4DC} Skill Tomes";
        if (btnMulti) btnMulti.innerText = "10 \u{1F4D6} Ancient Books";
      }
    }
    roll(count) {
      if (this.activeBanner === "pet") {
        const isMulti = count === 10;
        const redCost = 100;
        const purpleCost = 10;
        if (isMulti && (this.gameState.state.purpleGems || 0) < purpleCost) {
          this.ui.showAlert("INSUFFICIENT PURPLE GEMS", `Not enough Purple Gems for 10x Pet Summon! Required: ${purpleCost} \u{1F7E3} (Earned from Dungeon Bosses)`, "\u{1F7E3}", "warning");
          return;
        }
        if (!isMulti && (this.gameState.state.redGems || 0) < redCost) {
          this.ui.showAlert("INSUFFICIENT RED GEMS", `Not enough Red Gems for 1x Pet Summon! Required: ${redCost} \u{1F534} (Earned from Monsters)`, "\u{1F534}", "warning");
          return;
        }
        if (isMulti) this.gameState.state.purpleGems -= purpleCost;
        else this.gameState.state.redGems -= redCost;
      } else if (this.activeBanner === "skill") {
        const isMulti = count === 10;
        const tomeCost = 100;
        const bookCost = 10;
        if (isMulti && (this.gameState.state.ancientBooks || 0) < bookCost) {
          this.ui.showAlert("INSUFFICIENT ANCIENT BOOKS", `Not enough Ancient Books for 10x Skill Summon! Required: ${bookCost} \u{1F4D6} (Earned from Dungeon Bosses)`, "\u{1F4D6}", "warning");
          return;
        }
        if (!isMulti && (this.gameState.state.skillTomes || 0) < tomeCost) {
          this.ui.showAlert("INSUFFICIENT SKILL TOMES", `Not enough Skill Tomes for 1x Skill Summon! Required: ${tomeCost} \u{1F4DC} (Earned from Dungeon Monsters)`, "\u{1F4DC}", "warning");
          return;
        }
        if (isMulti) this.gameState.state.ancientBooks -= bookCost;
        else this.gameState.state.skillTomes -= tomeCost;
      } else {
        const cost = count === 10 ? 10 : 100;
        const isGems = count === 10;
        if (isGems && this.gameState.state.gems < cost) {
          this.ui.showAlert("INSUFFICIENT GEMS", `Not enough Gems for 10x Equipment Summon! Required: ${cost} \u{1F48E}`, "\u{1F48E}", "warning");
          return;
        }
        if (!isGems && this.gameState.state.gold < cost) {
          this.ui.showAlert("INSUFFICIENT GOLD", `Not enough Gold for Single Equipment Summon! Required: ${cost} \u{1FA99}`, "\u{1FA99}", "warning");
          return;
        }
        if (isGems) this.gameState.state.gems -= cost;
        else this.gameState.state.gold -= cost;
      }
      const obtained = [];
      for (let i = 0; i < count; i++) {
        obtained.push(this.drawOne());
      }
      let highestRarity = "common";
      obtained.forEach((drop) => {
        if (drop.rarity === "mythic") highestRarity = "mythic";
        else if (drop.rarity === "legendary" && highestRarity !== "mythic") highestRarity = "legendary";
        else if (drop.rarity === "epic" && !["mythic", "legendary"].includes(highestRarity)) highestRarity = "epic";
        else if (drop.rarity === "rare" && !["mythic", "legendary", "epic"].includes(highestRarity)) highestRarity = "rare";
      });
      this.audio.playSound("gacha");
      this.playSummonAnimation(highestRarity, () => {
        this.processSummonedItems(obtained);
        this.showAcquiredGridModal(obtained, count);
      });
    }
    playSummonAnimation(highestRarity, onComplete) {
      const overlay = document.createElement("div");
      overlay.className = "fixed inset-0 z-50 pointer-events-auto bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 text-center p-6";
      let rarityLabel = "\u26AA COMMON SUMMON REWARD";
      if (highestRarity === "rare") rarityLabel = "\u{1F535} RARE TREASURE!";
      else if (highestRarity === "epic") rarityLabel = "\u{1F7E3} EPIC CELESTIAL RELIC!";
      else if (highestRarity === "legendary") rarityLabel = "\u{1F7E0} LEGENDARY SOVEREIGN WEAPON!";
      else if (highestRarity === "mythic") rarityLabel = "\u{1F7E3} MYTHIC DIVINE TRANSMUTATION!";
      let bannerTitle = "\u2694\uFE0F EQUIPMENT BANNER";
      let bannerBg = "assets/gacha_equipment_banner_bg.jpg";
      if (this.activeBanner === "pet") {
        bannerTitle = "\u{1F43E} PET COMPANIONS BANNER";
        bannerBg = "assets/gacha_pet_banner_bg.jpg";
      } else if (this.activeBanner === "skill") {
        bannerTitle = "\u{1F4DC} ANCIENT SKILLS BANNER";
        bannerBg = "assets/gacha_skill_banner_bg.jpg";
      }
      overlay.innerHTML = `
      <!-- Banner-Specific Ink Wash Background -->
      <img src="${bannerBg}" alt="${bannerTitle}" class="absolute inset-0 w-full h-full object-cover filter grayscale contrast-200 brightness-90 opacity-75 animate-pulse">
      
      <!-- Speed Lines Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10"></div>

      <!-- Animated Diagonal Katana Slash Line -->
      <div class="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
        <div class="w-[140%] h-4 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 animate-pulse shadow-[0_0_50px_rgba(255,255,255,1)]"></div>
      </div>

      <!-- RAW FLOATING TYPOGRAPHY (NO WINDOW / CONTAINER BOX & NO MANHUA WORD) -->
      <div class="relative z-20 space-y-3 animate-scaleUp">
        <div class="text-xs font-black text-amber-300 uppercase tracking-widest font-mono">
          \u{1F4DC} NINE-PEAKS MARTIAL SHRINE \u2022 ${bannerTitle}
        </div>

        <h1 class="text-3xl md:text-6xl font-black text-black uppercase tracking-widest drop-shadow-[0_0_35px_rgba(255,255,255,1)]" style="font-family: 'Cinzel Decorative', 'MedievalSharp', 'Bebas Neue', serif; -webkit-text-stroke: 1.5px #ffffff;">
          \u2728 SUMMON DECREE \u2728
        </h1>

        <div class="text-sm md:text-xl font-mono font-black text-amber-200 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(245,158,11,1)]">
          ${rarityLabel}
        </div>
      </div>
    `;
      document.body.appendChild(overlay);
      this.audio.playSound("gacha");
      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
          onComplete();
        }, 300);
      }, 850);
    }
    processSummonedItems(obtained) {
      const autoSellRules = this.gameState.state.autoSell || { common: false, rare: false, legendary: false, mythic: false };
      let autoSellGoldTotal = 0;
      obtained.forEach((drop) => {
        if (autoSellRules[drop.rarity]) {
          autoSellGoldTotal += this.gameState.getItemSellPrice(drop.rarity, 1);
        } else {
          const existing = this.gameState.state.inventory.find((i) => i.name === drop.name);
          if (existing) {
            existing.count++;
            existing.level = (existing.level || 1) + 1;
            existing.cpBonus = (drop.cpBonus || 35) * existing.level;
            if (this.gameState.state.equippedPets) {
              const eqPet = this.gameState.state.equippedPets.find((p) => p.id === existing.id || p.name === existing.name);
              if (eqPet) {
                eqPet.level = existing.level;
                eqPet.cpBonus = existing.cpBonus;
              }
            }
          } else {
            this.gameState.state.inventory.push({
              id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              name: drop.name,
              type: drop.type,
              rarity: drop.rarity,
              icon: drop.icon,
              bonusHp: drop.bonusHp,
              bonusPower: drop.bonusPower,
              cpBonus: drop.cpBonus,
              petAttackType: drop.petAttackType,
              petStory: drop.petStory,
              level: 1,
              element: drop.element,
              count: 1,
              description: drop.description
            });
          }
        }
      });
      if (autoSellGoldTotal > 0) {
        this.gameState.state.gold += autoSellGoldTotal;
      }
      this.gameState.notify();
      this.gameState.saveToFirebase();
    }
    showAcquiredGridModal(items, pullCount) {
      const modal = document.getElementById("modal-gacha-acquired");
      if (!modal) return;
      const modalBox = modal.querySelector(".spatial-window");
      const bannerBadge = document.getElementById("gacha-result-banner-title");
      if (this.activeBanner === "pet") {
        if (bannerBadge) bannerBadge.innerText = "\u{1F43E} PET COMPANIONS BANNER RESULTS";
        if (modalBox) modalBox.className = "glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-pink-500/80 shadow-[0_0_60px_rgba(236,72,153,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-pink-950/95 via-slate-950 to-black";
      } else if (this.activeBanner === "skill") {
        if (bannerBadge) bannerBadge.innerText = "\u{1F4DC} ANCIENT SKILLS BANNER RESULTS";
        if (modalBox) modalBox.className = "glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(6,182,212,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-slate-950 via-indigo-950 to-black";
      } else {
        if (bannerBadge) bannerBadge.innerText = "\u2694\uFE0F EQUIPMENT BANNER RESULTS";
        if (modalBox) modalBox.className = "glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-slate-950 via-black to-slate-950";
      }
      const grid = document.getElementById("gacha-result-grid");
      if (grid) {
        grid.innerHTML = "";
        items.forEach((item) => {
          const slot = document.createElement("div");
          let rarityBorder = "border-gray-600 bg-gray-900/90";
          let rarityText = "text-gray-300";
          if (item.rarity === "rare") {
            rarityBorder = "border-blue-500 bg-blue-950/90 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
            rarityText = "text-blue-300";
          }
          if (item.rarity === "epic") {
            rarityBorder = "border-cyan-500 bg-cyan-950/90 shadow-[0_0_18px_rgba(6,182,212,0.5)]";
            rarityText = "text-cyan-300";
          }
          if (item.rarity === "legendary") {
            rarityBorder = "border-amber-400 bg-amber-950/90 shadow-[0_0_20px_rgba(245,158,11,0.6)]";
            rarityText = "text-amber-300";
          }
          if (item.rarity === "mythic") {
            rarityBorder = "border-purple-400 bg-purple-950/90 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse";
            rarityText = "text-purple-300";
          }
          let detailBadge = `+${item.cpBonus} CP`;
          if (item.type === "companion") {
            detailBadge = `\u{1F43E} ${item.petAttackType ? item.petAttackType.toUpperCase() : "PET"}`;
          } else if (item.type === "skill") {
            detailBadge = `\u{1F4DC} SKILL (${item.cpBonus} CP)`;
          } else if (item.bonusPower) {
            detailBadge = `\u2694\uFE0F +${item.bonusPower} ATK`;
          } else if (item.bonusHp) {
            detailBadge = `\u{1F6E1}\uFE0F +${item.bonusHp} HP`;
          }
          slot.className = `p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${rarityBorder} transform hover:scale-105 transition cursor-pointer`;
          slot.innerHTML = `
          <div class="text-4xl mb-1">${item.icon}</div>
          <div class="text-[10px] font-black text-white truncate w-full">${item.name}</div>
          <div class="text-[9px] font-extrabold ${rarityText} uppercase mt-0.5">${item.rarity}</div>
          <div class="text-[9px] text-amber-300 font-mono font-bold mt-0.5">${detailBadge}</div>
        `;
          slot.onclick = () => {
            this.showGachaItemPreviewModal(item);
          };
          grid.appendChild(slot);
        });
      }
      const wishAgainBtn = document.getElementById("btn-gacha-wish-again");
      if (wishAgainBtn) {
        if (this.activeBanner === "pet") wishAgainBtn.innerText = "WISH AGAIN (10x 10 \u{1F7E3})";
        else if (this.activeBanner === "skill") wishAgainBtn.innerText = "WISH AGAIN (10x 10 \u{1F4D6})";
        else wishAgainBtn.innerText = "WISH AGAIN (10x 10 \u{1F48E})";
        wishAgainBtn.onclick = () => {
          modal.classList.add("hidden");
          this.roll(10);
        };
      }
      const sellAllBtn = document.getElementById("btn-gacha-sell-all");
      if (sellAllBtn) {
        let totalSellValue = 0;
        items.forEach((i) => totalSellValue += this.gameState.getItemSellPrice(i.rarity, 1));
        sellAllBtn.innerText = `SELL ALL (+${totalSellValue} \u{1FA99})`;
        sellAllBtn.onclick = () => {
          modal.classList.add("hidden");
          items.forEach((drop) => {
            const idx = this.gameState.state.inventory.findIndex((i) => i.name === drop.name);
            if (idx !== -1) {
              this.gameState.state.inventory[idx].count--;
              if (this.gameState.state.inventory[idx].count <= 0) {
                this.gameState.state.inventory.splice(idx, 1);
              }
            }
          });
          this.gameState.state.gold += totalSellValue;
          this.audio.playSound("potion");
          this.ui.showToast(`\u{1F4B0} Sold all ${items.length} items for +${totalSellValue} \u{1FA99}!`, "success");
          this.gameState.notify();
          this.gameState.saveToFirebase();
        };
      }
      modal.classList.remove("hidden");
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto animate-scaleUp";
    }
    showGachaItemPreviewModal(item) {
      const modal = document.getElementById("modal-gacha-item-preview");
      if (!modal) return;
      this.audio.playSound("potion");
      const iconEl = document.getElementById("gacha-preview-icon");
      const nameEl = document.getElementById("gacha-preview-name");
      const rarityEl = document.getElementById("gacha-preview-rarity");
      const cpEl = document.getElementById("gacha-preview-cp");
      const descEl = document.getElementById("gacha-preview-desc");
      if (iconEl) iconEl.innerText = item.icon;
      if (nameEl) nameEl.innerText = item.name;
      if (rarityEl) {
        rarityEl.innerText = item.rarity.toUpperCase();
        let border = "border-gray-500 text-gray-300 bg-gray-950";
        if (item.rarity === "rare") border = "border-blue-500 text-blue-300 bg-blue-950";
        if (item.rarity === "epic") border = "border-cyan-500 text-cyan-300 bg-cyan-950";
        if (item.rarity === "legendary") border = "border-amber-500 text-amber-300 bg-amber-950";
        if (item.rarity === "mythic") border = "border-purple-400 text-purple-300 bg-purple-950 animate-pulse";
        rarityEl.className = `text-[10px] font-black px-2.5 py-0.5 rounded-full ${border} border uppercase`;
      }
      if (cpEl) cpEl.innerText = `+${(item.cpBonus || 35).toLocaleString()} CP`;
      if (descEl) descEl.innerText = `[Type: ${item.type.toUpperCase()}] ${item.petStory || item.description || "Summoned from the celestial gacha shrine."}`;
      modal.classList.remove("hidden");
    }
    drawOne() {
      let fullPool = [];
      if (this.activeBanner === "pet") {
        fullPool = this.petPool;
      } else if (this.activeBanner === "skill") {
        fullPool = this.skillPool;
      } else {
        const jobClass = this.gameState.state.jobClass || "WARRIOR";
        let classWeapons = this.warriorPool;
        if (jobClass === "MAGE") classWeapons = this.magePool;
        if (jobClass === "ARCHER") classWeapons = this.archerPool;
        if (jobClass === "SAMURAI") classWeapons = this.samuraiPool;
        fullPool = [...classWeapons, ...this.generalPool];
      }
      const rand = Math.random() * 100;
      let targetRarity = "common";
      if (rand < 5) targetRarity = "mythic";
      else if (rand < 20) targetRarity = "legendary";
      else if (rand < 45) targetRarity = "epic";
      else if (rand < 75) targetRarity = "rare";
      const candidates = fullPool.filter((p) => p.rarity === targetRarity);
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      return fullPool[Math.floor(Math.random() * fullPool.length)];
    }
    collectWithBagShakeEffect() {
      const modal = document.getElementById("modal-gacha-acquired");
      const grid = document.getElementById("gacha-result-grid");
      if (!modal || !grid) return;
      this.audio.playSound("levelup");
      const bagOverlay = document.createElement("div");
      bagOverlay.className = "absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-50 animate-scaleUp";
      bagOverlay.innerHTML = `
      <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-400 bg-gradient-to-b from-amber-900 via-amber-950 to-black flex items-center justify-center text-6xl md:text-7xl shadow-[0_0_80px_rgba(245,158,11,1)] animate-pulse relative">
        <span class="animate-bounce">\u{1F392}</span>
        <div class="absolute -inset-2 rounded-full border-2 border-amber-300/40 animate-ping"></div>
      </div>
      <div class="text-xs font-black text-amber-300 uppercase tracking-widest bg-black/90 px-4 py-1.5 rounded-full border border-amber-500/60 mt-3 shadow-xl">
        \u2728 COLLECTING ALL ITEMS INTO BAG \u2728
      </div>
    `;
      grid.style.position = "relative";
      grid.appendChild(bagOverlay);
      const cardSlots = Array.from(grid.children).filter((child) => child !== bagOverlay);
      cardSlots.forEach((card) => {
        card.style.animation = "bagShake 0.12s infinite alternate ease-in-out";
      });
      let styleTag = document.getElementById("bag-shake-keyframes");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "bag-shake-keyframes";
        styleTag.innerHTML = `
        @keyframes bagShake {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(-4px, 3px) rotate(-3deg) scale(1.02); }
          50% { transform: translate(4px, -3px) rotate(3deg) scale(0.98); }
          75% { transform: translate(-3px, -2px) rotate(-2deg) scale(1.01); }
          100% { transform: translate(3px, 2px) rotate(2deg) scale(1); }
        }
      `;
        document.head.appendChild(styleTag);
      }
      setTimeout(() => {
        cardSlots.forEach((card) => {
          card.style.transition = "all 0.35s ease-in-out";
          card.style.transform = "scale(0) opacity(0)";
          card.style.opacity = "0";
        });
      }, 450);
      setTimeout(() => {
        bagOverlay.remove();
        modal.classList.add("hidden");
        this.ui.showToast("\u{1F392} All items collected into Inventory!", "success");
      }, 800);
    }
  };

  // src/client/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    initializeInputLock();
    const gameState = GameStateService.getInstance();
    const audio = AudioService.getInstance();
    const screenManager = ScreenManager.getInstance();
    const authScreen = new AuthScreen((userId, hasCharacter) => {
      if (hasCharacter) {
        screenManager.showScreen("dungeon");
      } else {
        screenManager.showScreen("char-create");
      }
    });
    const charCreateScreen = new CharacterCreateScreen(() => {
      screenManager.showScreen("dungeon");
    });
    const dungeonScreen = new DungeonScreen();
    const idleGroveScreen = new IdleGroveScreen();
    const towerScreen = new TowerScreen();
    const charStatsScreen = new CharacterStatsScreen();
    const companionScreen = new CompanionScreen();
    const inventoryScreen = new InventoryScreen();
    const gachaScreen = new GachaScreen();
    screenManager.registerScreen("auth", authScreen);
    screenManager.registerScreen("char-create", charCreateScreen);
    screenManager.registerScreen("dungeon", dungeonScreen);
    screenManager.registerScreen("idle", idleGroveScreen);
    screenManager.registerScreen("tower", towerScreen);
    screenManager.registerScreen("character", charStatsScreen);
    screenManager.registerScreen("companion", companionScreen);
    screenManager.registerScreen("inventory", inventoryScreen);
    screenManager.registerScreen("gacha", gachaScreen);
    authScreen.init();
    charCreateScreen.init();
    dungeonScreen.init();
    towerScreen.init();
    charStatsScreen.init();
    companionScreen.init();
    inventoryScreen.init();
    gachaScreen.init();
    window.switchAuthTab = (tab) => authScreen.switchTab(tab);
    window.handleFirebaseDbAuth = (e) => authScreen.handleSubmit(e);
    window.toggleExploreRealmsModal = (show) => {
      const modal = document.getElementById("modal-explore-realms");
      if (!modal) return;
      if (show) modal.classList.remove("hidden");
      else modal.classList.add("hidden");
    };
    window.handleCharacterCreate = (e) => charCreateScreen.handleCreate(e);
    window.selectJobClass = (jobClass) => charCreateScreen.selectClass(jobClass);
    window.manualFloatingSaveProgress = () => {
      const gameState2 = GameStateService.getInstance();
      const ui = UIService.getInstance();
      const audio2 = AudioService.getInstance();
      gameState2.recalculateCP();
      gameState2.flushSaveToFirebase();
      gameState2.saveToLocalStorage();
      const btn = document.querySelector("#floating-save-btn-container button");
      if (btn) {
        btn.classList.add("scale-110", "ring-4", "ring-emerald-300", "shadow-[0_0_40px_rgba(16,185,129,1)]", "animate-pulse");
        setTimeout(() => {
          btn.classList.remove("scale-110", "ring-4", "ring-emerald-300", "shadow-[0_0_40px_rgba(16,185,129,1)]", "animate-pulse");
        }, 850);
      }
      audio2.playSound("levelup");
      ui.showToast("\u{1F4BE} Game Progress Saved to Firebase Realtime Database!", "success");
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
      const modal = document.getElementById("modal-gacha-item-preview");
      if (modal) {
        if (show) modal.classList.remove("hidden");
        else modal.classList.add("hidden");
      }
    };
    window.toggleCompanionDetailModal = (show) => {
      const modal = document.getElementById("modal-companion-detail");
      if (modal) {
        if (show) modal.classList.remove("hidden");
        else modal.classList.add("hidden");
      }
    };
    window.challengeTowerFloor = () => towerScreen.challengeFloor();
    window.triggerSuperPetModeFromDOM = () => {
      if (dungeonScreen) dungeonScreen.triggerSuperPetMode();
    };
    window.triggerHeroTitanAuraModeFromDOM = () => {
      if (dungeonScreen) dungeonScreen.triggerHeroTitanAuraMode();
    };
    window.triggerSoulCutscene = () => {
      if (dungeonScreen) dungeonScreen.triggerSoulCutscene();
    };
    window.handleVolumeChange = (val) => {
      const num = parseInt(val, 10);
      const audio2 = AudioService.getInstance();
      audio2.setVolume(num / 100);
      const label = document.getElementById("setting-volume-label");
      if (label) label.innerText = `${num}%`;
    };
    window.toggleDeleteAccountModal = (show) => {
      const modal = document.getElementById("modal-delete-account-confirm");
      if (modal) {
        if (show) modal.classList.remove("hidden");
        else modal.classList.add("hidden");
      }
    };
    window.confirmPermanentDeleteUserAccount = async () => {
      const modal = document.getElementById("modal-delete-account-confirm");
      if (modal) modal.classList.add("hidden");
      const ui = UIService.getInstance();
      ui.showToast("\u{1F4A3} Deleting account data permanently...", "warning");
      const gameState2 = GameStateService.getInstance();
      await gameState2.deleteUserAccountPermanent();
    };
    window.toggleAscendWarningModal = (show) => {
      const modal = document.getElementById("modal-ascend-warning");
      if (!modal) return;
      if (show) {
        const reqLvl = gameState.getAscensionReqLevel();
        const warnReq = document.getElementById("warn-asc-req");
        if (warnReq) warnReq.innerText = reqLvl.toString();
        modal.classList.remove("hidden");
        audio.playSound("potion");
      } else {
        modal.classList.add("hidden");
      }
    };
    window.confirmAscendMountainPeak = () => {
      const modal = document.getElementById("modal-ascend-warning");
      if (modal) modal.classList.add("hidden");
      const result = gameState.performAscension();
      if (!result.success) {
        UIService.getInstance().showToast(result.message, "warning");
        return;
      }
      const reinOverlay = document.getElementById("reincarnate-overlay");
      const reinSubText = document.getElementById("rein-sub-text");
      if (reinOverlay) {
        const reinLvl = gameState.state.ascensionLevel || 1;
        const boostPct = reinLvl * 5;
        if (reinSubText) reinSubText.innerText = `REIN ${reinLvl} (+${boostPct}% STACKING EXP, GOLD & CURRENCY GAINS)`;
        reinOverlay.classList.remove("hidden");
        audio.playSound("levelup");
        setTimeout(() => {
          reinOverlay.classList.add("hidden");
          screenManager.showScreen("dungeon");
          UIService.getInstance().showToast(`\u2728 GOLD REINCARNATION COMPLETE (REIN ${reinLvl})! Teleported to Dungeon Lvl 1!`, "success");
        }, 3e3);
      }
    };
    let prologueScrollInterval = null;
    window.showPrologueScrollModal = () => {
      const overlay = document.getElementById("cinematic-prologue-overlay");
      const textBlock = document.getElementById("prologue-text-block");
      const storyScroll = document.getElementById("prologue-story-scroll");
      const titleReveal = document.getElementById("prologue-title-reveal");
      if (!overlay || !textBlock || !storyScroll || !titleReveal) return;
      overlay.classList.remove("hidden");
      overlay.style.opacity = "1";
      textBlock.classList.remove("hidden");
      textBlock.style.opacity = "1";
      titleReveal.classList.add("hidden");
      titleReveal.style.opacity = "0";
      titleReveal.style.transform = "scale(0.5)";
      storyScroll.scrollTop = 0;
      audio.playSound("levelup");
      if (prologueScrollInterval) clearInterval(prologueScrollInterval);
      let isEndingTriggered = false;
      prologueScrollInterval = setInterval(() => {
        if (storyScroll) {
          storyScroll.scrollTop += 1.4;
          if (!isEndingTriggered && storyScroll.scrollTop + storyScroll.clientHeight >= storyScroll.scrollHeight - 15) {
            isEndingTriggered = true;
            clearInterval(prologueScrollInterval);
            prologueScrollInterval = null;
            textBlock.style.opacity = "0";
            setTimeout(() => {
              textBlock.classList.add("hidden");
              titleReveal.classList.remove("hidden");
              setTimeout(() => {
                titleReveal.style.opacity = "1";
                titleReveal.style.transform = "scale(1.0)";
                audio.playSound("levelup");
              }, 50);
              setTimeout(() => {
                titleReveal.style.opacity = "0";
                titleReveal.style.transform = "scale(1.2)";
                setTimeout(() => {
                  overlay.style.opacity = "0";
                  setTimeout(() => {
                    overlay.classList.add("hidden");
                    screenManager.showScreen("dungeon");
                    window.toggleGameCreditsModal(true);
                  }, 700);
                }, 800);
              }, 3200);
            }, 1e3);
          }
        }
      }, 30);
    };
    window.skipCinematicPrologue = () => {
      if (prologueScrollInterval) {
        clearInterval(prologueScrollInterval);
        prologueScrollInterval = null;
      }
      const overlay = document.getElementById("cinematic-prologue-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.classList.add("hidden");
          screenManager.showScreen("dungeon");
          window.toggleGameCreditsModal(true);
        }, 300);
      }
    };
    window.toggleGameCreditsModal = (show) => {
      const modal = document.getElementById("modal-game-credits");
      if (!modal) return;
      if (show) {
        modal.classList.remove("hidden");
        audio.playSound("levelup");
      } else {
        modal.classList.add("hidden");
      }
    };
    window.toggleAutoSellSettings = (show) => {
      const modal = document.getElementById("modal-autosell-settings");
      if (!modal) return;
      if (show) {
        modal.classList.remove("hidden");
        audio.playSound("potion");
        window.updateAutoSellBadges();
      } else {
        modal.classList.add("hidden");
      }
    };
    window.toggleAccountSettingsModal = (show) => {
      const modal = document.getElementById("modal-account-settings");
      if (!modal) return;
      if (show) {
        modal.classList.remove("hidden");
        audio.playSound("potion");
      } else {
        modal.classList.add("hidden");
      }
    };
    window.handleChangeHeroName = () => {
      const input = document.getElementById("setting-new-name");
      if (!input || !input.value.trim()) return;
      const newName = input.value.trim();
      gameState.state.name = newName;
      gameState.notify();
      gameState.saveToFirebase();
      input.value = "";
      audio.playSound("levelup");
      UIService.getInstance().showToast(`Hero name updated to: ${newName}!`, "success");
    };
    window.handleChangePassword = () => {
      const input = document.getElementById("setting-new-password");
      if (!input || input.value.length < 4) return;
      const newPass = input.value;
      const userId = gameState.getUserId();
      if (userId && window.FirebaseApp) {
        const { db, ref, update } = window.FirebaseApp;
        update(ref(db, `users/${userId}`), { password: newPass });
        input.value = "";
        audio.playSound("levelup");
        UIService.getInstance().showToast("\u{1F512} Password updated successfully!", "success");
      }
    };
    window.updateAutoSellBadges = () => {
      const autoSell = gameState.state.autoSell || { common: false, rare: false, legendary: false, mythic: false, keepRunes: true };
      ["common", "rare", "legendary", "mythic"].forEach((r) => {
        const badge = document.getElementById(`badge-autosell-${r}`);
        const isON = autoSell[r];
        if (badge) {
          badge.innerText = isON ? "ON \u2714\uFE0F" : "OFF";
          badge.className = isON ? "text-[10px] px-2 py-0.5 rounded font-black bg-emerald-600 text-white" : "text-[10px] px-2 py-0.5 rounded font-bold bg-gray-800 text-gray-400";
        }
      });
    };
    window.toggleRarityAutoSell = (rarity) => {
      if (!gameState.state.autoSell) gameState.state.autoSell = { common: false, rare: false, legendary: false, mythic: false, keepRunes: true };
      gameState.state.autoSell[rarity] = !gameState.state.autoSell[rarity];
      audio.playSound("potion");
      gameState.notify();
      gameState.saveToFirebase();
      window.updateAutoSellBadges();
    };
    window.toggleHeroSystemModal = (show) => {
      const modal = document.getElementById("modal-hero-system");
      if (!modal) return;
      if (show) {
        gameState.updateHeroSystemModal();
        modal.classList.remove("hidden");
        audio.playSound("potion");
      } else {
        modal.classList.add("hidden");
      }
    };
    window.handleSignOut = () => {
      const accountModal = document.getElementById("modal-account-settings");
      if (accountModal) accountModal.classList.add("hidden");
      localStorage.removeItem("minimikyu_logged_user");
      gameState.setUserId(null);
      screenManager.showScreen("auth");
      gameState.logCombat("[AUTH] Signed out of realm.");
    };
    const autoPlayBGMOnInteraction = () => {
      if (audio.isBgmActive()) {
        audio.startBGM(true);
        const btn = document.getElementById("btn-toggle-bgm");
        if (btn) {
          btn.innerHTML = `<span>\u{1F3B5} BGM: ON (I Really Want to Stay at Your House)</span>`;
          btn.className = `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]`;
        }
      }
    };
    window.addEventListener("click", autoPlayBGMOnInteraction, { once: true });
    window.addEventListener("keydown", autoPlayBGMOnInteraction, { once: true });
    window.addEventListener("touchstart", autoPlayBGMOnInteraction, { once: true });
    window.toggleBGMFromUI = () => {
      const isPlaying = audio.toggleBGM();
      const btn = document.getElementById("btn-toggle-bgm");
      if (btn) {
        btn.innerHTML = isPlaying ? `<span>\u{1F3B5} BGM: ON (I Really Want to Stay at Your House)</span>` : `<span>\u{1F3B5} BGM: OFF</span>`;
        btn.className = isPlaying ? `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]` : `px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs transition flex items-center gap-1.5 shadow`;
      }
    };
    window.setBGMVolumeFromUI = (val) => {
      audio.setVolume(parseFloat(val));
    };
    window.switchShowcaseTab = (tab) => {
      const tabs = ["classes", "gear", "pets", "auras", "modes"];
      tabs.forEach((t) => {
        const btn = document.getElementById(`showcase-tab-${t}`);
        const content = document.getElementById(`showcase-content-${t}`);
        if (btn && content) {
          if (t === tab) {
            btn.className = "px-3 py-1.5 rounded-xl text-xs font-black transition bg-emerald-600/90 text-white border border-emerald-400 whitespace-nowrap shadow-md";
            content.classList.remove("hidden");
          } else {
            btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold transition text-emerald-300 hover:text-white bg-slate-950/60 border border-emerald-900 whitespace-nowrap";
            content.classList.add("hidden");
          }
        }
      });
      if (tab === "auras") {
        window.selectAuraPreview("flame");
      }
    };
    window.quickFillAuthDemo = () => {
      const idInput = document.getElementById("auth-userid");
      const passInput = document.getElementById("auth-password");
      if (idInput && passInput) {
        idInput.value = "kyu_hero_demo";
        passInput.value = "123456";
        audio.playSound("potion");
        UIService.getInstance().showToast("\u26A1 Demo credentials filled!", "info");
      }
    };
    window.triggerDoubleSafetySave = () => {
      const audio2 = AudioService.getInstance();
      audio2.playSound("levelup");
      const overlay = document.createElement("div");
      overlay.id = "modal-double-safety-save";
      overlay.className = "fixed inset-0 z-50 pointer-events-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-500 animate-scaleUp";
      overlay.innerHTML = `
      <div id="save-phase-loading" class="flex flex-col items-center justify-center space-y-4">
        <div class="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.8)]"></div>
        <div class="text-sm font-black text-emerald-300 uppercase tracking-widest font-mono animate-pulse">
          \u{1F4BE} SAVING PROGRESS TO FIREBASE DB & LOCALSTORAGE...
        </div>
      </div>

      <div id="save-phase-complete" class="hidden flex flex-col items-center justify-center space-y-3 animate-scaleUp">
        <div class="text-6xl md:text-7xl mb-2 animate-bounce drop-shadow-[0_0_35px_rgba(16,185,129,1)]">\u{1F4BE}</div>
        <h1 class="text-3xl md:text-5xl font-black text-emerald-300 uppercase tracking-widest font-mono drop-shadow-[0_0_25px_rgba(16,185,129,0.9)]" style="font-family: 'Cinzel Decorative', 'Bebas Neue', monospace; -webkit-text-stroke: 1px #ffffff;">
          DATA SAVED SUCCESSFULLY
        </h1>
        <p class="text-xs md:text-sm font-mono font-bold text-amber-300 uppercase tracking-wider bg-emerald-950/90 px-4 py-1.5 rounded-full border border-emerald-500/80 shadow-lg">
          \u2728 DOUBLE SAFETY RECORD SYNCHRONIZED WITH FIREBASE DB
        </p>
      </div>
    `;
      document.body.appendChild(overlay);
      gameState.flushSaveToFirebase();
      gameState.saveToLocalStorage();
      setTimeout(() => {
        const loadingDiv = document.getElementById("save-phase-loading");
        const completeDiv = document.getElementById("save-phase-complete");
        if (loadingDiv && completeDiv) {
          loadingDiv.classList.add("hidden");
          completeDiv.classList.remove("hidden");
          audio2.playSound("levelup");
        }
        setTimeout(() => {
          overlay.style.opacity = "0";
          setTimeout(() => overlay.remove(), 400);
        }, 1400);
      }, 900);
    };
    let auraAnimFrame = null;
    window.selectAuraPreview = (auraType) => {
      const canvas = document.getElementById("aura-preview-canvas");
      const label = document.getElementById("aura-preview-label");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (auraAnimFrame) cancelAnimationFrame(auraAnimFrame);
      const colors = {
        flame: { label: "\u{1F525} Solar Nova", primary: "#ef4444", secondary: "#f97316" },
        frost: { label: "\u2744\uFE0F Glacial Void", primary: "#06b6d4", secondary: "#3b82f6" },
        thunder: { label: "\u26A1 Abyssal Arc", primary: "#a855f7", secondary: "#c084fc" },
        celestial: { label: "\u2728 Sovereign Starlight", primary: "#fbbf24", secondary: "#fef08a" },
        void: { label: "\u{1F30C} Netherlord Void", primary: "#8b5cf6", secondary: "#d8b4fe" },
        dragon: { label: "\u{1F409} Dragon Sovereign", primary: "#10b981", secondary: "#6ee7b7" }
      };
      const cfg = colors[auraType] || colors.flame;
      if (label) label.innerText = cfg.label;
      let angle = 0;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        angle += 0.04;
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 40);
        grad.addColorStop(0, cfg.primary);
        grad.addColorStop(0.7, cfg.secondary);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 6; i++) {
          const pAngle = angle + i * Math.PI / 3;
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
    const authCanvas = document.getElementById("auth-bg-canvas");
    if (authCanvas) {
      const ctx = authCanvas.getContext("2d");
      if (ctx) {
        let width = authCanvas.width = window.innerWidth;
        let height = authCanvas.height = window.innerHeight;
        window.addEventListener("resize", () => {
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
          particles.forEach((p) => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
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
    fetch("/api/health").then((res) => res.json()).then((data) => {
      handleServerEvents({
        isMaintenance: data.isMaintenance || false,
        announcement: data.announcement || ""
      });
    }).catch(() => {
    });
    console.log("\u{1F680} [MINIMIKYU RPG] Client Engine initialized with modular screens!");
  });
})();
