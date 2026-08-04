export interface CharacterStats {
  level: number;
  jobClass: 'WARRIOR' | 'MAGE' | 'ARCHER';
  str: number;
  int: number;
  agi: number;
  vit: number;
  statPoints: number;
}

export function getClassTitle(jobClass: string, level: number): string {
  const tier = Math.min(Math.floor(level / 10), 10);
  
  const titles: Record<string, string[]> = {
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

export function calculateCombatPower(stats: CharacterStats): number {
  const basePower = stats.level * 10;
  if (stats.jobClass === 'WARRIOR') return basePower + (stats.str * 4) + (stats.vit * 2);
  if (stats.jobClass === 'MAGE') return basePower + (stats.int * 5) + (stats.agi * 1);
  return basePower + (stats.agi * 4) + (stats.str * 2);
}
