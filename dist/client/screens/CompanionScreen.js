"use strict";
// =========================================================
// COMPANION SCREEN MODULE - 5 PET SQUAD DOCKER & INVENTORY
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanionScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class CompanionScreen {
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    constructor() { }
    init() {
        this.renderCompanionView();
        const autoEquipBtn = document.getElementById('btn-auto-equip-pet');
        if (autoEquipBtn) {
            autoEquipBtn.onclick = () => {
                this.gameState.autoEquipBestPet();
                this.audio.playSound('levelup');
                this.ui.showToast('⚡ Auto-Equipped TOP 5 Companion Pet Squad!', 'success');
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
        const cardContainer = document.getElementById('companion-equipped-card');
        if (!cardContainer)
            return;
        let equippedPets = this.gameState.state.equippedPets || [];
        if (equippedPets.length === 0 && this.gameState.state.equippedPet) {
            equippedPets = [this.gameState.state.equippedPet];
            this.gameState.state.equippedPets = equippedPets;
        }
        let slotsHTML = '';
        for (let i = 0; i < 5; i++) {
            const pet = equippedPets[i];
            if (pet) {
                let atkBadge = '🐾 SLASH';
                if (pet.petAttackType === 'sniper')
                    atkBadge = '🎯 SNIPER';
                if (pet.petAttackType === 'laser')
                    atkBadge = '⚡ LASER';
                if (pet.petAttackType === 'mage')
                    atkBadge = '🔮 MAGE';
                if (pet.petAttackType === 'shield')
                    atkBadge = '🛡️ SHIELD';
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
            }
            else {
                slotsHTML += `
          <div class="glass-panel p-3 rounded-2xl border border-pink-900/50 bg-slate-950/60 flex items-center justify-between opacity-50">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-pink-700">🐾</span>
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
            const idx = (this.gameState.state.equippedPets || []).findIndex(p => p.id === petId);
            if (idx >= 0) {
                this.gameState.state.equippedPets.splice(idx, 1);
                this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
                this.ui.showToast('Unequipped Companion Pet.', 'info');
                this.gameState.notify();
                this.gameState.saveToFirebase();
                this.renderCompanionView();
            }
        };
        cardContainer.innerHTML = `
      <div class="w-full space-y-2.5">
        <div class="flex justify-between items-center border-b border-pink-800/60 pb-2">
          <span class="text-xs font-black text-pink-300 uppercase tracking-widest">🐾 EQUIPPED SQUAD (${equippedPets.length}/5)</span>
          <span class="text-[10px] text-amber-300 font-mono font-bold">5 Active Battle Pets</span>
        </div>
        <div class="flex flex-col gap-2.5">
          ${slotsHTML}
        </div>
      </div>
    `;
    }
    getRarityWeight(rarity) {
        if (rarity === 'mythic')
            return 4;
        if (rarity === 'legendary')
            return 3;
        if (rarity === 'rare')
            return 2;
        return 1;
    }
    renderCompanionGrid() {
        const grid = document.getElementById('companion-inventory-grid');
        if (!grid)
            return;
        grid.innerHTML = '';
        const pets = (this.gameState.state.inventory || []).filter(i => i.type === 'companion');
        const equippedPets = this.gameState.state.equippedPets || [];
        // SORT: EQUIPPED PETS FIRST -> THEN RARITY DESCENDING -> THEN CP BONUS DESCENDING
        pets.sort((a, b) => {
            const eqA = equippedPets.some(p => p.id === a.id) ? 1 : 0;
            const eqB = equippedPets.some(p => p.id === b.id) ? 1 : 0;
            if (eqA !== eqB)
                return eqB - eqA;
            const wA = this.getRarityWeight(a.rarity);
            const wB = this.getRarityWeight(b.rarity);
            if (wA !== wB)
                return wB - wA;
            return ((b.cpBonus || 45) * (b.level || 1)) - ((a.cpBonus || 45) * (a.level || 1));
        });
        if (pets.length === 0) {
            grid.innerHTML = '<div class="col-span-4 text-center text-xs text-pink-400 py-8">No Companion Pets found in inventory.</div>';
            return;
        }
        pets.forEach(pet => {
            const isEquipped = equippedPets.some(p => p.id === pet.id);
            const slot = document.createElement('div');
            let rarityClass = 'rare';
            if (pet.rarity === 'common')
                rarityClass = 'common';
            if (pet.rarity === 'legendary')
                rarityClass = 'legendary';
            if (pet.rarity === 'mythic')
                rarityClass = 'mythic';
            let atkBadge = '🐾 SLASH';
            if (pet.petAttackType === 'sniper')
                atkBadge = '🎯 SNIPER';
            if (pet.petAttackType === 'laser')
                atkBadge = '⚡ LASER';
            if (pet.petAttackType === 'mage')
                atkBadge = '🔮 MAGE';
            if (pet.petAttackType === 'shield')
                atkBadge = '🛡️ SHIELD';
            slot.className = `item-slot ${rarityClass} flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition hover:scale-105 relative ${isEquipped ? 'ring-4 ring-pink-400 bg-pink-950/80' : ''}`;
            slot.innerHTML = `
        <span class="absolute top-1 left-1 text-[10px] z-10" onclick="event.stopPropagation(); window.toggleSingleItemLock('${pet.id}')">${pet.isLocked ? '🔒' : '🔓'}</span>
        ${isEquipped ? '<span class="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs md:text-sm font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-[0_0_12px_rgba(245,158,11,1)] z-20 leading-none">E</span>' : ''}
        <span class="text-3xl mb-1">${pet.icon}</span>
        <span class="text-xs font-black text-white truncate w-full text-center">${pet.name}</span>
        <span class="text-[8px] text-pink-300 font-mono font-bold mt-0.5">[Type: COMPANION] • ${atkBadge}</span>
        <span class="text-[9px] text-amber-300 font-mono font-bold">+${(pet.cpBonus || 45) * (pet.level || 1)} CP</span>
      `;
            slot.onclick = () => {
                this.showCompanionDetailModal(pet);
            };
            grid.appendChild(slot);
        });
    }
    showCompanionDetailModal(pet) {
        const modal = document.getElementById('modal-companion-detail');
        if (!modal)
            return;
        this.audio.playSound('potion');
        const iconEl = document.getElementById('pet-detail-icon');
        const nameEl = document.getElementById('pet-detail-name');
        const rarityEl = document.getElementById('pet-detail-rarity');
        const levelEl = document.getElementById('pet-detail-level');
        const attackEl = document.getElementById('pet-detail-attack');
        const cpEl = document.getElementById('pet-detail-cp');
        const storyEl = document.getElementById('pet-detail-story');
        const btnEquip = document.getElementById('btn-pet-detail-equip');
        const btnLock = document.getElementById('btn-pet-detail-lock');
        const btnSell = document.getElementById('btn-pet-detail-sell');
        const isEquipped = (this.gameState.state.equippedPets || []).some(p => p.id === pet.id);
        if (iconEl)
            iconEl.innerText = pet.icon;
        if (nameEl)
            nameEl.innerText = `${pet.isLocked ? '🔒 ' : ''}${pet.name}`;
        if (rarityEl)
            rarityEl.innerText = pet.rarity.toUpperCase();
        if (levelEl)
            levelEl.innerText = `Level ${pet.level || 1}`;
        if (attackEl)
            attackEl.innerText = pet.petAttackType ? pet.petAttackType.toUpperCase() : 'SLASH';
        if (cpEl)
            cpEl.innerText = `+${(pet.cpBonus || 45) * (pet.level || 1)} CP`;
        if (storyEl)
            storyEl.innerText = `[Type: COMPANION] ${pet.petStory || pet.description || 'Loyal creature companion that attacks monsters in dungeon battles.'}`;
        const totalCp = (pet.cpBonus || 45) * (pet.level || 1);
        if (iconEl)
            iconEl.innerText = pet.icon;
        if (nameEl)
            nameEl.innerText = pet.name;
        if (rarityEl) {
            rarityEl.innerText = pet.rarity.toUpperCase();
            let border = 'border-gray-500 text-gray-300 bg-gray-950';
            if (pet.rarity === 'rare')
                border = 'border-blue-500 text-blue-300 bg-blue-950';
            if (pet.rarity === 'epic')
                border = 'border-cyan-500 text-cyan-300 bg-cyan-950';
            if (pet.rarity === 'legendary')
                border = 'border-amber-500 text-amber-300 bg-amber-950';
            if (pet.rarity === 'mythic')
                border = 'border-purple-400 text-purple-300 bg-purple-950 animate-pulse';
            rarityEl.className = `text-[10px] font-black px-2.5 py-0.5 rounded-full ${border} border uppercase`;
        }
        if (levelEl)
            levelEl.innerText = `LVL ${pet.level || 1}`;
        let atkBadge = '🐾 SLASH';
        if (pet.petAttackType === 'sniper')
            atkBadge = '🎯 SNIPER';
        if (pet.petAttackType === 'laser')
            atkBadge = '⚡ LASER';
        if (pet.petAttackType === 'mage')
            atkBadge = '🔮 MAGE';
        if (pet.petAttackType === 'shield')
            atkBadge = '🛡️ SHIELD';
        if (attackEl)
            attackEl.innerText = atkBadge;
        if (cpEl)
            cpEl.innerText = `+${totalCp.toLocaleString()} CP`;
        if (storyEl) {
            storyEl.innerText = pet.petStory || pet.description || 'A mysterious beast from ancient dungeon depths, bound by eternal loyalty.';
        }
        if (btnEquip) {
            btnEquip.innerText = isEquipped ? 'REMOVE SQUAD' : '⚔️ EQUIP SQUAD';
            btnEquip.className = isEquipped
                ? 'py-3 bg-red-700 hover:bg-red-600 text-xs font-black text-white rounded-xl border border-red-400 shadow'
                : 'py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-xs font-black text-white rounded-xl border border-pink-300 shadow';
            btnEquip.onclick = () => {
                if (isEquipped) {
                    window.handleUnequipPet(pet.id);
                }
                else {
                    this.gameState.equipPet(pet);
                    this.audio.playSound('levelup');
                    this.ui.showToast(`🐾 Equipped ${pet.name} to Pet Squad!`, 'success');
                }
                modal.classList.add('hidden');
                this.renderCompanionView();
            };
        }
        if (btnLock) {
            btnLock.innerText = pet.isLocked ? '🔒 LOCKED' : '🔓 UNLOCKED';
            btnLock.onclick = () => {
                pet.isLocked = !pet.isLocked;
                this.audio.playSound('potion');
                this.ui.showToast(`${pet.isLocked ? '🔒 Locked' : '🔓 Unlocked'} ${pet.name}`, 'info');
                this.gameState.notify();
                this.gameState.saveToFirebase();
                this.showCompanionDetailModal(pet);
            };
        }
        if (btnSell) {
            const sellPrice = this.gameState.getItemSellPrice(pet.rarity, pet.level || 1);
            btnSell.innerText = `🪙 SELL (${sellPrice} 🪙)`;
            if (isEquipped || pet.isLocked) {
                btnSell.classList.add('opacity-50', 'cursor-not-allowed');
                btnSell.onclick = () => {
                    this.ui.showToast('⚠️ Cannot sell equipped or locked pet!', 'warning');
                };
            }
            else {
                btnSell.classList.remove('opacity-50', 'cursor-not-allowed');
                btnSell.onclick = () => {
                    const idx = this.gameState.state.inventory.findIndex(i => i.id === pet.id);
                    if (idx !== -1) {
                        this.gameState.state.inventory.splice(idx, 1);
                        this.gameState.state.gold += sellPrice;
                        this.audio.playSound('potion');
                        this.ui.showToast(`💰 Sold ${pet.name} for +${sellPrice} 🪙!`, 'success');
                        this.gameState.notify();
                        this.gameState.saveToFirebase();
                        modal.classList.add('hidden');
                        this.renderCompanionView();
                    }
                };
            }
        }
        modal.classList.remove('hidden');
    }
}
exports.CompanionScreen = CompanionScreen;
