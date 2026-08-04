import Phaser from 'phaser';

// =========================================================
// INPUT LOCK PLUGIN
// =========================================================
export function initializeInputLock(): void {
  window.addEventListener('wheel', (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
      e.preventDefault();
    }
  });

  window.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
}

// =========================================================
// SERVER MAINTENANCE EVENT CONTROL
// =========================================================
export interface GameEventState {
  isMaintenance: boolean;
  announcement: string;
}

export function handleServerEvents(state: GameEventState): void {
  const modal = document.getElementById('maintenance-overlay');
  const annText = document.getElementById('announcement-banner');

  if (annText && state.announcement) {
    annText.innerText = state.announcement;
  }

  if (modal) {
    if (state.isMaintenance) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}

// =========================================================
// CHARACTER PROGRESSION & TITLES
// =========================================================
export interface CharacterStats {
  level: number;
  jobClass: 'WARRIOR' | 'MAGE' | 'ARCHER' | 'SAMURAI' | 'ASSASSIN' | 'PALADIN' | 'NECROMANCER';
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

export function calculateCombatPower(stats: CharacterStats): number {
  const basePower = stats.level * 10;
  if (stats.jobClass === 'WARRIOR') return basePower + (stats.str * 4) + (stats.vit * 2);
  if (stats.jobClass === 'MAGE') return basePower + (stats.int * 5) + (stats.agi * 1);
  return basePower + (stats.agi * 4) + (stats.str * 2);
}

// =========================================================
// GAME PLACES & MODES
// =========================================================
export interface PlaceMode {
  id: 'DUNGEON' | 'IDLE' | 'TOWER';
  name: string;
  description: string;
}

export const GAME_PLACES: Record<string, PlaceMode> = {
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
export class EnemyRadar {
  private radarGraphics: Phaser.GameObjects.Graphics;
  private hpBarGraphics: Phaser.GameObjects.Graphics;
  public circle: Phaser.Geom.Circle;

  constructor(private scene: Phaser.Scene, public x: number, public y: number, public radius: number = 120) {
    this.circle = new Phaser.Geom.Circle(x, y, radius);
    this.radarGraphics = scene.add.graphics();
    this.hpBarGraphics = scene.add.graphics();
    this.drawRadar();
  }

  private drawRadar(): void {
    this.radarGraphics.clear();
    this.radarGraphics.lineStyle(2, 0x10b981, 0.4);
    this.radarGraphics.fillStyle(0x065f46, 0.15);
    this.radarGraphics.fillCircleShape(this.circle);
    this.radarGraphics.strokeCircleShape(this.circle);
  }

  public checkPlayerInRadar(px: number, py: number): boolean {
    return Phaser.Geom.Circle.Contains(this.circle, px, py);
  }

  public triggerHitVibration(target: Phaser.GameObjects.Sprite | Phaser.GameObjects.Shape): void {
    this.scene.tweens.add({
      targets: target,
      x: target.x + 6,
      duration: 40,
      yoyo: true,
      repeat: 3
    });
  }

  public updateHpBar(x: number, y: number, currentHp: number, maxHp: number, level: number): void {
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
