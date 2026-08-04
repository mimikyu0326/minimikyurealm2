import Phaser from 'phaser';

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
    this.radarGraphics.lineStyle(2, 0x10b981, 0.4); // Emerald Green Radar Ring
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

    // Background Bar
    this.hpBarGraphics.fillStyle(0x064e3b, 0.8);
    this.hpBarGraphics.fillRect(drawX, drawY, barWidth, barHeight);

    // HP Fill
    const fillWidth = Math.max(0, (currentHp / maxHp) * barWidth);
    this.hpBarGraphics.fillStyle(0x10b981, 1);
    this.hpBarGraphics.fillRect(drawX, drawY, fillWidth, barHeight);
  }
}
