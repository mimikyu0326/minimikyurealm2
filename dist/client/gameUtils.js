"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyRadar = exports.GAME_PLACES = void 0;
exports.initializeInputLock = initializeInputLock;
exports.handleServerEvents = handleServerEvents;
exports.getClassTitle = getClassTitle;
exports.calculateCombatPower = calculateCombatPower;
const phaser_1 = __importDefault(require("phaser"));
// =========================================================
// INPUT LOCK PLUGIN
// =========================================================
function initializeInputLock() {
    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
            e.preventDefault();
        }
    });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
}
function handleServerEvents(state) {
    const modal = document.getElementById('maintenance-overlay');
    const annText = document.getElementById('announcement-banner');
    if (annText && state.announcement) {
        annText.innerText = state.announcement;
    }
    if (modal) {
        if (state.isMaintenance) {
            modal.classList.remove('hidden');
        }
        else {
            modal.classList.add('hidden');
        }
    }
}
function getClassTitle(jobClass, level) {
    const tier = Math.min(Math.floor(level / 10), 10);
    const titles = {
        WARRIOR: [
            "Apprentice Swordsman", "Novice Knight", "Steel Guard", "Vanguard Templar",
            "Swordmaster", "Champion Berserker", "High Warlord", "Mythic Guardian",
            "Grand Sovereign", "Godhand Blade", "Asura of the Sword"
        ],
        SAMURAI: [
            "Ronin Wanderer", "Kenshi Blade", "Shadow Katana", "Wind Slash Master",
            "Iaijutsu Master", "Flame Samurai", "Void Kenshin", "Celestial Bushido",
            "Sovereign Ronin", "Godhand Kensan", "Muramasa Asura"
        ],
        MAGE: [
            "Novice Initiate", "Elementalist", "Arcane Scholar", "High Sorcerer",
            "Spellweaver", "Archmage", "Astral Sage", "Void Sovereign",
            "Celestial Wizard", "Arcane Deity", "God of Magic"
        ],
        ARCHER: [
            "Trainee Scout", "Marksman", "Forest Ranger", "Deadeye Hunter",
            "Windrunner", "Sharpshooter", "Storm Sentinel", "Shadow Bow",
            "Phantom Pathfinder", "Artemis Ascendant", "Celestial Artemis"
        ]
    };
    return titles[jobClass]?.[tier] || "Novice Explorer";
}
function calculateCombatPower(stats) {
    const basePower = stats.level * 10;
    if (stats.jobClass === 'WARRIOR')
        return basePower + (stats.str * 4) + (stats.vit * 2);
    if (stats.jobClass === 'MAGE')
        return basePower + (stats.int * 5) + (stats.agi * 1);
    return basePower + (stats.agi * 4) + (stats.str * 2);
}
exports.GAME_PLACES = {
    DUNGEON: {
        id: 'DUNGEON',
        name: 'Emerald Dungeon',
        description: 'Active combat zone with aggressive enemies and armor drops.'
    },
    IDLE: {
        id: 'IDLE',
        name: 'Sanctuary Grove',
        description: 'Safe zone offering automated passive EXP over time.'
    },
    TOWER: {
        id: 'TOWER',
        name: 'Tower of Trial',
        description: 'Climb endless floors to test your Combat Power against bosses.'
    }
};
// =========================================================
// ENEMY RADAR & AGGRO
// =========================================================
class EnemyRadar {
    scene;
    x;
    y;
    radius;
    radarGraphics;
    hpBarGraphics;
    circle;
    constructor(scene, x, y, radius = 120) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.circle = new phaser_1.default.Geom.Circle(x, y, radius);
        this.radarGraphics = scene.add.graphics();
        this.hpBarGraphics = scene.add.graphics();
        this.drawRadar();
    }
    drawRadar() {
        this.radarGraphics.clear();
        this.radarGraphics.lineStyle(2, 0x10b981, 0.4);
        this.radarGraphics.fillStyle(0x065f46, 0.15);
        this.radarGraphics.fillCircleShape(this.circle);
        this.radarGraphics.strokeCircleShape(this.circle);
    }
    checkPlayerInRadar(px, py) {
        return phaser_1.default.Geom.Circle.Contains(this.circle, px, py);
    }
    triggerHitVibration(target) {
        this.scene.tweens.add({
            targets: target,
            x: target.x + 6,
            duration: 40,
            yoyo: true,
            repeat: 3
        });
    }
    updateHpBar(x, y, currentHp, maxHp, level) {
        this.hpBarGraphics.clear();
        const barWidth = 40;
        const barHeight = 6;
        const drawX = x - barWidth / 2;
        const drawY = y - 35;
        this.hpBarGraphics.fillStyle(0x064e3b, 0.8);
        this.hpBarGraphics.fillRect(drawX, drawY, barWidth, barHeight);
        const fillWidth = Math.max(0, (currentHp / maxHp) * barWidth);
        this.hpBarGraphics.fillStyle(0x10b981, 1);
        this.hpBarGraphics.fillRect(drawX, drawY, fillWidth, barHeight);
    }
}
exports.EnemyRadar = EnemyRadar;
