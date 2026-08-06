"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassTitle = getClassTitle;
exports.calculateCombatPower = calculateCombatPower;
function getClassTitle(jobClass, level) {
    const tier = Math.min(Math.floor(level / 10), 10);
    const titles = {
        WARRIOR: [
            "Apprentice Swordsman", "Novice Knight", "Steel Guard", "Vanguard Templar",
            "Swordmaster", "Champion Berserker", "High Warlord", "Mythic Guardian",
            "Grand Sovereign", "Godhand Blade", "Asura of the Sword"
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
