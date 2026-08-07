"use strict";
// =========================================================
// TOWER SCREEN MODULE - TOWER OF TRIALS DYNAMIC BOSS SYSTEM
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class TowerScreen {
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    constructor() { }
    init() {
        this.renderTowerFloor();
    }
    onEnter() {
        this.renderTowerFloor();
    }
    getFloorBossData(floor) {
        const bossList = [
            { name: 'Goblin Chieftain', icon: '👺', title: 'Ruler of Underdepths' },
            { name: 'Frost Wyrm', icon: '🐉', title: 'Glacial Ice Sovereign' },
            { name: 'Infernal Golem', icon: '🗿', title: 'Molten Core Destroyer' },
            { name: 'Shadow Assassin', icon: '🥷', title: 'Master of Dark Blade' },
            { name: 'Ancient Tower Dragon', icon: '🐲', title: 'Floor 5 Supreme Overseer' },
            { name: 'Vampire Lord', icon: '🧛‍♂️', title: 'Sanguine Night Emperor' },
            { name: 'Thunder Beholder', icon: '👁️', title: 'Storm Eye Tyrant' },
            { name: 'Necromancer Lich', icon: '🧙‍♂️', title: 'Dread Skeleton Commander' },
            { name: 'Titan Colossus', icon: '🤖', title: 'Automated Siege Machine' },
            { name: 'Abyssal Demon King', icon: '👿', title: 'Floor 10 Hellfire Sovereign' },
            { name: 'Celestial Phoenix', icon: '🦅', title: 'Solar Flame Archon' },
            { name: 'Kraken Leviathan', icon: '🐙', title: 'Tidal Wave Monarch' },
            { name: 'Mythic Void Overlord', icon: '👾', title: 'Floor 13+ Supreme Realm God' }
        ];
        const idx = Math.min(floor - 1, bossList.length - 1);
        const boss = bossList[idx] || {
            name: `Floor ${floor} Celestial Titan`,
            icon: '🐉',
            title: `Guardian of Floor ${floor}`
        };
        const isBossFloor = floor % 5 === 0 || floor >= 10;
        return {
            name: boss.name,
            icon: boss.icon,
            title: boss.title,
            isBossFloor,
            borderColor: isBossFloor ? 'border-amber-400' : 'border-emerald-500/60',
            glowEffect: isBossFloor ? 'drop-shadow-[0_0_35px_rgba(251,191,36,1)]' : 'drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]'
        };
    }
    renderTowerFloor() {
        const container = document.getElementById('tower-current-floor-container');
        if (!container)
            return;
        const floor = this.gameState.state.towerFloor || 1;
        const keyCount = Math.min(20, this.gameState.state.towerKeys || 0);
        const cp = this.gameState.state.cp;
        const requiredCp = floor * 40 + 15;
        const hasKeys = keyCount > 0;
        const bossData = this.getFloorBossData(floor);
        let sigilDropRate = '35% EPIC Celestial Sigil Drop';
        if (floor >= 13)
            sigilDropRate = '90% DIVINE Dominion Sovereign / Void Sigil Drop!';
        else if (floor >= 6)
            sigilDropRate = '65% MYTHIC Dragon King / Raijin Seal Drop!';
        container.innerHTML = `
      <div class="glass-panel spatial-window w-full max-w-xl p-8 rounded-3xl border-2 ${bossData.borderColor} shadow-2xl text-center bg-gradient-to-b from-emerald-950/95 via-slate-950 to-black space-y-6">
        
        <!-- Floor Title Header -->
        <div class="flex items-center justify-between border-b border-emerald-800 pb-4">
          <div>
            <span class="text-xs font-black text-amber-300 uppercase tracking-widest block">TOWER OF TRIALS</span>
            <h2 class="text-3xl font-black text-white">FLOOR ${floor}</h2>
          </div>
          <div class="px-4 py-2 bg-emerald-950 rounded-2xl border border-emerald-700 text-xs font-extrabold text-emerald-300 flex items-center gap-2">
            <span>🔑 Keys:</span>
            <span class="text-amber-400 text-base font-mono font-black">${keyCount} / 20</span>
          </div>
        </div>

        <!-- Dynamic Floor Guardian Boss / Monster Banner -->
        <div class="bg-emerald-900/40 p-6 rounded-2xl border border-emerald-700/60 flex flex-col items-center space-y-3">
          <div class="text-7xl ${bossData.isBossFloor ? 'animate-bounce' : 'animate-pulse'} ${bossData.glowEffect}">
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
            ✨ Tower Reward: ${sigilDropRate}
          </div>
        </div>

        <!-- Tower Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="btn-challenge-tower" class="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-xs sm:text-sm font-black text-slate-950 rounded-2xl shadow-xl border border-emerald-300 transition active:scale-95 flex items-center justify-center gap-2 ${!hasKeys ? 'opacity-50 cursor-not-allowed' : ''}">
            ⚔️ CHALLENGE FLOOR ${floor} (1 🔑)
          </button>

          <button id="btn-auto-challenge-tower" class="flex-1 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 text-xs sm:text-sm font-black text-slate-950 rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.8)] border-2 border-white transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-mono ${!hasKeys ? 'opacity-50 cursor-not-allowed' : ''}">
            ⚡ AUTO TOWER (${keyCount} 🔑 KEYS)
          </button>
        </div>
      </div>
    `;
        const btn = document.getElementById('btn-challenge-tower');
        if (btn && hasKeys) {
            btn.onclick = () => this.challengeFloor();
        }
        const autoBtn = document.getElementById('btn-auto-challenge-tower');
        if (autoBtn && hasKeys) {
            autoBtn.onclick = () => this.challengeAllKeysAutoTower();
        }
    }
    challengeFloor() {
        if ((this.gameState.state.towerKeys || 0) <= 0) {
            this.ui.showToast('⚠️ No Tower Keys remaining!', 'warning');
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
            // UNIQUE POWER / CELESTIAL SIGIL LOOT DROP MECHANIC
            const reward = this.rollUniquePowerDrop(floor);
            // GRANT OR UPGRADE PORTER COLLECTOR REWARD
            const porterRes = this.gameState.grantOrUpgradePorter();
            this.audio.playSound('levelup');
            this.triggerBossSlainOverlay(bossData.name, floor, reward, porterRes.item);
            this.ui.showToast(`🎁 TOWER REWARD: ${reward.name} & ${porterRes.message}`, 'success');
        }
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderTowerFloor();
    }
    challengeAllKeysAutoTower() {
        const keyCount = Math.min(20, this.gameState.state.towerKeys || 0);
        if (keyCount <= 0) {
            this.ui.showToast('⚠️ No Tower Keys remaining for Auto Tower!', 'warning');
            return;
        }
        const startFloor = this.gameState.state.towerFloor || 1;
        let currentFloor = startFloor;
        const cp = this.gameState.state.cp;
        const rewardsMap = new Map();
        let keysUsed = 0;
        for (let i = 0; i < keyCount; i++) {
            const requiredCp = currentFloor * 40 + 15;
            this.gameState.state.towerKeys--;
            keysUsed++;
            if (cp >= requiredCp) {
                this.gameState.state.gold += 500 + currentFloor * 100;
                this.gameState.state.exp += 300 + currentFloor * 50;
                const reward = this.rollUniquePowerDrop(currentFloor);
                this.gameState.grantOrUpgradePorter();
                if (reward) {
                    if (rewardsMap.has(reward.name)) {
                        rewardsMap.get(reward.name).count++;
                    }
                    else {
                        rewardsMap.set(reward.name, { name: reward.name, icon: reward.icon || '👑', count: 1 });
                    }
                }
                currentFloor++;
                this.gameState.state.towerFloor = currentFloor;
            }
            else {
                break;
            }
        }
        this.audio.playSound('levelup');
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderTowerFloor();
        const bossData = this.getFloorBossData(currentFloor - 1);
        this.triggerBossSlainOverlay(bossData.name, currentFloor - 1, { name: 'Auto Tower Clear', icon: '⚡', cp: 5000 });
        const rewardsList = Array.from(rewardsMap.values());
        this.showAutoTowerSummaryModal(rewardsList, keysUsed, startFloor, currentFloor - 1);
    }
    showAutoTowerSummaryModal(rewards, keysUsed, startFloor, endFloor) {
        const modal = document.getElementById('modal-gacha-acquired');
        if (!modal)
            return;
        const modalBox = modal.querySelector('.spatial-window');
        const bannerBadge = document.getElementById('gacha-result-banner-title');
        if (bannerBadge) {
            bannerBadge.innerText = `⚡ AUTO-TOWER SUMMARY (${keysUsed} KEYS CONSUMED)`;
            bannerBadge.className = 'text-2xl md:text-3xl font-black text-amber-300 uppercase tracking-wider mb-6 text-center';
        }
        if (modalBox) {
            modalBox.style.backgroundImage = `linear-gradient(rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url('assets/murim_tower_result_bg.jpg')`;
            modalBox.style.backgroundSize = 'cover';
            modalBox.style.backgroundPosition = 'center';
            modalBox.className = 'glass-panel spatial-window w-full max-w-6xl p-6 md:p-8 rounded-3xl border-2 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] relative text-center animate-scaleUp';
        }
        const grid = document.getElementById('gacha-result-grid');
        if (grid) {
            grid.className = 'grid grid-rows-10 grid-flow-col auto-cols-max overflow-x-auto gap-2.5 max-h-[60vh] p-4 border-2 border-amber-400/50 rounded-2xl bg-black/80 backdrop-blur-md shadow-inner text-center justify-center';
            grid.innerHTML = '';
            rewards.forEach(item => {
                const row = document.createElement('div');
                row.className = 'flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950/90 border border-emerald-400/60 shadow-md text-xs font-mono font-bold whitespace-nowrap text-center hover:scale-105 transition';
                row.innerHTML = `
          <span class="text-xl shrink-0">${item.icon}</span>
          <span class="text-white font-black truncate max-w-[200px] text-center">${item.name}</span>
          <span class="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[11px] shadow">x${item.count}</span>
        `;
                grid.appendChild(row);
            });
        }
        const wishAgainBtn = document.getElementById('btn-gacha-wish-again');
        const sellAllBtn = document.getElementById('btn-gacha-sell-all');
        if (wishAgainBtn)
            wishAgainBtn.classList.add('hidden');
        if (sellAllBtn)
            sellAllBtn.classList.add('hidden');
        const collectBtn = modal.querySelector('button[onclick*="collectGachaWithBagShakeEffect"]');
        if (collectBtn) {
            collectBtn.className = 'w-full py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm md:text-base rounded-2xl shadow-[0_0_35px_rgba(251,191,36,1)] border-2 border-white hover:scale-105 active:scale-95 transition cursor-pointer font-mono uppercase tracking-wider flex items-center justify-center gap-2 ring-4 ring-amber-400/80 animate-pulse text-center';
            collectBtn.innerText = '🎒 COLLECT ALL TOWER REWARDS';
        }
        modal.classList.remove('hidden');
        modal.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto animate-scaleUp';
    }
    triggerBossSlainOverlay(bossName, floorNum, reward, porterItem) {
        const overlay = document.getElementById('tower-slain-overlay');
        const textEl = document.getElementById('tower-slain-text');
        const subEl = document.getElementById('tower-slain-sub');
        const rewardIconEl = document.getElementById('tower-reward-icon');
        const rewardTitleEl = document.getElementById('tower-reward-title');
        const rewardDescEl = document.getElementById('tower-reward-desc');
        if (overlay && textEl && subEl) {
            textEl.innerText = `🏆 ${bossName.toUpperCase()} SLAIN! 🏆`;
            subEl.innerText = `FLOOR ${floorNum} CLEARED! ADVANCING TO FLOOR ${floorNum + 1}...`;
            if (reward) {
                if (rewardIconEl)
                    rewardIconEl.innerText = porterItem ? `${reward.icon || '👑'} ${porterItem.icon || '🎒'}` : (reward.icon || '👑');
                if (rewardTitleEl)
                    rewardTitleEl.innerText = `${reward.name} & ${porterItem ? porterItem.name : 'Tower Reward'}`;
                if (rewardDescEl)
                    rewardDescEl.innerText = porterItem ? `+${reward.cp} CP • Porter Lvl ${porterItem.level || 1} Speed: ${((porterItem.porterSpeedMs || 2500) / 1000).toFixed(1)}s` : `+${reward.cp} CP • Added to Loadout`;
            }
            overlay.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 2500);
        }
    }
    rollUniquePowerDrop(floor) {
        const uniquePowers = [
            { id: 'kensei_katana_seal', name: "Kensei's Katana Seal", rarity: 'legendary', icon: '🗡️', cp: 1800, effect: '+40% Samurai Dash Range & Double Katana Slash Arc', desc: 'Ancient Samurai seal granting hyper-speed katana dash momentum & lethal slash range.' },
            { id: 'dragon_infernal_seal', name: "Dragon King's Infernal Seal", rarity: 'mythic', icon: '🐲', cp: 4500, effect: 'Ignites enemies with Dragonfire AOE on hit (+25% Fire ATK)', desc: 'Imbues all combat attacks with scorching Dragonfire flame eruptions.' },
            { id: 'void_sovereign_sigil', name: 'Void Sovereign Sigil', rarity: 'divine', icon: '🌌', cp: 8500, effect: 'Phase shifts through enemy attacks & releases Void Shockwaves', desc: 'Divine void relic that turns your movement invulnerable & releases cosmic pulses.' },
            { id: 'aegis_guardian_core', name: 'Aegis Guardian Core', rarity: 'epic', icon: '🛡️', cp: 950, effect: 'Grants an orbital Aegis Shield absorbing damage', desc: 'Constructs an orbital crystalline shield absorbing incoming attacks.' },
            { id: 'phantom_reaper_mark', name: "Phantom Reaper's Mark", rarity: 'legendary', icon: '🩸', cp: 2400, effect: '20% Vampiric Lifesteal & Execution Slash on low HP targets', desc: 'Harvests soul essence from foes, healing your hero on every hit.' },
            { id: 'raijin_thunder_seal', name: 'Thunder God Raijin Seal', rarity: 'mythic', icon: '⚡', cp: 5200, effect: 'Calls down Thunderbolts on every 3rd attack strike', desc: 'Summons violent Raijin thunderbolts striking surrounding monsters.' },
            { id: 'celestial_empress_crown', name: 'Celestial Empress Crown', rarity: 'divine', icon: '👑', cp: 10500, effect: '+50% All Attributes & Starlight Nova Burst', desc: 'Supreme divine crown overflowing with starlight aura & massive CP multipliers.' },
            { id: 'frost_wyrm_cryo_core', name: 'Frost Wyrm Cryo Core', rarity: 'epic', icon: '❄️', cp: 1300, effect: 'Slows enemy speed by 50% & freezes on critical hit', desc: 'Emits a freezing glacial chill aura surrounding your hero.' },
            { id: 'asura_demon_mark', name: 'Asura Demon Mark', rarity: 'mythic', icon: '👹', cp: 6000, effect: 'Increases Attack Speed by +60% as HP decreases', desc: 'Awakens demonic berserker speed when fighting formidable dungeon bosses.' },
            { id: 'dominion_sovereign_emblem', name: 'Dominion Sovereign Emblem', rarity: 'divine', icon: '☀️', cp: 15000, effect: '+100% Critical Strike Damage & Auto-Summon Phantom Blades', desc: 'Legendary sovereign crest spawning phantom blades that slice enemies automatically.' }
        ];
        let candidates = uniquePowers.filter(p => p.rarity === 'epic' || p.rarity === 'legendary');
        if (floor >= 13) {
            candidates = uniquePowers.filter(p => p.rarity === 'divine' || p.rarity === 'mythic');
        }
        else if (floor >= 6) {
            candidates = uniquePowers.filter(p => p.rarity === 'mythic' || p.rarity === 'legendary');
        }
        const picked = candidates[Math.floor(Math.random() * candidates.length)] || uniquePowers[0];
        const existing = this.gameState.state.inventory.find(i => i.id.startsWith(picked.id));
        if (existing) {
            existing.count++;
            existing.level = (existing.level || 1) + 1;
            existing.cpBonus = picked.cp * existing.level;
            return { name: picked.name, icon: picked.icon, cp: existing.cpBonus, level: existing.level, effect: picked.effect };
        }
        else {
            const newPower = {
                id: `${picked.id}-${Date.now()}`,
                name: picked.name,
                type: 'unique_power',
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
}
exports.TowerScreen = TowerScreen;
