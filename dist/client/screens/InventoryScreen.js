"use strict";
// =========================================================
// INVENTORY SCREEN MODULE - EQUIPPED GEAR SIDEBAR, ITEM LOCKING, & AUTO EQUIP
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryScreen = void 0;
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class InventoryScreen {
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    activeFilter = 'all';
    isMultiSelectMode = false;
    selectedItemIds = new Set();
    constructor() { }
    init() {
        this.renderInventory();
        const buyPotionBtn = document.getElementById('btn-buy-potion');
        if (buyPotionBtn)
            buyPotionBtn.onclick = () => this.buyPotion();
        const multiSelectBtn = document.getElementById('btn-toggle-multiselect');
        if (multiSelectBtn) {
            multiSelectBtn.onclick = () => this.toggleMultiSelectMode();
        }
        const batchSellBtn = document.getElementById('btn-execute-batch-sell');
        if (batchSellBtn) {
            batchSellBtn.onclick = () => this.executeBatchSell();
        }
        const autoEquipBtn = document.getElementById('btn-auto-equip-highest');
        if (autoEquipBtn) {
            autoEquipBtn.onclick = () => this.autoEquipHighestCP();
        }
        // Global Slot Lock Helper
        window.toggleEquippedSlotLock = (slotType) => {
            if (slotType === 'weapon')
                this.gameState.state.isWeaponLocked = !this.gameState.state.isWeaponLocked;
            if (slotType === 'armor')
                this.gameState.state.isArmorLocked = !this.gameState.state.isArmorLocked;
            if (slotType === 'rune')
                this.gameState.state.isRuneLocked = !this.gameState.state.isRuneLocked;
            if (slotType === 'skill')
                this.gameState.state.isSkillLocked = !this.gameState.state.isSkillLocked;
            if (slotType === 'mount')
                this.gameState.state.isMountLocked = !this.gameState.state.isMountLocked;
            this.audio.playSound('potion');
            this.ui.showToast(`Toggled Lock for ${slotType.toUpperCase()} slot!`, 'info');
            this.gameState.notify();
            this.gameState.saveToFirebase();
            this.renderInventory();
        };
        // Global Auto Equip Best Pets UI Helper
        window.autoEquipBestPetsFromUI = () => {
            const inv = this.gameState.state.inventory || [];
            const pets = inv.filter(i => i.type === 'companion');
            if (pets.length === 0) {
                this.ui.showToast('⚠️ No PETS found in inventory!', 'warning');
                return;
            }
            pets.sort((a, b) => ((b.cpBonus || 45) * (b.level || 1)) - ((a.cpBonus || 45) * (a.level || 1)));
            this.gameState.state.equippedPets = pets.slice(0, 5);
            this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
            this.audio.playSound('levelup');
            this.ui.showToast(`⚡ Equipped top ${this.gameState.state.equippedPets.length} best PETS!`, 'success');
            this.gameState.recalculateCP();
            this.gameState.notify();
            this.gameState.saveToFirebase();
            this.renderInventory();
        };
        window.autoEquipHighestCPFromUI = () => this.autoEquipHighestCP();
        // Bind Filter Tabs
        ['all', 'weapon', 'armor', 'rune', 'skill', 'unique_power', 'mount', 'porter', 'companion'].forEach(filter => {
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
        ['all', 'weapon', 'armor', 'rune', 'skill', 'unique_power', 'mount', 'porter', 'companion'].forEach(f => {
            const btn = document.getElementById(`inv-filter-${f}`);
            if (btn) {
                if (f === filter) {
                    btn.className = 'px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg shadow whitespace-nowrap cursor-pointer';
                }
                else {
                    btn.className = 'px-3 py-1 bg-emerald-950/80 text-emerald-300 font-bold text-xs rounded-lg hover:bg-emerald-900 whitespace-nowrap cursor-pointer';
                }
            }
        });
        this.renderInventory();
    }
    toggleMultiSelectMode() {
        this.isMultiSelectMode = !this.isMultiSelectMode;
        this.selectedItemIds.clear();
        const btn = document.getElementById('btn-toggle-multiselect');
        const batchBar = document.getElementById('inventory-batch-sell-bar');
        if (btn) {
            if (this.isMultiSelectMode) {
                btn.className = 'px-4 py-2 bg-amber-600 text-xs font-black text-white rounded-xl border border-amber-400 shadow-lg';
                if (batchBar)
                    batchBar.classList.remove('hidden');
            }
            else {
                btn.className = 'px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-xs font-black text-emerald-200 rounded-xl border border-emerald-600/50';
                if (batchBar)
                    batchBar.classList.add('hidden');
            }
        }
        this.renderInventory();
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
    updateEquippedSidebar() {
        const wIcon = document.getElementById('side-weapon-icon');
        const wName = document.getElementById('side-weapon-name');
        if (wIcon && wName) {
            const item = this.gameState.state.equippedWeapon;
            wIcon.innerText = item ? item.icon : '🗡️';
            wName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Weapon';
        }
        const aIcon = document.getElementById('side-armor-icon');
        const aName = document.getElementById('side-armor-name');
        if (aIcon && aName) {
            const item = this.gameState.state.equippedArmor;
            aIcon.innerText = item ? item.icon : '🥋';
            aName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Armor';
        }
        const rIcon = document.getElementById('side-rune-icon');
        const rName = document.getElementById('side-rune-name');
        if (rIcon && rName) {
            const item = this.gameState.state.equippedRune;
            rIcon.innerText = item ? item.icon : '🔥';
            rName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Rune/Aura';
        }
        const sIcon = document.getElementById('side-skill-icon');
        const sName = document.getElementById('side-skill-name');
        if (sIcon && sName) {
            const item = this.gameState.state.equippedSkill;
            sIcon.innerText = item ? item.icon : '⚡';
            sName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Skill';
        }
        const upIcon = document.getElementById('side-uniquepower-icon');
        const upName = document.getElementById('side-uniquepower-name');
        if (upIcon && upName) {
            const item = this.gameState.state.equippedUniquePower;
            upIcon.innerText = item ? item.icon : '👑';
            upName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Unique Power';
        }
        const mIcon = document.getElementById('side-mount-icon');
        const mName = document.getElementById('side-mount-name');
        if (mIcon && mName) {
            const item = this.gameState.state.equippedMount;
            mIcon.innerText = item ? item.icon : '🐉';
            mName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Mount';
        }
        const pIcon = document.getElementById('side-porter-icon');
        const pName = document.getElementById('side-porter-name');
        if (pIcon && pName) {
            const item = this.gameState.state.equippedPorter;
            pIcon.innerText = item ? item.icon : '🎒';
            pName.innerText = item ? `${item.name} (Lvl ${item.level || 1})` : 'No Porter';
        }
        // Render Equipped 5 PET Battle Squad in Right Panel
        const petContainer = document.getElementById('inv-side-pet-squad');
        if (petContainer) {
            petContainer.innerHTML = '';
            const equippedPets = this.gameState.state.equippedPets || [];
            for (let i = 0; i < 5; i++) {
                const pet = equippedPets[i];
                const slot = document.createElement('div');
                slot.className = 'p-2 bg-slate-900/90 rounded-xl border border-pink-500/60 relative flex items-center justify-between gap-2 transition hover:bg-pink-950/40 cursor-pointer';
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
                        const idx = (this.gameState.state.equippedPets || []).findIndex(p => p.id === pet.id);
                        if (idx >= 0) {
                            this.gameState.state.equippedPets.splice(idx, 1);
                            this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
                            this.ui.showToast(`Unequipped PET: ${pet.name}`, 'info');
                            this.gameState.notify();
                            this.gameState.saveToFirebase();
                            this.renderInventory();
                        }
                    };
                }
                else {
                    slot.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="text-xl text-slate-600">🐾</span>
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
        const grid = document.getElementById('inventory-items-grid') || document.querySelector('#view-inventory .grid-cols-4');
        if (!grid)
            return;
        grid.innerHTML = '';
        let items = [...(this.gameState.state.inventory || [])];
        // SORT: EQUIPPED ITEMS FIRST -> THEN RARITY DESCENDING (MYTHIC -> LEGENDARY -> RARE -> COMMON) -> THEN LEVEL DESCENDING
        items.sort((a, b) => {
            const eqA = this.isItemEquipped(a) ? 1 : 0;
            const eqB = this.isItemEquipped(b) ? 1 : 0;
            if (eqA !== eqB)
                return eqB - eqA;
            const wA = this.getRarityWeight(a.rarity);
            const wB = this.getRarityWeight(b.rarity);
            if (wA !== wB)
                return wB - wA;
            return (b.level || 1) - (a.level || 1);
        });
        if (this.activeFilter !== 'all') {
            items = items.filter(i => i.type === this.activeFilter);
        }
        if (items.length === 0) {
            grid.innerHTML = '<div class="col-span-4 text-center text-xs text-emerald-400 py-8">No items found matching filter.</div>';
            this.updateBatchSellBar();
            return;
        }
        items.forEach((item, index) => {
            const slot = document.createElement('div');
            slot.id = `inv-slot-${item.id}`;
            let rarityClass = 'common';
            if (item.rarity === 'rare')
                rarityClass = 'rare';
            if (item.rarity === 'legendary')
                rarityClass = 'legendary';
            if (item.rarity === 'mythic')
                rarityClass = 'mythic';
            const isSelected = this.selectedItemIds.has(item.id);
            const isEquipped = (this.gameState.state.equippedWeapon?.id === item.id) ||
                (this.gameState.state.equippedArmor?.id === item.id) ||
                (this.gameState.state.equippedRune?.id === item.id) ||
                (this.gameState.state.equippedSkill?.id === item.id) ||
                (this.gameState.state.equippedUniquePower?.id === item.id) ||
                (this.gameState.state.equippedCutscene?.id === item.id) ||
                (this.gameState.state.equippedMount?.id === item.id) ||
                (this.gameState.state.equippedPorter?.id === item.id) ||
                (this.gameState.state.equippedPets?.some(p => p.id === item.id));
            slot.className = `item-slot ${rarityClass} flex flex-col items-center justify-center h-24 p-2 cursor-pointer transition hover:scale-105 relative ${isSelected ? 'ring-4 ring-amber-400 bg-amber-950/80' : ''}`;
            slot.innerHTML = `
        <!-- SMALL CORNER LOCK ICON -->
        <span class="absolute top-1 left-1 text-[10px] z-10" onclick="event.stopPropagation(); window.toggleSingleItemLock('${item.id}')">
          ${item.isLocked ? '🔒' : '🔓'}
        </span>
        <!-- BIG 'E' BADGE FOR EQUIPPED ITEMS -->
        ${isEquipped ? '<span class="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs md:text-sm font-black px-1.5 py-0.5 rounded-md border-2 border-white shadow-[0_0_12px_rgba(245,158,11,1)] z-20 leading-none">E</span>' : ''}
        <span class="text-3xl">${item.icon}</span>
        <span class="text-[9px] font-bold text-white mt-1 text-center truncate w-full">${item.name}</span>
        ${item.level ? `<span class="text-[9px] text-amber-300 font-mono">Lvl ${item.level}</span>` : ''}
        ${this.isMultiSelectMode && isSelected ? '<span class="absolute bottom-1 right-1 bg-amber-400 text-slate-950 text-xs px-1 rounded font-black">☑️</span>' : ''}
        ${!this.isMultiSelectMode && item.count > 1 ? `<span class="absolute bottom-1 right-1 bg-emerald-950/90 text-emerald-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">x${item.count}</span>` : ''}
      `;
            slot.onclick = () => {
                if (this.isMultiSelectMode) {
                    if (this.selectedItemIds.has(item.id))
                        this.selectedItemIds.delete(item.id);
                    else
                        this.selectedItemIds.add(item.id);
                    this.renderInventory();
                    this.updateBatchSellBar();
                }
                else {
                    this.showItemDetailModal(item, index);
                }
            };
            grid.appendChild(slot);
        });
        window.toggleSingleItemLock = (itemId) => {
            const item = this.gameState.state.inventory.find(i => i.id === itemId);
            if (item) {
                item.isLocked = !item.isLocked;
                this.audio.playSound('potion');
                this.ui.showToast(`Item ${item.name} is now ${item.isLocked ? 'LOCKED 🔒' : 'UNLOCKED 🔓'}!`, 'info');
                this.gameState.notify();
                this.gameState.saveToFirebase();
                this.renderInventory();
            }
        };
        this.updateBatchSellBar();
    }
    updateBatchSellBar() {
        const textEl = document.getElementById('batch-sell-text');
        if (!textEl)
            return;
        let totalGold = 0;
        this.selectedItemIds.forEach(id => {
            const item = this.gameState.state.inventory.find(i => i.id === id);
            if (item && !item.isLocked) {
                totalGold += this.gameState.getItemSellPrice(item.rarity, item.level || 1) * item.count;
            }
        });
        textEl.innerText = `${this.selectedItemIds.size} Items Selected (+${totalGold.toLocaleString()} 🪙)`;
    }
    executeBatchSell() {
        if (this.selectedItemIds.size === 0) {
            this.ui.showToast('⚠️ No items selected to sell!', 'warning');
            return;
        }
        let totalGoldGained = 0;
        this.selectedItemIds.forEach(id => {
            const item = this.gameState.state.inventory.find(i => i.id === id);
            if (item && !item.isLocked) {
                const slotEl = document.getElementById(`inv-slot-${item.id}`);
                if (slotEl)
                    slotEl.className += ' animate-shatter';
                totalGoldGained += this.gameState.getItemSellPrice(item.rarity, item.level || 1) * item.count;
                if (this.gameState.state.equippedWeapon?.id === item.id)
                    this.gameState.state.equippedWeapon = null;
                if (this.gameState.state.equippedArmor?.id === item.id)
                    this.gameState.state.equippedArmor = null;
                if (this.gameState.state.equippedRune?.id === item.id)
                    this.gameState.state.equippedRune = null;
                if (this.gameState.state.equippedSkill?.id === item.id)
                    this.gameState.state.equippedSkill = null;
            }
        });
        setTimeout(() => {
            this.gameState.state.inventory = this.gameState.state.inventory.filter(i => !(this.selectedItemIds.has(i.id) && !i.isLocked));
            this.gameState.state.gold += totalGoldGained;
            this.audio.playSound('potion');
            this.ui.showToast(`💰 Sold selected unlocked items for +${totalGoldGained.toLocaleString()} 🪙!`, 'success');
            this.selectedItemIds.clear();
            this.gameState.notify();
            this.gameState.saveToFirebase();
            this.renderInventory();
        }, 300);
    }
    isItemEquipped(item) {
        if (this.gameState.state.equippedWeapon?.id === item.id)
            return true;
        if (this.gameState.state.equippedArmor?.id === item.id)
            return true;
        if (this.gameState.state.equippedRune?.id === item.id)
            return true;
        if (this.gameState.state.equippedSkill?.id === item.id)
            return true;
        if (this.gameState.state.equippedUniquePower?.id === item.id)
            return true;
        if (this.gameState.state.equippedCutscene?.id === item.id)
            return true;
        if (this.gameState.state.equippedMount?.id === item.id)
            return true;
        if (this.gameState.state.equippedPets && this.gameState.state.equippedPets.some(p => p.id === item.id))
            return true;
        return false;
    }
    showItemDetailModal(item, index) {
        const modal = document.getElementById('modal-item-detail');
        if (!modal)
            return;
        const iconEl = document.getElementById('item-detail-icon');
        const titleEl = document.getElementById('item-detail-title');
        const rarityEl = document.getElementById('item-detail-rarity');
        const typeEl = document.getElementById('detail-type');
        const levelEl = document.getElementById('detail-level');
        const cpEl = document.getElementById('detail-cp');
        const descEl = document.getElementById('item-detail-desc');
        const actionBtn = document.getElementById('btn-item-action');
        const sellBtn = document.getElementById('btn-item-sell');
        if (iconEl)
            iconEl.innerText = item.icon;
        if (titleEl)
            titleEl.innerText = `${item.isLocked ? '🔒 ' : ''}${item.name}`;
        if (rarityEl) {
            rarityEl.innerText = item.rarity.toUpperCase();
            rarityEl.className = `inline-block px-3 py-1 text-xs font-black rounded-lg uppercase tracking-wider mb-4 ${item.rarity === 'mythic' ? 'bg-purple-900 text-purple-200' :
                item.rarity === 'legendary' ? 'bg-amber-900 text-amber-200' :
                    item.rarity === 'rare' ? 'bg-blue-900 text-blue-200' : 'bg-gray-800 text-gray-200'}`;
        }
        if (typeEl)
            typeEl.innerText = item.type.toUpperCase();
        if (levelEl)
            levelEl.innerText = `Level ${item.level || 1}`;
        if (cpEl)
            cpEl.innerText = `+${(item.cpBonus || 25) * (item.level || 1)} CP`;
        if (descEl) {
            if (item.type === 'porter') {
                const speedSec = ((item.porterSpeedMs || 2500) / 1000).toFixed(1);
                descEl.innerHTML = `
          <div class="space-y-2 text-left">
            <p><span class="font-bold text-amber-300">⚡ Collection Speed:</span> ${speedSec}s per pickup</p>
            <p><span class="font-bold text-emerald-300">🧲 Magnet Radius:</span> ${item.porterRadiusPx || 140}px</p>
            <p class="text-xs italic text-slate-300 mt-2 bg-slate-900/90 p-3 rounded-xl border border-emerald-800">${item.porterLore || item.description || ''}</p>
          </div>
        `;
            }
            else {
                descEl.innerText = `[Type: ${item.type.toUpperCase()}] ${item.description || `Special ${item.type} for hero progression.`}`;
            }
        }
        const goldPrice = this.gameState.getItemSellPrice(item.rarity, item.level || 1);
        if (sellBtn) {
            if (item.isLocked) {
                sellBtn.innerText = 'LOCKED (Cannot Sell)';
                sellBtn.className = 'w-full py-2.5 bg-gray-800 text-gray-400 text-xs font-black rounded-xl cursor-not-allowed';
                sellBtn.onclick = null;
            }
            else {
                sellBtn.innerText = `SELL (${goldPrice} 🪙)`;
                sellBtn.className = 'w-full py-2.5 bg-red-600 hover:bg-red-500 text-xs font-black text-white rounded-xl shadow-lg';
                sellBtn.onclick = () => {
                    modal.classList.add('hidden');
                    this.sellSingleItem(item, index);
                };
            }
        }
        const isEquipped = this.isItemEquipped(item);
        if (actionBtn) {
            if (['weapon', 'armor', 'rune', 'skill', 'unique_power', 'companion', 'cutscene', 'mount', 'porter'].includes(item.type)) {
                if (isEquipped) {
                    actionBtn.innerText = item.type === 'mount' ? '❌ UNEQUIP MOUNT' : (item.type === 'porter' ? '❌ UNEQUIP PORTER' : (item.type === 'companion' ? '❌ UNEQUIP PET' : '❌ UNEQUIP ITEM'));
                    actionBtn.className = 'w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-xs font-black text-white rounded-xl shadow-lg cursor-pointer';
                    actionBtn.onclick = () => {
                        modal.classList.add('hidden');
                        this.unequipItem(item);
                    };
                }
                else {
                    actionBtn.innerText = item.type === 'mount' ? '⚡ EQUIP MOUNT' : (item.type === 'porter' ? '⚡ EQUIP PORTER' : (item.type === 'companion' ? '⚡ EQUIP PET' : '⚡ EQUIP ITEM'));
                    actionBtn.className = 'w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white rounded-xl shadow-lg cursor-pointer';
                    actionBtn.onclick = () => {
                        modal.classList.add('hidden');
                        this.equipItem(item);
                    };
                }
            }
            else {
                actionBtn.innerText = 'OK';
                actionBtn.onclick = () => modal.classList.add('hidden');
            }
        }
        modal.classList.remove('hidden');
        this.audio.playSound('click');
    }
    sellSingleItem(item, index) {
        if (item.isLocked) {
            this.ui.showToast('⚠️ Item is LOCKED! Unlock item first to sell.', 'warning');
            return;
        }
        const slotEl = document.getElementById(`inv-slot-${item.id}`);
        if (slotEl) {
            slotEl.className += ' animate-shatter';
        }
        setTimeout(() => {
            const goldPrice = this.gameState.getItemSellPrice(item.rarity, item.level || 1);
            this.gameState.state.gold += goldPrice;
            this.unequipItemSilent(item);
            item.count--;
            if (item.count <= 0) {
                this.gameState.state.inventory = this.gameState.state.inventory.filter(i => i.id !== item.id);
            }
            this.audio.playSound('click');
            this.ui.showToast(`💰 Sold ${item.name} for +${goldPrice} 🪙!`, 'success');
            this.gameState.notify();
            this.gameState.saveToFirebase();
            this.renderInventory();
        }, 300);
    }
    unequipItemSilent(item) {
        if (this.gameState.state.equippedWeapon?.id === item.id)
            this.gameState.state.equippedWeapon = null;
        if (this.gameState.state.equippedArmor?.id === item.id)
            this.gameState.state.equippedArmor = null;
        if (this.gameState.state.equippedRune?.id === item.id)
            this.gameState.state.equippedRune = null;
        if (this.gameState.state.equippedSkill?.id === item.id)
            this.gameState.state.equippedSkill = null;
        if (this.gameState.state.equippedUniquePower?.id === item.id)
            this.gameState.state.equippedUniquePower = null;
        if (this.gameState.state.equippedCutscene?.id === item.id)
            this.gameState.state.equippedCutscene = null;
        if (this.gameState.state.equippedMount?.id === item.id)
            this.gameState.state.equippedMount = null;
        if (this.gameState.state.equippedPorter?.id === item.id)
            this.gameState.state.equippedPorter = null;
        if (this.gameState.state.equippedPets) {
            const idx = this.gameState.state.equippedPets.findIndex(p => p.id === item.id);
            if (idx >= 0) {
                this.gameState.state.equippedPets.splice(idx, 1);
                this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
            }
        }
    }
    equipItem(item) {
        if (item.type === 'weapon' && !this.gameState.state.isWeaponLocked) {
            const jobClass = this.gameState.state.jobClass || 'WARRIOR';
            if (!this.gameState.isWeaponAllowedForClass(jobClass, item)) {
                this.ui.showToast(`⚠️ Class Restriction! ${jobClass} cannot equip ${item.name}!`, 'warning');
                return;
            }
            this.gameState.state.equippedWeapon = item;
        }
        if (item.type === 'armor' && !this.gameState.state.isArmorLocked)
            this.gameState.state.equippedArmor = item;
        if (item.type === 'rune' && !this.gameState.state.isRuneLocked)
            this.gameState.state.equippedRune = item;
        if (item.type === 'skill' && !this.gameState.state.isSkillLocked)
            this.gameState.state.equippedSkill = item;
        if (item.type === 'unique_power' && !this.gameState.state.isUniquePowerLocked)
            this.gameState.state.equippedUniquePower = item;
        if (item.type === 'cutscene' && !this.gameState.state.isCutsceneLocked)
            this.gameState.state.equippedCutscene = item;
        if (item.type === 'mount' && !this.gameState.state.isMountLocked)
            this.gameState.state.equippedMount = item;
        if (item.type === 'porter' && !this.gameState.state.isPorterLocked)
            this.gameState.state.equippedPorter = item;
        if (item.type === 'companion' && !this.gameState.state.isPetLocked)
            this.gameState.equipPet(item);
        this.audio.playSound('click');
        this.ui.showToast(`⚡ Equipped ${item.name}!`, 'success');
        this.gameState.recalculateCP();
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
    }
    unequipItem(item) {
        this.unequipItemSilent(item);
        this.audio.playSound('click');
        this.ui.showToast(`❌ Unequipped ${item.name}!`, 'info');
        this.gameState.recalculateCP();
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
    }
    autoEquipHighestCP() {
        const inv = this.gameState.state.inventory || [];
        if (inv.length === 0) {
            this.ui.showToast('⚠️ Inventory is empty!', 'warning');
            return;
        }
        const jobClass = this.gameState.state.jobClass || 'WARRIOR';
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
        inv.forEach(item => {
            const itemCP = (item.cpBonus || 25) * (item.level || 1);
            if (item.type === 'weapon' && itemCP > maxWCP) {
                if (this.gameState.isWeaponAllowedForClass(jobClass, item)) {
                    maxWCP = itemCP;
                    bestWeapon = item;
                }
            }
            else if (item.type === 'armor' && itemCP > maxACP) {
                maxACP = itemCP;
                bestArmor = item;
            }
            else if (item.type === 'rune' && itemCP > maxRCP) {
                maxRCP = itemCP;
                bestRune = item;
            }
            else if (item.type === 'skill' && itemCP > maxSCP) {
                maxSCP = itemCP;
                bestSkill = item;
            }
            else if (item.type === 'unique_power' && itemCP > maxUPCP) {
                maxUPCP = itemCP;
                bestUniquePower = item;
            }
            else if (item.type === 'mount' && itemCP > maxMCP) {
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
        // Auto Equip Top 5 Best Companion Pets
        const pets = inv.filter(i => i.type === 'companion');
        if (pets.length > 0 && !this.gameState.state.isPetLocked) {
            pets.sort((a, b) => ((b.cpBonus || 45) * (b.level || 1)) - ((a.cpBonus || 45) * (a.level || 1)));
            this.gameState.state.equippedPets = pets.slice(0, 5);
            this.gameState.state.equippedPet = this.gameState.state.equippedPets[0] || null;
            equippedCount += this.gameState.state.equippedPets.length;
        }
        if (equippedCount > 0) {
            this.audio.playSound('levelup');
            this.ui.showToast(`⚡ Automatically Equipped Best Gear & PETS (${equippedCount} slots equipped)!`, 'success');
            this.gameState.recalculateCP();
            this.gameState.notify();
            this.gameState.saveToFirebase();
            this.renderInventory();
        }
        else {
            this.ui.showToast('⚠️ No unlocked slots or equipment/pets found to swap.', 'warning');
        }
    }
    buyPotion() {
        const cost = 100;
        if (this.gameState.state.gold < cost) {
            this.ui.showAlert('INSUFFICIENT GOLD', `Not enough Gold to buy HP Potion! Required: ${cost} 🪙`, '🪙', 'warning');
            return;
        }
        this.gameState.state.gold -= cost;
        const potion = this.gameState.state.inventory.find(i => i.type === 'consumable' && i.name.includes('Potion'));
        if (potion) {
            potion.count++;
        }
        else {
            this.gameState.state.inventory.push({
                id: `potion-${Date.now()}`,
                name: 'HP Potion',
                type: 'consumable',
                rarity: 'common',
                icon: '🧪',
                bonusHp: 30,
                cpBonus: 0,
                level: 1,
                count: 1,
                description: 'Restores +30 Health Points upon consumption.',
                isLocked: false
            });
        }
        this.audio.playSound('potion');
        this.ui.showToast('Purchased 1 HP Potion for 100 🪙!', 'success');
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.renderInventory();
    }
    usePotion(item, index) {
        if (this.gameState.state.hp >= this.gameState.state.maxHp) {
            this.ui.showToast('⚠️ Health is already at maximum!', 'warning');
            return;
        }
        this.gameState.state.hp = Math.min(this.gameState.state.maxHp, this.gameState.state.hp + 30);
        this.audio.playSound('potion');
        if (item) {
            item.count--;
            if (item.count <= 0) {
                this.gameState.state.inventory = this.gameState.state.inventory.filter(i => i.id !== item.id);
            }
        }
        this.gameState.notify();
        this.gameState.saveToFirebase();
        this.ui.showToast('Drank HP Potion (+30 HP)!', 'success');
        this.renderInventory();
    }
}
exports.InventoryScreen = InventoryScreen;
