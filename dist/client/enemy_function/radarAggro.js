"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyRadar = void 0;
const phaser_1 = __importDefault(require("phaser"));
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
        this.radarGraphics.lineStyle(2, 0x10b981, 0.4); // Emerald Green Radar Ring
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
        // Background Bar
        this.hpBarGraphics.fillStyle(0x064e3b, 0.8);
        this.hpBarGraphics.fillRect(drawX, drawY, barWidth, barHeight);
        // HP Fill
        const fillWidth = Math.max(0, (currentHp / maxHp) * barWidth);
        this.hpBarGraphics.fillStyle(0x10b981, 1);
        this.hpBarGraphics.fillRect(drawX, drawY, fillWidth, barHeight);
    }
}
exports.EnemyRadar = EnemyRadar;
