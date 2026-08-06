// =========================================================
// FUTURISTIC GREEN GACHA SHRINE MODULE - SHOOTING STAR & MULTI-WISH
// =========================================================

import { ScreenLifecycle } from './ScreenManager';
import { GameStateService, InventoryItem, RarityType, ItemType, PetAttackType } from '../services/GameStateService';
import { AudioService } from '../services/AudioService';
import { UIService } from '../services/UIService';

export interface GachaDrop {
  name: string;
  type: ItemType;
  rarity: RarityType;
  icon: string;
  bonusHp?: number;
  bonusPower?: number;
  cpBonus: number;
  element?: 'fire' | 'lightning' | 'nature';
  classRequirement?: 'WARRIOR' | 'MAGE' | 'ARCHER';
  petAttackType?: PetAttackType;
  petStory?: string;
  skillId?: string;
  description?: string;
}

export class GachaScreen implements ScreenLifecycle {
  private gameState = GameStateService.getInstance();
  private audio = AudioService.getInstance();
  private ui = UIService.getInstance();

  private warriorPool: GachaDrop[] = [
    { name: 'Asura Blade of Eternity', type: 'weapon', rarity: 'mythic', icon: '⚡', bonusPower: 120, cpBonus: 150, classRequirement: 'WARRIOR', description: 'A legendary sword forged in celestial thunder.' },
    { name: 'Dragon Slayer Longsword', type: 'weapon', rarity: 'legendary', icon: '⚔️', bonusPower: 75, cpBonus: 90, classRequirement: 'WARRIOR', description: 'Heavy greatsword built to pierce dragon hide.' },
    { name: 'Viking Sentinel Blade', type: 'weapon', rarity: 'rare', icon: '🗡️', bonusPower: 40, cpBonus: 45, classRequirement: 'WARRIOR', description: 'Sturdy steel sword crafted for northern champions.' }
  ];

  private magePool: GachaDrop[] = [
    { name: 'Archmage Void Wand', type: 'weapon', rarity: 'mythic', icon: '🌟', bonusPower: 120, cpBonus: 150, classRequirement: 'MAGE', description: 'Wand pulsing with dark void arcane magic.' },
    { name: 'Astral Crystal Staff', type: 'weapon', rarity: 'legendary', icon: '🔮', bonusPower: 75, cpBonus: 90, classRequirement: 'MAGE', description: 'Great staff infused with starlight power.' },
    { name: 'Apprentice Magic Wand', type: 'weapon', rarity: 'rare', icon: '🪄', bonusPower: 40, cpBonus: 45, classRequirement: 'MAGE', description: 'Focus wand for young sorcerers.' }
  ];

  private archerPool: GachaDrop[] = [
    { name: 'Artemis Celestial Bow', type: 'weapon', rarity: 'mythic', icon: '🎯', bonusPower: 120, cpBonus: 150, classRequirement: 'ARCHER', description: 'Mythic bow blessed by the goddess of the hunt.' },
    { name: 'Shadow Windrunner Bow', type: 'weapon', rarity: 'legendary', icon: '🏹', bonusPower: 75, cpBonus: 90, classRequirement: 'ARCHER', description: 'Swift bow shooting high-speed storm arrows.' },
    { name: 'Hunter Recurve Bow', type: 'weapon', rarity: 'rare', icon: '🏹', bonusPower: 40, cpBonus: 45, classRequirement: 'ARCHER', description: 'Flexible composite bow used by forest rangers.' }
  ];

  private samuraiPool: GachaDrop[] = [
    { name: 'Celestial Void Katana', type: 'weapon', rarity: 'mythic', icon: '🗡️', bonusPower: 125, cpBonus: 160, description: 'Mythic shadow katana infused with Iaijutsu void slashes.' },
    { name: 'Demon Blade Masamune Katana', type: 'weapon', rarity: 'legendary', icon: '⚔️', bonusPower: 80, cpBonus: 95, description: 'Cursed katana forged by legendary swordsmiths.' },
    { name: 'Master Muramasa Katana', type: 'weapon', rarity: 'rare', icon: '🗡️', bonusPower: 45, cpBonus: 50, description: 'Razor-sharp samurai katana built for rapid dash strikes.' }
  ];

  private generalPool: GachaDrop[] = [
    { name: 'Celestial Aegis Shield', type: 'armor', rarity: 'mythic', icon: '🛡️', bonusHp: 500, cpBonus: 150, description: 'Divine shield providing impenetrable defense.' },
    { name: 'Obsidian Guard Armor', type: 'armor', rarity: 'legendary', icon: '🥋', bonusHp: 300, cpBonus: 85, description: 'Plate mail forged from black obsidian stone.' },
    { name: 'Knight Vanguard Plate', type: 'armor', rarity: 'epic', icon: '🛡️', bonusHp: 180, cpBonus: 65, description: 'Heavy iron armor worn by royal vanguard knights.' },
    { name: 'Titan Guardian Helm', type: 'armor', rarity: 'rare', icon: '🪖', bonusHp: 90, cpBonus: 35, description: 'Sturdy steel helmet crafted for heavy defenders.' },
    { name: 'Leather Armored Robe', type: 'armor', rarity: 'common', icon: '🥋', bonusHp: 30, cpBonus: 15, description: 'Basic leather body armor.' }
  ];

  public autoConvertCurrenciesToWishTokens(): void {
    const state = this.gameState.state;
    let totalPulls = 0;

    // 1. Gear Shrine: 10 Gems per 10x Wish Batch
    if (state.gems >= 10) {
      const batches = Math.floor(state.gems / 10);
      state.gems -= batches * 10;
      totalPulls += batches * 10;
    }

    // 2. Pet Altar: 10 Purple Gems per 10x Wish Batch
    if ((state.purpleGems || 0) >= 10) {
      const batches = Math.floor(state.purpleGems / 10);
      state.purpleGems -= batches * 10;
      totalPulls += batches * 10;
    }

    // 3. Skill Tome Vault: 10 Ancient Books per 10x Wish Batch
    if ((state.ancientBooks || 0) >= 10) {
      const batches = Math.floor(state.ancientBooks / 10);
      state.ancientBooks -= batches * 10;
      totalPulls += batches * 10;
    }

    // 4. Gold conversion: 10,000 Gold per 10x Wish Batch
    if (state.gold >= 10000) {
      const batches = Math.floor(state.gold / 10000);
      state.gold -= batches * 10000;
      totalPulls += batches * 10;
    }

    if (totalPulls > 0) {
      const batches = Math.floor(totalPulls / 10);
      for (let i = 0; i < batches; i++) {
        this.roll(10);
      }
      this.gameState.notify();
      this.gameState.saveToFirebase();
      this.audio.playSound('gacha');
      this.ui.showToast(`⚡ AUTO-CONVERTED ALL BALANCE! Executed ${totalPulls} Wish Pulls (${batches}x 10-Wish Batches)!`, 'success');
    } else {
      this.ui.showToast('⚠️ Not enough currencies for 10x Auto-Conversion! Need 10 Gems, 10 Purple Gems, 10 Ancient Books, or 10k Gold.', 'warning');
    }
  }

  public activeBanner: 'gear' | 'pet' | 'skill' = 'gear';

  private skillPool: GachaDrop[] = [
    { name: 'Spinning Stone Rune', type: 'skill', rarity: 'rare', icon: '🪨', cpBonus: 150, skillId: 'spinning_stone', description: 'Orbits rotating stones around character.' },
    { name: 'Flaming Field Rune', type: 'skill', rarity: 'rare', icon: '🔥', cpBonus: 180, skillId: 'flaming_field', description: 'Creates burning fire aura field.' },
    { name: 'Acid Rain Scroll', type: 'skill', rarity: 'legendary', icon: '🧪', cpBonus: 1100, skillId: 'acid_rain', description: 'Summons toxic green clouds with falling acid rain.' },
    { name: 'Cyborg Laser Matrix', type: 'skill', rarity: 'legendary', icon: '⚡', cpBonus: 1200, skillId: 'cyborg', description: 'Fires cybernetic laser beam cannons.' },
    { name: 'Necromancer Grimoire', type: 'skill', rarity: 'mythic', icon: '💀', cpBonus: 2500, skillId: 'necromancer', description: 'Summons undead skeleton minions.' }
  ];

  private petPool: GachaDrop[] = [
    // EPIC (2)
    { name: 'Abyssal Leviathan Kraken', type: 'companion', rarity: 'epic', icon: '🐙', cpBonus: 450, petAttackType: 'slash', description: 'Deep ocean kraken whipping corrosive tentacle strikes.', petStory: 'Hatched in the abyssal ocean trench, whipping corrosive tidal waves that crush dungeon foes.' },
    { name: 'Mecha Cyber Sentinel', type: 'companion', rarity: 'epic', icon: '🤖', cpBonus: 430, petAttackType: 'laser', description: 'Sci-Fi robot drone firing dual plasma cannons.', petStory: 'Forged in cybernetic laboratories, projecting precision laser beams that incinerate enemy lines.' },

    // LEGENDARY (4)
    { name: 'Thunder Spark Kitsune', type: 'companion', rarity: 'legendary', icon: '⚡', cpBonus: 1200, petAttackType: 'sniper', description: 'Nine-tailed celestial fox shooting lightning bolts.', petStory: 'Born under sacred thunder peaks, firing high-voltage storm bolts that electrocute distant targets.' },
    { name: 'Frostbite Fenrir Wolf', type: 'companion', rarity: 'legendary', icon: '🐺', cpBonus: 1150, petAttackType: 'slash', description: 'Gigantic ice wolf lunging with frozen claw strikes.', petStory: 'Mythical wolf of northern glaciers, lunging with frost-bitten claw slashes that freeze foes solid.' },
    { name: 'Aegis Golden Gryphon', type: 'companion', rarity: 'legendary', icon: '🦅', cpBonus: 1100, petAttackType: 'shield', description: 'Holy gryphon casting golden divine shields.', petStory: 'Guardian of holy sanctuaries, creating golden shockwave barriers that shield your hero squad.' },
    { name: 'Sunfire Golden Lion', type: 'companion', rarity: 'legendary', icon: '🦁', cpBonus: 1050, petAttackType: 'shield', description: 'Solar lion emitting roaring sunfire nova explosions.', petStory: 'Wreathed in solar heat, emitting roaring sunfire novas that incinerate all nearby enemies.' },

    // MYTHIC (4)
    { name: 'Celestial Void Behemoth', type: 'companion', rarity: 'mythic', icon: '🌌', cpBonus: 2900, petAttackType: 'mage', description: 'Cosmic shadow spirit emitting pulsing void shockwaves.', petStory: 'Primordial entity born from outer space voids, spawning dark violet nova explosions.' },
    { name: 'Crimson Flame Drake', type: 'companion', rarity: 'mythic', icon: '🐲', cpBonus: 2800, petAttackType: 'laser', description: 'Mythic crimson dragon breathing high-temp flame lasers.', petStory: 'Sovereign dragon of volcanic cores, spewing continuous white-hot flame beams across dungeon waves.' },
    { name: 'Ancient Emerald Serpent', type: 'companion', rarity: 'mythic', icon: '🐉', cpBonus: 2750, petAttackType: 'mage', description: 'Jade serpent spirit releasing toxic poison waves.', petStory: 'Sacred dragon spirit of ancient bamboo forests, releasing toxic emerald poison blasts.' },
    { name: 'Astral Star Unicorn', type: 'companion', rarity: 'mythic', icon: '🦄', cpBonus: 2600, petAttackType: 'sniper', description: 'Radiant celestial unicorn firing starlight ray beams.', petStory: 'Celestial unicorn channeling starlight energy, piercing monster hides with radiant beam rays.' }
  ];

  constructor() {}

  public init(): void {}

  public onEnter(): void {
    this.switchBanner(this.activeBanner);
  }

  public switchBanner(banner: 'gear' | 'pet' | 'skill'): void {
    this.activeBanner = banner;
    this.audio.playSound('potion');

    const placeBg = document.getElementById('place-fullscreen-bg');
    if (placeBg) {
      let bgImg = "assets/murim_merchant_gacha_bg.jpg";
      if (banner === 'pet') bgImg = "assets/gacha_pet_banner_bg.jpg";
      else if (banner === 'skill') bgImg = "assets/gacha_skill_banner_bg.jpg";
      else if (banner === 'gear') bgImg = "assets/gacha_equipment_banner_bg.jpg";
      placeBg.style.backgroundImage = `linear-gradient(rgba(9, 13, 22, 0.60), rgba(9, 13, 22, 0.85)), url('${bgImg}')`;
    }


    const btnGear = document.getElementById('btn-gacha-tab-gear');
    const btnPet = document.getElementById('btn-gacha-tab-pet');
    const btnSkill = document.getElementById('btn-gacha-tab-skill');
    const iconEl = document.getElementById('gacha-banner-icon');
    const titleEl = document.getElementById('gacha-banner-title');
    const descEl = document.getElementById('gacha-banner-desc');
    const singleIcon = document.getElementById('btn-icon-single');
    const multiIcon = document.getElementById('btn-icon-multi');
    const btnSingle = document.getElementById('btn-summon-single');
    const btnMulti = document.getElementById('btn-summon-multi');

    if (banner === 'gear') {
      if (btnGear) btnGear.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-purple-900/40 backdrop-blur-sm border-purple-400 shadow-xl group';
      if (btnPet) btnPet.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-pink-500/40 hover:bg-pink-950/50 group';
      if (btnSkill) btnSkill.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-amber-500/40 hover:bg-amber-950/50 group';
      if (iconEl) iconEl.innerText = '⚔️';
      if (titleEl) titleEl.innerText = 'MYSTICAL EQUIPMENT SHRINE';
      if (descEl) descEl.innerText = 'Summon Mythic Asura Blades, Celestial Shields, and Super Saiyan Elemental Runes!';
      if (singleIcon) singleIcon.innerText = '🗡️';
      if (multiIcon) multiIcon.innerText = '🎁';
      if (btnSingle) btnSingle.innerText = '100 🪙 Gold';
      if (btnMulti) btnMulti.innerText = '10 💎 Gems';
    } else if (banner === 'pet') {
      if (btnGear) btnGear.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-purple-500/40 hover:bg-purple-950/50 group';
      if (btnPet) btnPet.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-pink-900/40 backdrop-blur-sm border-pink-400 shadow-xl group';
      if (btnSkill) btnSkill.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-amber-500/40 hover:bg-amber-950/50 group';
      if (iconEl) iconEl.innerText = '🐾';
      if (titleEl) titleEl.innerText = '🐾 PET COMPANION BANNER';
      if (descEl) descEl.innerText = 'Summon 20 loyal Pets (Animals, Monsters, Demons, Elves, Dwarves, Mechas) with Red & Purple Gems!';
      if (singleIcon) singleIcon.innerText = '🐾';
      if (multiIcon) multiIcon.innerText = '🐉';
      if (btnSingle) btnSingle.innerText = '100 🔴 Red Gems';
      if (btnMulti) btnMulti.innerText = '10 🟣 Purple Gems';
    } else {
      if (btnGear) btnGear.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-purple-500/40 hover:bg-purple-950/50 group';
      if (btnPet) btnPet.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-slate-950/40 backdrop-blur-sm border-pink-500/40 hover:bg-pink-950/50 group';
      if (btnSkill) btnSkill.className = 'w-full p-3.5 rounded-2xl text-left border transition relative overflow-hidden bg-amber-900/40 backdrop-blur-sm border-amber-400 shadow-xl group';
      if (iconEl) iconEl.innerText = '📜';
      if (titleEl) titleEl.innerText = '📜 ANCIENT SKILLS BANNER';
      if (descEl) descEl.innerText = 'Summon Castable Magic & Attack Skills (Necromancer Grimoires, Acid Rain, Laser Matrix) with Skill Tomes!';
      if (singleIcon) singleIcon.innerText = '📜';
      if (multiIcon) multiIcon.innerText = '📖';
      if (btnSingle) btnSingle.innerText = '100 📜 Skill Tomes';
      if (btnMulti) btnMulti.innerText = '10 📖 Ancient Books';
    }

  }

  public roll(count: number): void {
    if (this.activeBanner === 'pet') {
      const isMulti = count === 10;
      const redCost = 100;
      const purpleCost = 10;

      if (isMulti && (this.gameState.state.purpleGems || 0) < purpleCost) {
        this.ui.showAlert('INSUFFICIENT PURPLE GEMS', `Not enough Purple Gems for 10x Pet Summon! Required: ${purpleCost} 🟣 (Earned from Dungeon Bosses)`, '🟣', 'warning');
        return;
      }
      if (!isMulti && (this.gameState.state.redGems || 0) < redCost) {
        this.ui.showAlert('INSUFFICIENT RED GEMS', `Not enough Red Gems for 1x Pet Summon! Required: ${redCost} 🔴 (Earned from Monsters)`, '🔴', 'warning');
        return;
      }

      if (isMulti) this.gameState.state.purpleGems -= purpleCost;
      else this.gameState.state.redGems -= redCost;
    } else if (this.activeBanner === 'skill') {
      const isMulti = count === 10;
      const tomeCost = 100;
      const bookCost = 10;

      if (isMulti && (this.gameState.state.ancientBooks || 0) < bookCost) {
        this.ui.showAlert('INSUFFICIENT ANCIENT BOOKS', `Not enough Ancient Books for 10x Skill Summon! Required: ${bookCost} 📖 (Earned from Dungeon Bosses)`, '📖', 'warning');
        return;
      }
      if (!isMulti && (this.gameState.state.skillTomes || 0) < tomeCost) {
        this.ui.showAlert('INSUFFICIENT SKILL TOMES', `Not enough Skill Tomes for 1x Skill Summon! Required: ${tomeCost} 📜 (Earned from Dungeon Monsters)`, '📜', 'warning');
        return;
      }

      if (isMulti) this.gameState.state.ancientBooks -= bookCost;
      else this.gameState.state.skillTomes -= tomeCost;
    } else {
      const cost = count === 10 ? 10 : 100;
      const isGems = count === 10;

      if (isGems && this.gameState.state.gems < cost) {
        this.ui.showAlert('INSUFFICIENT GEMS', `Not enough Gems for 10x Equipment Summon! Required: ${cost} 💎`, '💎', 'warning');
        return;
      }
      if (!isGems && this.gameState.state.gold < cost) {
        this.ui.showAlert('INSUFFICIENT GOLD', `Not enough Gold for Single Equipment Summon! Required: ${cost} 🪙`, '🪙', 'warning');
        return;
      }

      if (isGems) this.gameState.state.gems -= cost;
      else this.gameState.state.gold -= cost;
    }

    const obtained: GachaDrop[] = [];
    for (let i = 0; i < count; i++) {
      obtained.push(this.drawOne());
    }

    let highestRarity: RarityType = 'common';
    obtained.forEach(drop => {
      if (drop.rarity === 'mythic') highestRarity = 'mythic';
      else if (drop.rarity === 'legendary' && highestRarity !== 'mythic') highestRarity = 'legendary';
      else if (drop.rarity === 'epic' && !['mythic', 'legendary'].includes(highestRarity)) highestRarity = 'epic';
      else if (drop.rarity === 'rare' && !['mythic', 'legendary', 'epic'].includes(highestRarity)) highestRarity = 'rare';
    });

    this.audio.playSound('gacha');

    // Trigger Black & White Ink Slash Cutscene before opening Modal
    this.playSummonAnimation(highestRarity, () => {
      this.processSummonedItems(obtained);
      this.showAcquiredGridModal(obtained, count);
    });
  }

  private playSummonAnimation(highestRarity: RarityType, onComplete: () => void): void {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 pointer-events-auto bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 text-center p-6';

    let rarityLabel = '⚪ COMMON SUMMON REWARD';
    if (highestRarity === 'rare') rarityLabel = '🔵 RARE TREASURE!';
    else if (highestRarity === 'epic') rarityLabel = '🟣 EPIC CELESTIAL RELIC!';
    else if (highestRarity === 'legendary') rarityLabel = '🟠 LEGENDARY SOVEREIGN WEAPON!';
    else if (highestRarity === 'mythic') rarityLabel = '🟣 MYTHIC DIVINE TRANSMUTATION!';

    let bannerTitle = '⚔️ EQUIPMENT BANNER';
    let bannerBg = 'assets/gacha_equipment_banner_bg.jpg';

    if (this.activeBanner === 'pet') {
      bannerTitle = '🐾 PET COMPANIONS BANNER';
      bannerBg = 'assets/gacha_pet_banner_bg.jpg';
    } else if (this.activeBanner === 'skill') {
      bannerTitle = '📜 ANCIENT SKILLS BANNER';
      bannerBg = 'assets/gacha_skill_banner_bg.jpg';
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
          📜 NINE-PEAKS MARTIAL SHRINE • ${bannerTitle}
        </div>

        <h1 class="text-3xl md:text-6xl font-black text-black uppercase tracking-widest drop-shadow-[0_0_35px_rgba(255,255,255,1)]" style="font-family: 'Cinzel Decorative', 'MedievalSharp', 'Bebas Neue', serif; -webkit-text-stroke: 1.5px #ffffff;">
          ✨ SUMMON DECREE ✨
        </h1>

        <div class="text-sm md:text-xl font-mono font-black text-amber-200 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(245,158,11,1)]">
          ${rarityLabel}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.audio.playSound('gacha');

    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        onComplete();
      }, 300);
    }, 850);
  }

  private processSummonedItems(obtained: GachaDrop[]): void {
    const autoSellRules = this.gameState.state.autoSell || { common: false, rare: false, legendary: false, mythic: false };
    let autoSellGoldTotal = 0;

    obtained.forEach(drop => {
      if ((autoSellRules as any)[drop.rarity]) {
        autoSellGoldTotal += this.gameState.getItemSellPrice(drop.rarity, 1);
      } else {
        const existing = this.gameState.state.inventory.find(i => i.name === drop.name);
        if (existing) {
          existing.count++;
          existing.level = (existing.level || 1) + 1;
          existing.cpBonus = (drop.cpBonus || 35) * existing.level;

          // Sync level & CP into equippedPets array if currently equipped
          if (this.gameState.state.equippedPets) {
            const eqPet = this.gameState.state.equippedPets.find(p => p.id === existing.id || p.name === existing.name);
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

  public showAcquiredGridModal(items: GachaDrop[], pullCount: number): void {
    const modal = document.getElementById('modal-gacha-acquired');
    if (!modal) return;

    const modalBox = modal.querySelector('.spatial-window') as HTMLElement;
    const bannerBadge = document.getElementById('gacha-result-banner-title');
    
    if (this.activeBanner === 'pet') {
      if (bannerBadge) bannerBadge.innerText = '🐾 PET COMPANIONS BANNER RESULTS';
      if (modalBox) modalBox.className = 'glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-pink-500/80 shadow-[0_0_60px_rgba(236,72,153,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-pink-950/95 via-slate-950 to-black';
    } else if (this.activeBanner === 'skill') {
      if (bannerBadge) bannerBadge.innerText = '📜 ANCIENT SKILLS BANNER RESULTS';
      if (modalBox) modalBox.className = 'glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(6,182,212,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-slate-950 via-indigo-950 to-black';
    } else {
      if (bannerBadge) bannerBadge.innerText = '⚔️ EQUIPMENT BANNER RESULTS';
      if (modalBox) modalBox.className = 'glass-panel spatial-window w-full max-w-5xl md:max-w-6xl p-8 md:p-10 rounded-3xl border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.6)] relative text-center animate-scaleUp bg-gradient-to-b from-slate-950 via-black to-slate-950';
    }

    const grid = document.getElementById('gacha-result-grid');
    if (grid) {
      grid.innerHTML = '';
      items.forEach(item => {
        const slot = document.createElement('div');
        let rarityBorder = 'border-gray-600 bg-gray-900/90';
        let rarityText = 'text-gray-300';

        if (item.rarity === 'rare') { rarityBorder = 'border-blue-500 bg-blue-950/90 shadow-[0_0_15px_rgba(59,130,246,0.4)]'; rarityText = 'text-blue-300'; }
        if (item.rarity === 'epic') { rarityBorder = 'border-cyan-500 bg-cyan-950/90 shadow-[0_0_18px_rgba(6,182,212,0.5)]'; rarityText = 'text-cyan-300'; }
        if (item.rarity === 'legendary') { rarityBorder = 'border-amber-400 bg-amber-950/90 shadow-[0_0_20px_rgba(245,158,11,0.6)]'; rarityText = 'text-amber-300'; }
        if (item.rarity === 'mythic') { rarityBorder = 'border-purple-400 bg-purple-950/90 shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-pulse'; rarityText = 'text-purple-300'; }

        let detailBadge = `+${item.cpBonus} CP`;
        if (item.type === 'companion') {
          detailBadge = `🐾 ${item.petAttackType ? item.petAttackType.toUpperCase() : 'PET'}`;
        } else if (item.type === 'skill') {
          detailBadge = `📜 SKILL (${item.cpBonus} CP)`;
        } else if (item.bonusPower) {
          detailBadge = `⚔️ +${item.bonusPower} ATK`;
        } else if (item.bonusHp) {
          detailBadge = `🛡️ +${item.bonusHp} HP`;
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

    const wishAgainBtn = document.getElementById('btn-gacha-wish-again');
    if (wishAgainBtn) {
      if (this.activeBanner === 'pet') wishAgainBtn.innerText = 'WISH AGAIN (10x 10 🟣)';
      else if (this.activeBanner === 'skill') wishAgainBtn.innerText = 'WISH AGAIN (10x 10 📖)';
      else wishAgainBtn.innerText = 'WISH AGAIN (10x 10 💎)';

      wishAgainBtn.onclick = () => {
        modal.classList.add('hidden');
        this.roll(10);
      };
    }

    const sellAllBtn = document.getElementById('btn-gacha-sell-all');
    if (sellAllBtn) {
      let totalSellValue = 0;
      items.forEach(i => totalSellValue += this.gameState.getItemSellPrice(i.rarity, 1));
      sellAllBtn.innerText = `SELL ALL (+${totalSellValue} 🪙)`;
      sellAllBtn.onclick = () => {
        modal.classList.add('hidden');

        // Sell all items in this pull
        items.forEach(drop => {
          const idx = this.gameState.state.inventory.findIndex(i => i.name === drop.name);
          if (idx !== -1) {
            this.gameState.state.inventory[idx].count--;
            if (this.gameState.state.inventory[idx].count <= 0) {
              this.gameState.state.inventory.splice(idx, 1);
            }
          }
        });

        this.gameState.state.gold += totalSellValue;
        this.audio.playSound('potion');
        this.ui.showToast(`💰 Sold all ${items.length} items for +${totalSellValue} 🪙!`, 'success');
        this.gameState.notify();
        this.gameState.saveToFirebase();
      };
    }

    modal.classList.remove('hidden');
    modal.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto animate-scaleUp';
  }

  public showGachaItemPreviewModal(item: GachaDrop): void {
    const modal = document.getElementById('modal-gacha-item-preview');
    if (!modal) return;

    this.audio.playSound('potion');

    const iconEl = document.getElementById('gacha-preview-icon');
    const nameEl = document.getElementById('gacha-preview-name');
    const rarityEl = document.getElementById('gacha-preview-rarity');
    const cpEl = document.getElementById('gacha-preview-cp');
    const descEl = document.getElementById('gacha-preview-desc');

    if (iconEl) iconEl.innerText = item.icon;
    if (nameEl) nameEl.innerText = item.name;
    if (rarityEl) {
      rarityEl.innerText = item.rarity.toUpperCase();
      let border = 'border-gray-500 text-gray-300 bg-gray-950';
      if (item.rarity === 'rare') border = 'border-blue-500 text-blue-300 bg-blue-950';
      if (item.rarity === 'epic') border = 'border-cyan-500 text-cyan-300 bg-cyan-950';
      if (item.rarity === 'legendary') border = 'border-amber-500 text-amber-300 bg-amber-950';
      if (item.rarity === 'mythic') border = 'border-purple-400 text-purple-300 bg-purple-950 animate-pulse';
      rarityEl.className = `text-[10px] font-black px-2.5 py-0.5 rounded-full ${border} border uppercase`;
    }

    if (cpEl) cpEl.innerText = `+${(item.cpBonus || 35).toLocaleString()} CP`;
    if (descEl) descEl.innerText = `[Type: ${item.type.toUpperCase()}] ${item.petStory || item.description || 'Summoned from the celestial gacha shrine.'}`;

    modal.classList.remove('hidden');
  }

  private drawOne(): GachaDrop {
    let fullPool: GachaDrop[] = [];

    if (this.activeBanner === 'pet') {
      fullPool = this.petPool;
    } else if (this.activeBanner === 'skill') {
      fullPool = this.skillPool;
    } else {
      const jobClass = this.gameState.state.jobClass || 'WARRIOR';
      let classWeapons = this.warriorPool;
      if (jobClass === 'MAGE') classWeapons = this.magePool;
      if (jobClass === 'ARCHER') classWeapons = this.archerPool;
      if (jobClass === 'SAMURAI') classWeapons = this.samuraiPool;
      fullPool = [...classWeapons, ...this.generalPool];
    }

    const rand = Math.random() * 100;
    let targetRarity: RarityType = 'common';

    if (rand < 5) targetRarity = 'mythic';
    else if (rand < 20) targetRarity = 'legendary';
    else if (rand < 45) targetRarity = 'epic';
    else if (rand < 75) targetRarity = 'rare';

    const candidates = fullPool.filter(p => p.rarity === targetRarity);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return fullPool[Math.floor(Math.random() * fullPool.length)];
  }

  public collectWithBagShakeEffect(): void {
    const modal = document.getElementById('modal-gacha-acquired');
    const grid = document.getElementById('gacha-result-grid');
    if (!modal || !grid) return;

    this.audio.playSound('levelup');

    // Giant Glowing Inventory Bag Icon Overlay
    const bagOverlay = document.createElement('div');
    bagOverlay.className = 'absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-50 animate-scaleUp';
    bagOverlay.innerHTML = `
      <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-400 bg-gradient-to-b from-amber-900 via-amber-950 to-black flex items-center justify-center text-6xl md:text-7xl shadow-[0_0_80px_rgba(245,158,11,1)] animate-pulse relative">
        <span class="animate-bounce">🎒</span>
        <div class="absolute -inset-2 rounded-full border-2 border-amber-300/40 animate-ping"></div>
      </div>
      <div class="text-xs font-black text-amber-300 uppercase tracking-widest bg-black/90 px-4 py-1.5 rounded-full border border-amber-500/60 mt-3 shadow-xl">
        ✨ COLLECTING ALL ITEMS INTO BAG ✨
      </div>
    `;
    grid.style.position = 'relative';
    grid.appendChild(bagOverlay);

    // Apply synchronized shake effect to cards while preserving exact grid arrangement
    const cardSlots = Array.from(grid.children).filter(child => child !== bagOverlay) as HTMLElement[];
    cardSlots.forEach(card => {
      card.style.animation = 'bagShake 0.12s infinite alternate ease-in-out';
    });

    // Inject temporary CSS animation for realistic bag shake
    let styleTag = document.getElementById('bag-shake-keyframes');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'bag-shake-keyframes';
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

    // Shrink cards smoothly into bag after shake
    setTimeout(() => {
      cardSlots.forEach(card => {
        card.style.transition = 'all 0.35s ease-in-out';
        card.style.transform = 'scale(0) opacity(0)';
        card.style.opacity = '0';
      });
    }, 450);

    setTimeout(() => {
      bagOverlay.remove();
      modal.classList.add('hidden');
      this.ui.showToast('🎒 All items collected into Inventory!', 'success');
    }, 800);
  }
}
