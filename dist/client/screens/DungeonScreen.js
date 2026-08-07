"use strict";
// =========================================================
// DUNGEON SCREEN MODULE - FASTER AUTO SPEED, 10 MONSTER MINIMUM, WAVE WORLD TIER NOTICE, & 5 AUTOMATIC SKILLS
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonScreen = void 0;
const ScreenManager_1 = require("./ScreenManager");
const GameStateService_1 = require("../services/GameStateService");
const AudioService_1 = require("../services/AudioService");
const UIService_1 = require("../services/UIService");
class DungeonScreen {
    phaserGame = null;
    phaserScene = null;
    gameState = GameStateService_1.GameStateService.getInstance();
    audio = AudioService_1.AudioService.getInstance();
    ui = UIService_1.UIService.getInstance();
    isAutoBattle = false;
    joystickDx = 0;
    joystickDy = 0;
    constructor() { }
    setJoystickDirection(dx, dy) {
        this.joystickDx = dx;
        this.joystickDy = dy;
    }
    init() {
        const self = this;
        const Phaser = window.Phaser;
        if (!Phaser) {
            console.error('[DUNGEON] Phaser 3 framework not available.');
            return;
        }
        class MainGameScene extends Phaser.Scene {
            player;
            enemies;
            droppedItems;
            skeletonMinions;
            cursors;
            wasd;
            bgGrid;
            bgCastleSprite;
            spawnTimer = null;
            monsterAttackTimer = null;
            monsterAbilityTimer = null;
            autoBattleTimer = null;
            autoSkillTimer = null;
            locatorGraphics;
            rangeGraphics;
            pickupRangeGraphics;
            auraGraphics;
            enemyAuraGraphics;
            enemyCubeGraphics;
            skillGraphics;
            heroOverheadText;
            isDead = false;
            earthRotationAngleX = 0;
            earthRotationAngleY = 0;
            autoRoamAngle = 0;
            radarSweepAngle = 0;
            petLastAttackTimes = [];
            activeDamageTextCount = 0;
            activeExpPopupCount = 0;
            // Roll Dash Q Key variables
            lastDashTime = 0;
            lastUniquePowerTime = 0;
            isDashing = false;
            isHeroMoving = false;
            // Skill State variables
            spinningStonesAngle = 0;
            // Pet & Cutscene variables
            petSprite = null;
            petKillCount = 0;
            petState = 'hunting';
            isCutsceneActive = false;
            constructor() {
                super('MainGameScene');
            }
            preload() {
                this.createProceduralTextures();
            }
            createProceduralTextures() {
                // Brand New Satisfying Modern Anime Girl Sprite Textures
                const drawAnimeMurimGirl = (key, gownColor, accentColor) => {
                    const g = this.make.graphics({ x: 0, y: 0, add: false });
                    // 1. Pastel Pink Twintails & Hair Ties (Back Layer)
                    g.fillStyle(0xf472b6, 1);
                    g.fillCircle(10, 16, 9); // Left Twintail
                    g.fillCircle(38, 16, 9); // Right Twintail
                    g.fillTriangle(4, 16, 10, 34, 14, 18); // Left Hair Flow
                    g.fillTriangle(44, 16, 38, 34, 34, 18); // Right Hair Flow
                    g.fillStyle(0x581c87, 1);
                    g.fillCircle(11, 11, 3.5);
                    g.fillCircle(37, 11, 3.5); // Hair Ties
                    // 2. Stylish Modern Cyan Hoodie & Black Pleated Skirt Outfit
                    g.fillStyle(gownColor, 1);
                    g.fillRect(14, 18, 20, 22); // Hoodie Base
                    g.fillStyle(accentColor, 1);
                    g.fillRect(16, 18, 16, 22); // Hoodie Zipper Line
                    g.fillStyle(0x18181b, 1);
                    g.fillRect(14, 30, 20, 10); // Black Pleated Skirt
                    g.fillStyle(0xfbbf24, 1);
                    g.fillRect(14, 29, 20, 2); // Gold Belt Accent
                    // 3. Cute Porcelain Soft Anime Face & Hair Bangs
                    g.fillStyle(0xffe4e6, 1);
                    g.fillCircle(24, 13, 10); // Face
                    g.fillStyle(0xf472b6, 1);
                    g.fillCircle(24, 8, 10.5); // Crown Hair
                    g.fillStyle(0xf472b6, 1);
                    g.fillTriangle(15, 10, 20, 16, 18, 7); // Anime Side Bangs
                    g.fillStyle(0xf472b6, 1);
                    g.fillTriangle(33, 10, 28, 16, 30, 7);
                    // 4. Large Expressive Cyan Eyes & Soft Blush
                    g.fillStyle(0xf43f5e, 0.45);
                    g.fillCircle(17, 15, 2.5);
                    g.fillCircle(31, 15, 2.5); // Soft Blush
                    g.fillStyle(0x06b6d4, 1);
                    g.fillCircle(19, 13, 3);
                    g.fillCircle(29, 13, 3); // Cyan Anime Eyes
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(18, 12, 1.2);
                    g.fillCircle(28, 12, 1.2); // Highlights
                    // 5. Yellow Star Hair Clip & Scabbard Sheath
                    g.fillStyle(0xfbbf24, 1);
                    g.fillCircle(12, 9, 3);
                    g.fillCircle(36, 9, 3); // Star Clips
                    g.fillStyle(0x78350f, 1);
                    g.fillRect(32, 22, 12, 5); // Sheath
                    g.fillStyle(0xfbbf24, 1);
                    g.fillRect(30, 21, 3, 7);
                    g.generateTexture(key, 48, 48);
                };
                drawAnimeMurimGirl('chibi_warrior_m', 0x0284c7, 0x38bdf8);
                drawAnimeMurimGirl('chibi_warrior_f', 0x0284c7, 0x38bdf8);
                drawAnimeMurimGirl('chibi_samurai_m', 0x064e3b, 0x10b981);
                drawAnimeMurimGirl('chibi_samurai_f', 0x064e3b, 0x10b981);
                // Telekinetic Flying Sword Texture (Massive Mythic Qi Sword Blade with Gold Pommel & Cyan Aura Flame)
                const gFlyingSword = this.make.graphics({ x: 0, y: 0, add: false });
                gFlyingSword.lineStyle(12, 0x06b6d4, 0.45);
                gFlyingSword.lineBetween(8, 24, 54, 24); // Cyan Outer Aura
                gFlyingSword.lineStyle(8, 0x0284c7, 0.95);
                gFlyingSword.lineBetween(8, 24, 52, 24); // Deep Blue Blade
                gFlyingSword.lineStyle(4, 0xffffff, 1);
                gFlyingSword.lineBetween(8, 24, 52, 24); // White Sharp Core Edge
                gFlyingSword.fillStyle(0xffffff, 1);
                gFlyingSword.fillTriangle(48, 16, 62, 24, 48, 32); // Blade Tip
                gFlyingSword.fillStyle(0xfbbf24, 1);
                gFlyingSword.fillRect(8, 16, 6, 16); // Gold Guard Hilt
                gFlyingSword.fillStyle(0x78350f, 1);
                gFlyingSword.fillRect(0, 21, 9, 6); // Leather Handle Grip
                gFlyingSword.fillStyle(0xf59e0b, 1);
                gFlyingSword.fillCircle(0, 24, 4); // Gold Pommel Jewel
                gFlyingSword.generateTexture('flying_sword_sprite', 64, 48);
                const gMageM = this.make.graphics({ x: 0, y: 0, add: false });
                gMageM.fillStyle(0x2563eb, 1);
                gMageM.fillRect(14, 18, 20, 22);
                gMageM.fillStyle(0xffd1b3, 1);
                gMageM.fillCircle(24, 14, 11);
                gMageM.fillStyle(0x1d4ed8, 1);
                gMageM.fillCircle(20, 13, 2.5);
                gMageM.fillCircle(28, 13, 2.5);
                gMageM.fillStyle(0xffffff, 1);
                gMageM.fillCircle(19, 12, 1);
                gMageM.fillCircle(27, 12, 1);
                gMageM.fillStyle(0xf1f5f9, 1);
                gMageM.fillTriangle(17, 18, 31, 18, 24, 30);
                gMageM.fillStyle(0x1e40af, 1);
                gMageM.fillTriangle(8, 8, 40, 8, 24, -5);
                gMageM.lineStyle(3, 0x78350f, 1);
                gMageM.lineBetween(36, 38, 36, 2);
                gMageM.fillStyle(0x38bdf8, 1);
                gMageM.fillCircle(36, 2, 7);
                gMageM.generateTexture('chibi_mage_m', 48, 48);
                const gMageF = this.make.graphics({ x: 0, y: 0, add: false });
                gMageF.fillStyle(0x2563eb, 1);
                gMageF.fillRect(14, 18, 20, 22);
                gMageF.fillStyle(0x1e1b4b, 1);
                gMageF.fillCircle(24, 16, 14);
                gMageF.fillStyle(0xffd1b3, 1);
                gMageF.fillCircle(24, 14, 10);
                gMageF.fillStyle(0x38bdf8, 1);
                gMageF.fillCircle(20, 13, 2.5);
                gMageF.fillCircle(28, 13, 2.5);
                gMageF.fillStyle(0xffffff, 1);
                gMageF.fillCircle(19, 12, 1);
                gMageF.fillCircle(27, 12, 1);
                gMageF.fillStyle(0x1e40af, 1);
                gMageF.fillTriangle(8, 8, 40, 8, 24, -5);
                gMageF.lineStyle(3, 0x78350f, 1);
                gMageF.lineBetween(36, 38, 36, 2);
                gMageF.fillStyle(0x38bdf8, 1);
                gMageF.fillCircle(36, 2, 7);
                gMageF.generateTexture('chibi_mage_f', 48, 48);
                const gArcherM = this.make.graphics({ x: 0, y: 0, add: false });
                gArcherM.fillStyle(0x059669, 1);
                gArcherM.fillRect(14, 18, 20, 22);
                gArcherM.fillStyle(0xffd1b3, 1);
                gArcherM.fillCircle(24, 14, 11);
                gArcherM.fillStyle(0x064e3b, 1);
                gArcherM.fillCircle(20, 13, 2.5);
                gArcherM.fillCircle(28, 13, 2.5);
                gArcherM.fillStyle(0xffffff, 1);
                gArcherM.fillCircle(19, 12, 1);
                gArcherM.fillCircle(27, 12, 1);
                gArcherM.fillStyle(0x451a03, 1);
                gArcherM.fillRect(19, 17, 10, 3);
                gArcherM.fillStyle(0x047857, 1);
                gArcherM.fillTriangle(10, 10, 38, 10, 24, 1);
                gArcherM.fillStyle(0xef4444, 1);
                gArcherM.fillTriangle(32, 4, 40, 0, 34, 8);
                gArcherM.lineStyle(3, 0xd97706, 1);
                gArcherM.strokeTriangle(34, 10, 46, 24, 34, 38);
                gArcherM.generateTexture('chibi_archer_m', 48, 48);
                const gArcherF = this.make.graphics({ x: 0, y: 0, add: false });
                gArcherF.fillStyle(0x059669, 1);
                gArcherF.fillRect(14, 18, 20, 22);
                gArcherF.fillStyle(0xb45309, 1);
                gArcherF.fillCircle(24, 16, 14);
                gArcherF.fillStyle(0xffd1b3, 1);
                gArcherF.fillCircle(24, 14, 10);
                gArcherF.fillStyle(0x059669, 1);
                gArcherF.fillCircle(20, 13, 2.5);
                gArcherF.fillCircle(28, 13, 2.5);
                gArcherF.fillStyle(0xffffff, 1);
                gArcherF.fillCircle(19, 12, 1);
                gArcherF.fillCircle(27, 12, 1);
                gArcherF.fillStyle(0x047857, 1);
                gArcherF.fillTriangle(10, 10, 38, 10, 24, 1);
                gArcherF.lineStyle(3, 0xd97706, 1);
                gArcherF.strokeTriangle(34, 10, 46, 24, 34, 38);
                gArcherF.generateTexture('chibi_archer_f', 48, 48);
                // Japanese Samurai Textures (Male & Female)
                const gSamuraiM = this.make.graphics({ x: 0, y: 0, add: false });
                gSamuraiM.fillStyle(0x991b1b, 1);
                gSamuraiM.fillRect(14, 18, 20, 22);
                gSamuraiM.fillStyle(0xffd1b3, 1);
                gSamuraiM.fillCircle(24, 14, 11);
                gSamuraiM.fillStyle(0x7f1d1d, 1);
                gSamuraiM.fillCircle(20, 13, 2.5);
                gSamuraiM.fillCircle(28, 13, 2.5);
                gSamuraiM.fillStyle(0xffffff, 1);
                gSamuraiM.fillCircle(19, 12, 1);
                gSamuraiM.fillCircle(27, 12, 1);
                // Samurai Golden Kabuto Helmet & Horns
                gSamuraiM.fillStyle(0x18181b, 1);
                gSamuraiM.fillRect(12, 2, 24, 8);
                gSamuraiM.fillStyle(0xfbbf24, 1);
                gSamuraiM.fillTriangle(10, 2, 24, -6, 38, 2);
                // Katana Blade
                gSamuraiM.lineStyle(4, 0xf8fafc, 1);
                gSamuraiM.lineBetween(32, 26, 48, 4);
                gSamuraiM.lineStyle(2, 0xf59e0b, 1);
                gSamuraiM.lineBetween(32, 26, 48, 4);
                gSamuraiM.generateTexture('chibi_samurai_m', 48, 48);
                const gSamuraiF = this.make.graphics({ x: 0, y: 0, add: false });
                gSamuraiF.fillStyle(0x831843, 1);
                gSamuraiF.fillRect(14, 18, 20, 22);
                gSamuraiF.fillStyle(0x18181b, 1);
                gSamuraiF.fillCircle(24, 16, 14);
                gSamuraiF.fillStyle(0xffd1b3, 1);
                gSamuraiF.fillCircle(24, 14, 10);
                gSamuraiF.fillStyle(0xbe185d, 1);
                gSamuraiF.fillCircle(20, 13, 2.5);
                gSamuraiF.fillCircle(28, 13, 2.5);
                gSamuraiF.fillStyle(0xffffff, 1);
                gSamuraiF.fillCircle(19, 12, 1);
                gSamuraiF.fillCircle(27, 12, 1);
                // Cherry Blossom Hair Ornament & Dual Katana
                gSamuraiF.fillStyle(0xf472b6, 1);
                gSamuraiF.fillCircle(14, 6, 5);
                gSamuraiF.lineStyle(3, 0xf8fafc, 1);
                gSamuraiF.lineBetween(32, 24, 46, 6);
                gSamuraiF.generateTexture('chibi_samurai_f', 48, 48);
                // Projectile Katana Beam
                const gKatanaBeam = this.make.graphics({ x: 0, y: 0, add: false });
                gKatanaBeam.lineStyle(8, 0xf59e0b, 0.9);
                gKatanaBeam.lineBetween(0, 10, 48, 10);
                gKatanaBeam.lineStyle(4, 0xffffff, 1);
                gKatanaBeam.lineBetween(0, 10, 48, 10);
                gKatanaBeam.generateTexture('proj_katana_beam', 52, 20);
                // 10 UNIQUE BEAST & CELESTIAL COMPANION GRAPHICS TEXTURES
                const drawPetTexture = (key, drawFn) => {
                    const g = this.make.graphics({ x: 0, y: 0, add: false });
                    drawFn(g);
                    g.generateTexture(key, 48, 48);
                };
                // 1. Flame Drake 🐲
                drawPetTexture('pet_flame_drake', g => {
                    g.fillStyle(0xd97706, 1);
                    g.fillCircle(24, 26, 16);
                    g.fillStyle(0xef4444, 1);
                    g.fillTriangle(6, 20, 18, 14, 12, 34);
                    g.fillTriangle(42, 20, 30, 14, 36, 34);
                    g.fillStyle(0xfbbf24, 1);
                    g.fillTriangle(18, 14, 22, 4, 24, 14);
                    g.fillTriangle(30, 14, 26, 4, 24, 14);
                    g.fillStyle(0xfef08a, 1);
                    g.fillCircle(18, 22, 3.5);
                    g.fillCircle(30, 22, 3.5);
                    g.fillStyle(0x000000, 1);
                    g.fillCircle(18, 22, 1.5);
                    g.fillCircle(30, 22, 1.5);
                });
                // 2. Thunder Kitsune ⚡
                drawPetTexture('pet_thunder_kitsune', g => {
                    g.fillStyle(0x0284c7, 1);
                    g.fillCircle(24, 26, 15);
                    g.fillStyle(0x38bdf8, 1);
                    g.fillTriangle(10, 20, 18, 6, 22, 22);
                    g.fillTriangle(38, 20, 30, 6, 26, 22);
                    g.fillStyle(0xe0f2fe, 1);
                    g.fillTriangle(12, 18, 18, 10, 20, 20);
                    g.fillTriangle(36, 18, 30, 10, 28, 20);
                    g.fillStyle(0x38bdf8, 1);
                    g.fillCircle(10, 34, 6);
                    g.fillCircle(38, 34, 6);
                    g.fillCircle(24, 40, 7);
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(18, 24, 3);
                    g.fillCircle(30, 24, 3);
                });
                // 3. Void Behemoth 🌌
                drawPetTexture('pet_void_behemoth', g => {
                    g.fillStyle(0x581c87, 0.9);
                    g.fillCircle(24, 24, 18);
                    g.fillStyle(0x7e22ce, 1);
                    g.fillCircle(24, 24, 12);
                    g.fillStyle(0xc084fc, 1);
                    g.fillCircle(24, 24, 7);
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(24, 24, 3);
                    g.lineStyle(3, 0xa855f7, 0.9);
                    g.strokeCircle(24, 24, 21);
                });
                // 4. Ice Fenrir 🐺
                drawPetTexture('pet_ice_fenrir', g => {
                    g.fillStyle(0x1e3a8a, 1);
                    g.fillCircle(24, 26, 16);
                    g.fillStyle(0x60a5fa, 1);
                    g.fillTriangle(8, 18, 16, 4, 22, 22);
                    g.fillTriangle(40, 18, 32, 4, 26, 22);
                    g.fillStyle(0x93c5fd, 1);
                    g.fillTriangle(24, 8, 20, 2, 28, 2);
                    g.fillStyle(0x38bdf8, 1);
                    g.fillCircle(18, 24, 3.5);
                    g.fillCircle(30, 24, 3.5);
                });
                // 5. Golden Gryphon 🦅
                drawPetTexture('pet_golden_gryphon', g => {
                    g.fillStyle(0xd97706, 1);
                    g.fillCircle(24, 26, 16);
                    g.fillStyle(0xfbbf24, 1);
                    g.fillTriangle(4, 20, 18, 10, 14, 36);
                    g.fillTriangle(44, 20, 30, 10, 34, 36);
                    g.fillStyle(0xfef08a, 1);
                    g.fillTriangle(20, 24, 28, 24, 24, 36);
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(18, 20, 3.5);
                    g.fillCircle(30, 20, 3.5);
                });
                // 6. Abyssal Kraken 🐙
                drawPetTexture('pet_abyssal_kraken', g => {
                    g.fillStyle(0x0f766e, 1);
                    g.fillCircle(24, 20, 16);
                    g.fillStyle(0x14b8a6, 1);
                    g.fillCircle(10, 36, 5);
                    g.fillCircle(18, 38, 5);
                    g.fillCircle(24, 40, 5);
                    g.fillCircle(30, 38, 5);
                    g.fillCircle(38, 36, 5);
                    g.fillStyle(0xccfbf1, 1);
                    g.fillCircle(18, 18, 4);
                    g.fillCircle(30, 18, 4);
                    g.fillStyle(0x0f172a, 1);
                    g.fillCircle(18, 18, 2);
                    g.fillCircle(30, 18, 2);
                });
                // 7. Mecha Sentinel 🤖
                drawPetTexture('pet_mecha_sentinel', g => {
                    g.fillStyle(0x334155, 1);
                    g.fillRect(12, 12, 24, 24);
                    g.lineStyle(3, 0x06b6d4, 1);
                    g.strokeCircle(24, 24, 18);
                    g.fillStyle(0x06b6d4, 1);
                    g.fillRect(16, 20, 16, 6);
                    g.fillStyle(0xffffff, 1);
                    g.fillRect(18, 21, 12, 4);
                });
                // 8. Star Unicorn 🦄
                drawPetTexture('pet_star_unicorn', g => {
                    g.fillStyle(0xf472b6, 1);
                    g.fillCircle(24, 26, 15);
                    g.fillStyle(0xfbbf24, 1);
                    g.fillTriangle(20, 14, 28, 14, 24, -2);
                    g.fillStyle(0xbe185d, 1);
                    g.fillTriangle(10, 16, 16, 6, 20, 20);
                    g.fillTriangle(38, 16, 32, 6, 28, 20);
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(18, 24, 3.5);
                    g.fillCircle(30, 24, 3.5);
                });
                // 9. Sunfire Lion 🦁
                drawPetTexture('pet_sunfire_lion', g => {
                    g.fillStyle(0xf59e0b, 1);
                    g.fillCircle(24, 24, 20);
                    g.fillStyle(0x78350f, 1);
                    g.fillCircle(24, 24, 14);
                    g.fillStyle(0xfbbf24, 1);
                    g.fillCircle(24, 24, 10);
                    g.fillStyle(0x000000, 1);
                    g.fillCircle(19, 21, 2.5);
                    g.fillCircle(29, 21, 2.5);
                });
                // 10. Emerald Serpent 🐉
                drawPetTexture('pet_emerald_serpent', g => {
                    g.fillStyle(0x047857, 1);
                    g.fillCircle(24, 24, 17);
                    g.fillStyle(0x34d399, 1);
                    g.fillCircle(24, 24, 12);
                    g.fillStyle(0xa7f3d0, 1);
                    g.fillTriangle(14, 8, 20, 8, 16, 2);
                    g.fillTriangle(34, 8, 28, 8, 32, 2);
                    g.fillStyle(0xffffff, 1);
                    g.fillCircle(18, 22, 3);
                    g.fillCircle(30, 22, 3);
                });
                // 10 Monster Textures
                const generateMonster = (key, baseColor, accentColor, isBoss = false) => {
                    const size = isBoss ? 72 : 48;
                    const g = this.make.graphics({ x: 0, y: 0, add: false });
                    g.fillStyle(baseColor, 1);
                    g.fillCircle(size / 2, size / 2, (size / 2) - 4);
                    g.fillStyle(accentColor, 1);
                    g.fillCircle(size / 2 - 8, size / 2 - 4, 5);
                    g.fillCircle(size / 2 + 8, size / 2 - 4, 5);
                    if (isBoss) {
                        g.fillStyle(0xfbbf24, 1);
                        g.fillTriangle(size / 2 - 14, 10, size / 2 + 14, 10, size / 2, 0);
                    }
                    g.generateTexture(key, size, size);
                };
                generateMonster('m_slime_emerald', 0x10b981, 0xffffff);
                generateMonster('m_slime_ruby', 0xef4444, 0xffffff);
                generateMonster('m_goblin', 0x84cc16, 0x15803d);
                generateMonster('m_drake', 0xf97316, 0xfbbf24);
                generateMonster('m_skeleton', 0x94a3b8, 0x0f172a);
                generateMonster('m_beholder', 0x8b5cf6, 0x06b6d4);
                generateMonster('m_demon', 0x06b6d4, 0x3b82f6);
                generateMonster('m_golem', 0x78350f, 0xf59e0b);
                generateMonster('m_wyvern', 0x475569, 0xef4444);
                generateMonster('m_dragon_boss', 0xa855f7, 0xfbbf24, true);
                // 2 MONSTROUS BOSS TYPE ENEMIES (72x72 Big Monstrous Looks & 5x HP)
                const gBossDemon = this.make.graphics({ x: 0, y: 0, add: false });
                gBossDemon.fillStyle(0x7f1d1d, 1);
                gBossDemon.fillCircle(36, 36, 30);
                gBossDemon.fillStyle(0xef4444, 1);
                gBossDemon.fillCircle(36, 36, 22);
                gBossDemon.fillStyle(0xfbbf24, 1);
                gBossDemon.fillCircle(24, 28, 6);
                gBossDemon.fillCircle(48, 28, 6);
                gBossDemon.fillStyle(0x000000, 1);
                gBossDemon.fillCircle(24, 28, 3);
                gBossDemon.fillCircle(48, 28, 3);
                gBossDemon.fillStyle(0xd97706, 1);
                gBossDemon.fillTriangle(14, 24, 22, 10, 10, 6);
                gBossDemon.fillTriangle(58, 24, 50, 10, 62, 6);
                gBossDemon.fillStyle(0xffffff, 1);
                gBossDemon.fillTriangle(26, 44, 30, 44, 28, 52);
                gBossDemon.fillTriangle(42, 44, 46, 44, 44, 52);
                gBossDemon.generateTexture('boss_infernal_demon', 72, 72);
                const gBossBehemoth = this.make.graphics({ x: 0, y: 0, add: false });
                gBossBehemoth.fillStyle(0x4c1d95, 1);
                gBossBehemoth.fillCircle(36, 36, 32);
                gBossBehemoth.fillStyle(0x8b5cf6, 1);
                gBossBehemoth.fillCircle(36, 36, 24);
                gBossBehemoth.fillStyle(0x06b6d4, 1);
                gBossBehemoth.fillCircle(24, 28, 7);
                gBossBehemoth.fillCircle(48, 28, 7);
                gBossBehemoth.fillStyle(0xffffff, 1);
                gBossBehemoth.fillCircle(24, 28, 3);
                gBossBehemoth.fillCircle(48, 28, 3);
                gBossBehemoth.fillStyle(0x06b6d4, 1);
                gBossBehemoth.fillTriangle(36, 6, 28, 18, 44, 18);
                gBossBehemoth.fillTriangle(16, 14, 12, 28, 26, 22);
                gBossBehemoth.fillTriangle(56, 14, 60, 28, 46, 22);
                gBossBehemoth.generateTexture('boss_abyssal_behemoth', 72, 72);
                // Skeleton Minion (Skull 💀 Icon Pet)
                const gSkely = this.make.graphics({ x: 0, y: 0, add: false });
                gSkely.fillStyle(0xf8fafc, 1);
                gSkely.fillCircle(18, 16, 14);
                gSkely.fillStyle(0x0f172a, 1);
                gSkely.fillCircle(12, 14, 3.5);
                gSkely.fillCircle(24, 14, 3.5);
                gSkely.fillRect(14, 24, 8, 4);
                gSkely.generateTexture('skely_minion', 36, 36);
                // Wind Gust Texture
                const gWind = this.make.graphics({ x: 0, y: 0, add: false });
                gWind.lineStyle(2, 0xffffff, 0.8);
                gWind.arc(12, 12, 10, -0.6, 0.6, false);
                gWind.generateTexture('wind_gust', 24, 24);
                // Remodeled Glowing 3D Elemental Item Drops
                const gRune = this.make.graphics({ x: 0, y: 0, add: false });
                gRune.fillStyle(0xfbbf24, 1);
                gRune.fillCircle(16, 16, 12);
                gRune.fillStyle(0xec4899, 1);
                gRune.fillCircle(16, 16, 8);
                gRune.lineStyle(2, 0xffffff, 1);
                gRune.strokeCircle(16, 16, 14);
                gRune.generateTexture('drop_rune', 32, 32);
                const gKey = this.make.graphics({ x: 0, y: 0, add: false });
                gKey.fillStyle(0xfbbf24, 1);
                gKey.fillCircle(16, 10, 8);
                gKey.lineStyle(4, 0xfbbf24, 1);
                gKey.lineBetween(16, 18, 16, 28);
                gKey.lineBetween(16, 24, 22, 24);
                gKey.generateTexture('drop_key', 32, 32);
                // Projectiles
                const gSlash = this.make.graphics({ x: 0, y: 0, add: false });
                gSlash.lineStyle(6, 0x10b981, 1);
                gSlash.arc(18, 18, 16, -0.8, 0.8, false);
                gSlash.generateTexture('proj_slash', 36, 36);
                const gOrb = this.make.graphics({ x: 0, y: 0, add: false });
                gOrb.fillStyle(0xef4444, 1);
                gOrb.fillCircle(12, 12, 10);
                gOrb.lineStyle(3, 0xfbbf24, 1);
                gOrb.strokeCircle(12, 12, 12);
                gOrb.generateTexture('proj_orb', 24, 24);
                const gArrow = this.make.graphics({ x: 0, y: 0, add: false });
                // Glowing Emerald & Amber Arrow Shaft with Outer Aura
                gArrow.lineStyle(10, 0x34d399, 0.4);
                gArrow.lineBetween(0, 18, 56, 18); // Trailing Aura
                gArrow.lineStyle(6, 0x10b981, 1);
                gArrow.lineBetween(4, 18, 56, 18); // Main Shaft
                gArrow.lineStyle(3, 0xffffff, 1);
                gArrow.lineBetween(10, 18, 56, 18); // White Core Shaft
                // Massive Glowing Arrowhead
                gArrow.fillStyle(0xfbbf24, 1);
                gArrow.fillTriangle(44, 4, 64, 18, 44, 32);
                gArrow.fillStyle(0xffffff, 1);
                gArrow.fillTriangle(48, 8, 62, 18, 48, 28);
                // Feather Fletching
                gArrow.fillStyle(0x34d399, 1);
                gArrow.fillTriangle(0, 4, 12, 18, 0, 18);
                gArrow.fillTriangle(0, 32, 12, 18, 0, 18);
                gArrow.generateTexture('proj_arrow', 64, 36);
                // DYNAMIC MOUNT TEXTURES (CHARACTER RIDING ON TOP IN DUNGEON)
                const gDragon = this.make.graphics({ x: 0, y: 0, add: false });
                gDragon.fillStyle(0xd97706, 1);
                gDragon.fillEllipse(32, 34, 46, 24); // Body
                gDragon.fillStyle(0xef4444, 1);
                gDragon.fillTriangle(44, 20, 60, 16, 52, 32); // Dragon Head
                gDragon.fillStyle(0xfbbf24, 1);
                gDragon.fillCircle(54, 20, 3); // Eye
                gDragon.fillStyle(0xb91c1c, 1);
                gDragon.fillTriangle(20, 24, 6, 8, 36, 16); // Left Wing
                gDragon.fillStyle(0xb91c1c, 1);
                gDragon.fillTriangle(20, 24, 6, 44, 36, 32); // Right Wing
                gDragon.fillStyle(0xef4444, 1);
                gDragon.fillTriangle(14, 32, 0, 36, 18, 38); // Spiked Tail
                gDragon.fillStyle(0x78350f, 1);
                gDragon.fillRect(24, 24, 16, 14); // Saddle
                gDragon.lineStyle(2, 0xfbbf24, 1);
                gDragon.strokeRect(24, 24, 16, 14);
                gDragon.generateTexture('mount_flame_dragon', 64, 64);
                const gStallion = this.make.graphics({ x: 0, y: 0, add: false });
                gStallion.fillStyle(0x1e3a8a, 1);
                gStallion.fillEllipse(32, 34, 42, 22); // Horse Body
                gStallion.fillStyle(0x3b82f6, 1);
                gStallion.fillRect(44, 18, 10, 20); // Neck
                gStallion.fillStyle(0x60a5fa, 1);
                gStallion.fillTriangle(44, 18, 60, 14, 52, 26); // Head
                gStallion.fillStyle(0x38bdf8, 1);
                gStallion.fillTriangle(34, 10, 48, 12, 40, 22); // Electric Mane
                gStallion.fillStyle(0x0284c7, 1);
                gStallion.fillRect(16, 42, 5, 14);
                gStallion.fillRect(38, 42, 5, 14); // Hooves
                gStallion.fillStyle(0x78350f, 1);
                gStallion.fillRect(24, 24, 16, 14); // Saddle
                gStallion.lineStyle(2, 0x38bdf8, 1);
                gStallion.strokeRect(24, 24, 16, 14);
                gStallion.generateTexture('mount_thunder_stallion', 64, 64);
                const gPhoenix = this.make.graphics({ x: 0, y: 0, add: false });
                gPhoenix.fillStyle(0xd97706, 1);
                gPhoenix.fillEllipse(32, 34, 40, 22); // Phoenix Body
                gPhoenix.fillStyle(0xfbbf24, 1);
                gPhoenix.fillTriangle(42, 22, 58, 18, 48, 30); // Bird Head
                gPhoenix.fillStyle(0xf59e0b, 1);
                gPhoenix.fillTriangle(22, 26, 4, 6, 36, 18); // Left Feather Wing
                gPhoenix.fillStyle(0xf59e0b, 1);
                gPhoenix.fillTriangle(22, 26, 4, 46, 36, 34); // Right Feather Wing
                gPhoenix.fillStyle(0xfbbf24, 1);
                gPhoenix.fillTriangle(16, 32, 0, 22, 0, 42); // Golden Feather Tail
                gPhoenix.fillStyle(0x78350f, 1);
                gPhoenix.fillRect(24, 24, 16, 14); // Saddle
                gPhoenix.lineStyle(2, 0xfbbf24, 1);
                gPhoenix.strokeRect(24, 24, 16, 14);
                gPhoenix.generateTexture('mount_celestial_phoenix', 64, 64);
                const gDrake = this.make.graphics({ x: 0, y: 0, add: false });
                gDrake.fillStyle(0x311042, 1);
                gDrake.fillEllipse(32, 34, 44, 26); // Void Body
                gDrake.fillStyle(0x6b21a8, 1);
                gDrake.fillTriangle(44, 20, 60, 16, 52, 32); // Drake Head
                gDrake.fillStyle(0xc084fc, 1);
                gDrake.fillCircle(54, 20, 3); // Eye
                gDrake.fillStyle(0x581c87, 1);
                gDrake.fillTriangle(20, 24, 4, 6, 36, 16); // Left Void Wing
                gDrake.fillStyle(0x581c87, 1);
                gDrake.fillTriangle(20, 24, 4, 46, 36, 32); // Right Void Wing
                gDrake.fillStyle(0xa855f7, 1);
                gDrake.fillTriangle(14, 32, 0, 36, 18, 38); // Tail
                gDrake.fillStyle(0x1e1b4b, 1);
                gDrake.fillRect(24, 24, 16, 14); // Saddle
                gDrake.lineStyle(2, 0xa855f7, 1);
                gDrake.strokeRect(24, 24, 16, 14);
                gDrake.generateTexture('mount_void_drake', 64, 64);
                this.load.image('dungeon_ruin_castle_bg', 'assets/dungeon_ruin_castle_bg.jpg');
            }
            create() {
                self.phaserScene = this;
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                this.bgCastleSprite = this.add.image(width / 2, height / 2, 'dungeon_ruin_castle_bg').setDepth(0);
                this.bgCastleSprite.setDisplaySize(width * 1.6, height * 1.6);
                // DARK BLACK & WHITE MONOCHROME DESIGN (DARKER & NON-INTRUSIVE FOR GAMEPLAY)
                this.bgCastleSprite.setTint(0x384252);
                this.bgCastleSprite.setAlpha(0.70);
                this.bgGrid = this.add.graphics().setDepth(1);
                this.rangeGraphics = this.add.graphics().setDepth(2);
                this.pickupRangeGraphics = this.add.graphics().setDepth(3);
                this.auraGraphics = this.add.graphics().setDepth(5);
                this.enemyAuraGraphics = this.add.graphics().setDepth(6);
                this.skillGraphics = this.add.graphics().setDepth(8);
                const spriteKey = this.getHeroSpriteKey();
                this.mountSprite = this.add.sprite(width / 2, (height / 2) + 10, 'mount_flame_dragon').setDepth(9);
                this.mountSprite.setScale(2.4);
                this.mountSprite.setVisible(false);
                this.player = this.add.sprite(width / 2, height / 2, spriteKey).setDepth(10);
                this.player.setScale(2.0);
                this.flyingSwordSprite = this.add.sprite((width / 2) + 22, (height / 2) + 4, 'flying_sword_sprite').setDepth(15);
                this.flyingSwordSprite.setScale(1.7);
                // OVERHEAD FLOATING HERO TITLE & REIN BANNER (PLAIN, CLEAN & EASY TO READ SANS-SERIF FONT)
                this.heroOverheadText = this.add.text(width / 2, (height / 2) - 65, '', {
                    fontFamily: "Arial, Helvetica, 'Segoe UI', sans-serif",
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: '#facc15',
                    stroke: '#000000',
                    strokeThickness: 3.5
                }).setOrigin(0.5).setDepth(110);
                // HIGHER OVERHEAD FLOATING AUTO-SAVE STATUS BADGE WITH ICON (HIGHER THAN TITLE TEXT)
                this.heroAutosaveText = this.add.text(width / 2, (height / 2) - 90, '', {
                    fontFamily: "Arial, Helvetica, 'Segoe UI', sans-serif",
                    fontSize: '11px',
                    fontStyle: 'bold',
                    color: '#34d399',
                    stroke: '#000000',
                    strokeThickness: 3.5,
                    backgroundColor: 'rgba(2, 6, 23, 0.88)',
                    padding: { x: 8, y: 3 }
                }).setOrigin(0.5).setDepth(115).setAlpha(0);
                // BREATHING ANIMATION SYNCED AS ONE UNIFIED UNIT (PLAYER & MOUNT)
                this.tweens.add({
                    targets: [this.player, this.mountSprite],
                    scaleY: 2.1,
                    duration: 900,
                    yoyo: true,
                    repeat: -1
                });
                this.enemies = this.add.group();
                this.droppedItems = this.add.group();
                this.skeletonMinions = this.add.group();
                // PORTER FOLLOWER & AUTOMATIC ITEM MAGNET GRAPHICS (DEPTH 15 & 16)
                this.porterGraphics = this.add.graphics().setDepth(15);
                this.porterText = this.add.text(width / 2 - 45, height / 2 + 20, '', {
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: '11px',
                    fontStyle: 'bold',
                    color: '#facc15',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setOrigin(0.5).setDepth(16);
                // LOCATOR & HEALTH BARS ALWAYS DRAWN ON TOP OF ALL ENTITIES (DEPTH 100)
                this.locatorGraphics = this.add.graphics().setDepth(100);
                window.toggleAscendWarningModal = (show) => {
                    const modal = document.getElementById('modal-ascend-warning');
                    if (!modal)
                        return;
                    if (show) {
                        if (self.gameState.state.level < 21) {
                            self.ui.showToast(`⚠️ Level 21+ required to ascend Mountain Peak! (Your Level: ${self.gameState.state.level})`, 'warning');
                            return;
                        }
                        modal.classList.remove('hidden');
                        self.audio.playSound('click');
                    }
                    else {
                        modal.classList.add('hidden');
                    }
                };
                window.confirmAscendMountainPeak = () => {
                    const modal = document.getElementById('modal-ascend-warning');
                    if (modal)
                        modal.classList.add('hidden');
                    const res = self.gameState.ascendMountainPeak();
                    if (res.success) {
                        self.audio.playSound('levelup');
                        self.ui.showToast(res.message, 'success');
                    }
                    else {
                        self.ui.showToast(res.message, 'warning');
                    }
                    this.updateSoulKillMeterDOM();
                };
                this.drawGrid();
                // Spawn initial 10 monsters
                this.ensureMinimumMonsters(10);
                this.spawnTimer = this.time.addEvent({ delay: 3500, callback: () => this.autoSpawnLoop(), loop: true });
                this.monsterAttackTimer = this.time.addEvent({ delay: 1800, callback: () => this.monsterAttackHeroLoop(), loop: true });
                this.monsterAbilityTimer = this.time.addEvent({ delay: 3800, callback: () => this.executeMonsterBossAbilities(), loop: true });
                this.autoBattleTimer = this.time.addEvent({ delay: 300, callback: () => this.runAutoBattleLogic(), loop: true });
                this.autoSkillTimer = this.time.addEvent({ delay: 200, callback: () => this.runAutomaticSkillLogic(), loop: true });
                this.porterTimer = this.time.addEvent({ delay: 100, callback: () => this.updatePorterCollector(), loop: true });
                // HERO AURA BUILD TIMER (+2 PER SECOND UP TO 100/100)
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                            return;
                        const current = self.gameState.state.heroAuraMeter || 0;
                        if (current < 100) {
                            self.gameState.state.heroAuraMeter = Math.min(100, current + 2);
                            this.updateHeroAuraMeterDOM();
                        }
                    },
                    loop: true
                });
                // AUTOMATIC UNIQUE POWER EXECUTION TIMER (EVERY 7 SECONDS IN DUNGEON)
                this.time.addEvent({
                    delay: 7000,
                    callback: () => {
                        if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                            return;
                        this.executeAutomaticUniquePower();
                    },
                    loop: true
                });
                this.cursors = this.input.keyboard.createCursorKeys();
                this.wasd = this.input.keyboard.addKeys('W,A,S,D,Q');
                if (this.input && this.input.keyboard) {
                    this.input.keyboard.clearCaptures();
                }
                this.input.on('pointerdown', (pointer) => {
                    if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                        return;
                    const activeEl = document.activeElement;
                    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA'))
                        return;
                    ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
                    const clickedObjects = this.input.hitTestPointer(pointer);
                    let hitEnemy = false;
                    clickedObjects.forEach((obj) => {
                        if (obj.isEnemy) {
                            hitEnemy = true;
                            this.attackEnemy(obj);
                        }
                    });
                    if (!hitEnemy) {
                        this.attackTowardsPointer(pointer.x, pointer.y);
                    }
                });
            }
            getHeroSpriteKey() {
                const jobClass = self.gameState.state.jobClass || 'WARRIOR';
                const gender = self.gameState.state.gender || 'MALE';
                return `chibi_${jobClass.toLowerCase()}_${gender === 'FEMALE' ? 'f' : 'm'}`;
            }
            updateHeroTextureIfChanged() {
                if (!this.player)
                    return;
                const expectedKey = this.getHeroSpriteKey();
                if (this.player.texture.key !== expectedKey) {
                    this.player.setTexture(expectedKey);
                }
            }
            drawGrid() {
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                this.bgGrid.clear();
                const centerX = width / 2;
                const centerY = height / 2;
                const time = this.time.now * 0.001;
                // ELEGANT SPATIAL COSMIC RADIAL ORBITS WITH DYNAMIC QI PULSE
                for (let r = 160; r <= 880; r += 110) {
                    const pulseAlpha = Math.max(0.06, 0.22 - (r / 1200) + Math.sin(time + r * 0.01) * 0.04);
                    const color = (r % 220 === 0) ? 0x06b6d4 : 0x38bdf8;
                    this.bgGrid.lineStyle(1.8, color, pulseAlpha);
                    const rx = r * 1.35;
                    const ry = r * 0.72;
                    this.bgGrid.strokeEllipse(centerX, centerY, rx, ry);
                }
                // FLOATING STARDUST QI PARTICLES
                this.bgGrid.fillStyle(0x38bdf8, 0.6);
                for (let i = 0; i < 16; i++) {
                    const px = (centerX + Math.sin(time + i * 1.7) * (180 + i * 25)) % width;
                    const py = (centerY + Math.cos(time * 0.8 + i * 1.3) * (120 + i * 20)) % height;
                    this.bgGrid.fillCircle(px, py, 1.8);
                }
            }
            renderRadarMinimap() {
                const canvas = document.getElementById('minimap-canvas');
                if (!canvas)
                    return;
                const ctx = canvas.getContext('2d');
                if (!ctx)
                    return;
                const w = canvas.width;
                const h = canvas.height;
                const center = w / 2;
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#090d16';
                ctx.fillRect(0, 0, w, h);
                ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(center, center, 24, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(center, center, 48, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(center, center, 68, 0, Math.PI * 2);
                ctx.stroke();
                this.radarSweepAngle += 0.04;
                ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(center + Math.cos(this.radarSweepAngle) * 70, center + Math.sin(this.radarSweepAngle) * 70);
                ctx.stroke();
                const px = this.player ? this.player.x : center;
                const py = this.player ? this.player.y : center;
                this.enemies.getChildren().forEach((e) => {
                    if (!e.active)
                        return;
                    const relX = (e.x - px) * 0.18;
                    const relY = (e.y - py) * 0.18;
                    const ex = center + relX;
                    const ey = center + relY;
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#f87171';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(ex, ey, 7, 0, Math.PI * 2);
                    ctx.stroke();
                });
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(center, center, 5.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#60a5fa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(center, center, 9, 0, Math.PI * 2);
                ctx.stroke();
            }
            getAttackRangeRadius() {
                const level = self.gameState.state.level || 1;
                // SMOOTH & BALANCED RANGE SCALING: Base Lvl 1 = 240px, +1px per Level up! Resets on Reincarnation!
                const baseRange = 240;
                const levelBonus = (level - 1) * 1;
                return baseRange + levelBonus;
            }
            spawnAnimeWindTrail() {
                const now = this.time.now;
                if (!this.lastWindTrailTime || now - this.lastWindTrailTime > 150) {
                    this.lastWindTrailTime = now;
                    const px = this.player.x + (Math.random() * 20 - 10);
                    const py = this.player.y + 24;
                    const wind = this.add.sprite(px, py, 'wind_gust');
                    wind.setAlpha(0.8);
                    wind.setScale(0.8);
                    this.tweens.add({
                        targets: wind,
                        y: py + 15,
                        alpha: 0,
                        scaleX: 1.4,
                        scaleY: 1.4,
                        duration: 350,
                        onComplete: () => {
                            if (wind && wind.destroy)
                                wind.destroy();
                        }
                    });
                }
            }
            executeMonsterBossAbilities() {
                if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                    return;
                this.enemies.getChildren().forEach((e) => {
                    if (!e || !e.active || e.isDefeated || Math.random() > 0.35)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    if (dist <= 260) {
                        const randAbility = Math.random();
                        if (randAbility < 0.4) {
                            const lungeX = this.player.x + (e.x > this.player.x ? 65 : -65);
                            const lungeY = this.player.y + (e.y > this.player.y ? 65 : -65);
                            this.tweens.add({
                                targets: e,
                                x: lungeX,
                                y: lungeY,
                                duration: 250,
                                yoyo: true
                            });
                        }
                        else if (randAbility < 0.7) {
                            const now = this.time.now;
                            if (!this.lastShakeTime || now - this.lastShakeTime > 500) {
                                this.lastShakeTime = now;
                                this.cameras.main.shake(140, 0.005);
                            }
                            const slamRing = this.add.graphics();
                            slamRing.lineStyle(4, 0xef4444, 0.9);
                            slamRing.strokeCircle(e.x, e.y, 40);
                            this.tweens.add({ targets: slamRing, alpha: 0, scaleX: 2, scaleY: 2, duration: 300, onComplete: () => slamRing.destroy() });
                        }
                        else {
                            const stompRing = this.add.graphics();
                            stompRing.lineStyle(4, 0xf59e0b, 0.9);
                            stompRing.strokeCircle(e.x, e.y, 60);
                            this.tweens.add({ targets: stompRing, alpha: 0, scaleX: 2.5, scaleY: 2.5, duration: 350, onComplete: () => stompRing.destroy() });
                        }
                    }
                });
            }
            getHeroMoveSpeed() {
                const equippedMount = self.gameState.state.equippedMount;
                const mountSpeedMult = equippedMount ? 1.45 : 1.0;
                const baseSpeed = 4.8 * mountSpeedMult;
                return this.isHeroTitanMode ? baseSpeed * 1.9 : baseSpeed;
            }
            // AUTOPILOT ULTRA-FAST MOVEMENT SPEED & HYPER-ACTIVE AUTO METERS
            runAutoBattleLogic() {
                if (!self.isAutoBattle || ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead) {
                    return;
                }
                // 1. AUTO-ACTIVATE ALL METERS AS SOON AS THEY HIT 100%
                // A. SOUL CUTSCENE METER AUTO-TRIGGER (If equipped)
                const soulCount = self.gameState.state.killMeter || 0;
                if (soulCount >= 100 && !this.isCutsceneActive) {
                    this.triggerSoulCutscene();
                }
                // B. BANKAI METER AUTO-TRIGGER
                const auraCount = self.gameState.state.heroAuraMeter || 0;
                if (auraCount >= 100 && !this.isHeroTitanMode) {
                    this.triggerHeroTitanAuraMode();
                }
                // C. PET RUSH METER AUTO-TRIGGER
                if (this.petSquadMeter >= 100 && !this.isSuperPetMode) {
                    this.triggerSuperPetMode();
                }
                // D. UNIQUE POWER / ULTIMATE AUTO-TRIGGER
                const uniquePower = self.gameState.state.equippedUniquePower;
                if (uniquePower) {
                    const now = this.time.now;
                    if (!this.lastUniquePowerTime || now - this.lastUniquePowerTime > 7500) {
                        this.lastUniquePowerTime = now;
                        this.executeAutomaticUniquePower();
                    }
                }
                // 2. FIND NEAREST ENEMY / BOSS TO PURSUE AND ANNIHILATE
                const maxRange = this.getAttackRangeRadius();
                let targetEnemy = null;
                let minDist = Infinity;
                this.enemies.getChildren().slice().forEach((e) => {
                    if (!e || !e.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    if (dist < minDist) {
                        minDist = dist;
                        targetEnemy = e;
                    }
                });
                // AUTOPILOT ULTRA-FAST MOVEMENT SPEED (1.65X USER SPEED MULTIPLIER!)
                const speed = this.getHeroMoveSpeed() * 1.65;
                if (targetEnemy) {
                    if (minDist <= maxRange) {
                        this.attackEnemy(targetEnemy);
                        // TACTICAL EVASIVE DODGING & ORBITING WHEN ENEMIES MOVE CLOSER
                        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetEnemy.x, targetEnemy.y);
                        const dodgeSide = Math.sin(this.time.now * 0.008) > 0 ? 1 : -1;
                        const dodgeAngle = angle + (Math.PI / 2 * dodgeSide) + (minDist < 60 ? Math.PI : 0);
                        const dodgeSpeed = speed * 1.15;
                        const dx = Math.cos(dodgeAngle) * dodgeSpeed;
                        const dy = Math.sin(dodgeAngle) * dodgeSpeed;
                        this.spawnAnimeWindTrail();
                        this.earthRotationAngleX += dx * 0.004;
                        this.earthRotationAngleY += dy * 0.004;
                        this.drawGrid();
                        this.enemies.getChildren().slice().forEach((e) => { if (e && e.active) {
                            e.x -= dx;
                            e.y -= dy;
                        } });
                        this.droppedItems.getChildren().slice().forEach((i) => { if (i && i.active) {
                            i.x -= dx;
                            i.y -= dy;
                        } });
                        this.isHeroMoving = true;
                    }
                    else {
                        // AUTOPILOT HIGH SPEED PURSUIT STRAIGHT TO TARGET ENEMY / BOSS
                        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, targetEnemy.x, targetEnemy.y);
                        const dx = Math.cos(angle) * speed;
                        const dy = Math.sin(angle) * speed;
                        this.spawnAnimeWindTrail();
                        this.earthRotationAngleX += dx * 0.005;
                        this.earthRotationAngleY += dy * 0.005;
                        this.drawGrid();
                        this.enemies.getChildren().slice().forEach((e) => { if (e && e.active) {
                            e.x -= dx;
                            e.y -= dy;
                        } });
                        this.droppedItems.getChildren().slice().forEach((i) => { if (i && i.active) {
                            i.x -= dx;
                            i.y -= dy;
                        } });
                        this.isHeroMoving = true;
                    }
                }
                else {
                    this.autoRoamAngle += 0.08;
                    const dx = Math.cos(this.autoRoamAngle) * speed;
                    const dy = Math.sin(this.autoRoamAngle) * speed;
                    this.spawnAnimeWindTrail();
                    this.earthRotationAngleX += dx * 0.005;
                    this.earthRotationAngleY += dy * 0.005;
                    this.drawGrid();
                    this.droppedItems.getChildren().forEach((i) => { i.x -= dx; i.y -= dy; });
                    this.isHeroMoving = true;
                }
            }
            // 5 AUTOMATIC CASTING SKILLS SYSTEM
            runAutomaticSkillLogic() {
                if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                    return;
                const skill = self.gameState.state.equippedSkill;
                this.skillGraphics.clear();
                if (!skill || !skill.skillId)
                    return;
                const px = this.player.x;
                const py = this.player.y;
                const level = skill.level || 1;
                const cpDamage = (skill.cpBonus || 25) * level;
                if (skill.skillId === 'spinning_stone') {
                    // SKILL 1: SPINNING STONE (Rare) - Fast Orbiting rotating stones
                    this.spinningStonesAngle += 0.25;
                    const numStones = 1 + Math.floor((level - 1) / 5);
                    const radius = 85;
                    for (let i = 0; i < numStones; i++) {
                        const a = this.spinningStonesAngle + (i * Math.PI * 2 / numStones);
                        const sx = px + Math.cos(a) * radius;
                        const sy = py + Math.sin(a) * radius;
                        this.skillGraphics.fillStyle(0x78350f, 1);
                        this.skillGraphics.fillCircle(sx, sy, 14);
                        this.skillGraphics.lineStyle(2, 0xd97706, 1);
                        this.skillGraphics.strokeCircle(sx, sy, 16);
                        // Damage enemies on contact
                        this.enemies.getChildren().forEach((e) => {
                            if (!e.active)
                                return;
                            const dist = Phaser.Math.Distance.Between(sx, sy, e.x, e.y);
                            if (dist <= 35) {
                                this.applyAttackImpact(e, e.x, e.y);
                            }
                        });
                    }
                }
                else if (skill.skillId === 'flaming_field') {
                    // SKILL 2: FLAMING FIELD (Rare) - Continuous fire aura burn matching Character Max Attack Range
                    const maxRange = this.getAttackRangeRadius();
                    const time = this.time.now * 0.008;
                    // Multi-layered intense burning fire field rings & glowing embers
                    this.skillGraphics.lineStyle(5, 0xef4444, 0.95);
                    this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 4) * 10);
                    this.skillGraphics.lineStyle(3, 0xf97316, 0.85);
                    this.skillGraphics.strokeCircle(px, py, maxRange * 0.7 + Math.cos(time * 3) * 6);
                    this.skillGraphics.fillStyle(0xef4444, 0.18);
                    this.skillGraphics.fillCircle(px, py, maxRange);
                    // Animated fire ember particles inside full attack range
                    for (let i = 0; i < 6; i++) {
                        const emberAngle = time * 3 + (i * Math.PI / 3);
                        const ex = px + Math.cos(emberAngle) * (maxRange * 0.85);
                        const ey = py + Math.sin(emberAngle) * (maxRange * 0.85);
                        this.skillGraphics.fillStyle(0xfbbf24, 0.9);
                        this.skillGraphics.fillCircle(ex, ey, 5);
                    }
                    // Fast continuous burn tick damage to ALL enemies inside max attack range
                    this.enemies.getChildren().forEach((e) => {
                        if (!e || !e.active || e.isDefeated)
                            return;
                        const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                        if (dist <= maxRange) {
                            const tickDamage = Math.max(6, Math.floor(cpDamage * 0.15));
                            e.hp -= tickDamage;
                            this.showDamageText(tickDamage, e.x, e.y);
                            if (e.hp <= 0 && !e.isDefeated)
                                this.onEnemyDefeated(e, e.x, e.y);
                        }
                    });
                }
                else if (skill.skillId === 'necromancer') {
                    // SKILL 3: NECROMANCER (Mythic) - Black smoke mist aura & Skeleton Minion pets
                    const maxRange = this.getAttackRangeRadius();
                    this.skillGraphics.lineStyle(4, 0x000000, 0.95);
                    this.skillGraphics.strokeCircle(px, py, maxRange);
                    this.skillGraphics.fillStyle(0x18181b, 0.35);
                    this.skillGraphics.fillCircle(px, py, maxRange);
                    // Spawn up to 2 Skeleton Minions (Skull 💀) if needed
                    if (this.skeletonMinions.getChildren().length < 2) {
                        const minion = this.add.sprite(px + (Math.random() * 80 - 40), py + (Math.random() * 80 - 40), 'skely_minion');
                        minion.hp = 100;
                        this.skeletonMinions.add(minion);
                    }
                    // Minions attack enemies & drain HP if idle
                    this.skeletonMinions.getChildren().forEach((m) => {
                        if (!m.active)
                            return;
                        let nearEnemy = null;
                        let minDist = Infinity;
                        this.enemies.getChildren().forEach((e) => {
                            if (!e.active)
                                return;
                            const d = Phaser.Math.Distance.Between(m.x, m.y, e.x, e.y);
                            if (d < minDist) {
                                minDist = d;
                                nearEnemy = e;
                            }
                        });
                        if (nearEnemy && minDist <= maxRange) {
                            const angle = Phaser.Math.Angle.Between(m.x, m.y, nearEnemy.x, nearEnemy.y);
                            m.x += Math.cos(angle) * 4;
                            m.y += Math.sin(angle) * 4;
                            if (minDist <= 40) {
                                this.applyAttackImpact(nearEnemy, nearEnemy.x, nearEnemy.y);
                            }
                        }
                        else {
                            m.hp -= 4; // Drain HP when idle
                            if (m.hp <= 0)
                                m.destroy();
                        }
                    });
                }
                else if (skill.skillId === 'acid_rain') {
                    // SKILL 4: ACID RAIN (Legendary) - REVAMPED REALISTIC TOXIC GREEN CLOUD OVERHEAD & ACID DROPS
                    const maxRange = this.getAttackRangeRadius();
                    const time = this.time.now * 0.006;
                    const cloudX = px;
                    const cloudY = py - 150;
                    // 1. GROUND TOXIC CORROSION ZONE
                    this.skillGraphics.lineStyle(4, 0x10b981, 0.95);
                    this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 3) * 6);
                    this.skillGraphics.fillStyle(0x10b981, 0.18);
                    this.skillGraphics.fillCircle(px, py, maxRange);
                    // 2. BIG REALISTIC TOXIC GREEN CLOUD OVERHEAD TOP OF CHARACTER
                    const numPuffs = 7;
                    for (let i = 0; i < numPuffs; i++) {
                        const offsetX = (i - (numPuffs - 1) / 2) * 32;
                        const waveY = Math.sin(time * 2.5 + i * 1.2) * 7;
                        const waveX = Math.cos(time * 1.8 + i * 0.8) * 5;
                        const puffRadius = 36 + Math.sin(time * 3 + i) * 5;
                        // Dark Toxic Atmosphere Glow
                        this.skillGraphics.fillStyle(0x059669, 0.45);
                        this.skillGraphics.fillCircle(cloudX + offsetX + waveX, cloudY + waveY, puffRadius + 8);
                        // Main Toxic Green Cloud Puff
                        this.skillGraphics.fillStyle(0x10b981, 0.85);
                        this.skillGraphics.fillCircle(cloudX + offsetX + waveX, cloudY + waveY, puffRadius);
                        // Core Lime Cloud Highlight
                        this.skillGraphics.fillStyle(0x84cc16, 0.95);
                        this.skillGraphics.fillCircle(cloudX + offsetX + waveX - 4, cloudY + waveY - 4, puffRadius * 0.45);
                    }
                    // 3. FALLING NEON TOXIC ACID RAIN DROPLETS & GROUND SPLASH FX
                    const numRainDrops = 14;
                    for (let i = 0; i < numRainDrops; i++) {
                        const rx = px + Math.sin(i * 1.7 + time * 2) * (maxRange * 0.85);
                        const fallProgress = ((this.time.now * 0.5 + i * 85) % 150);
                        const ry = (cloudY + 25) + fallProgress;
                        // Vertical Acid Rain Droplet Streak
                        this.skillGraphics.lineStyle(3, 0x84cc16, 0.95);
                        this.skillGraphics.lineBetween(rx, ry, rx - 0.5, ry - 14);
                        // Ground Splash Effect when landing
                        if (fallProgress >= 135) {
                            const splashY = py + Math.cos(i * 2.3) * 35;
                            this.skillGraphics.lineStyle(2, 0x10b981, 0.85);
                            this.skillGraphics.strokeCircle(rx, splashY, 6 + (fallProgress % 8));
                        }
                    }
                    // 4. CORRODE ENEMIES INSIDE TOXIC ACID RAIN ZONE
                    this.enemies.getChildren().forEach((e) => {
                        if (!e || !e.active || e.isDefeated)
                            return;
                        const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                        if (dist <= maxRange) {
                            const acidDamage = Math.max(6, Math.floor(cpDamage * 0.16));
                            e.hp -= acidDamage;
                            this.showDamageText(acidDamage, e.x, e.y);
                            if (e.hp <= 0 && !e.isDefeated)
                                this.onEnemyDefeated(e, e.x, e.y);
                        }
                    });
                }
                else if (skill.skillId === 'cyborg') {
                    // SKILL 5: CYBORG LASERS (Legendary) - WIDER & THICKER CYBERNETIC LASERS
                    const maxRange = this.getAttackRangeRadius();
                    this.skillGraphics.lineStyle(5, 0x06b6d4, 0.95);
                    this.skillGraphics.strokeCircle(px, py, maxRange);
                    this.skillGraphics.fillStyle(0x06b6d4, 0.14);
                    this.skillGraphics.fillCircle(px, py, maxRange);
                    // Shoot 3 ultra thick & wide lasers at once
                    let laserCount = 0;
                    this.enemies.getChildren().forEach((e) => {
                        if (!e || !e.active || e.isDefeated || laserCount >= 3)
                            return;
                        const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                        if (dist <= maxRange) {
                            laserCount++;
                            // Outer glowing laser aura beam (thick 16px)
                            this.skillGraphics.lineStyle(16, 0x38bdf8, 0.45);
                            this.skillGraphics.lineBetween(px, py, e.x, e.y);
                            // Core intense laser beam (thick 8px cyan)
                            this.skillGraphics.lineStyle(8, 0x06b6d4, 0.95);
                            this.skillGraphics.lineBetween(px, py, e.x, e.y);
                            // Ultra bright laser core line (thick 3px white)
                            this.skillGraphics.lineStyle(3, 0xffffff, 1);
                            this.skillGraphics.lineBetween(px, py, e.x, e.y);
                            // Impact blast circle on target
                            this.skillGraphics.fillStyle(0x38bdf8, 0.9);
                            this.skillGraphics.fillCircle(e.x, e.y, 14);
                            this.skillGraphics.lineStyle(2, 0xffffff, 1);
                            this.skillGraphics.strokeCircle(e.x, e.y, 18);
                            this.applyAttackImpact(e, e.x, e.y);
                        }
                    });
                }
                else if (skill.skillId === 'teleporter') {
                    // SKILL 6: SHADOW TELEPORTER (Mythic) - Blood-Red Mist Range, Teleportation & Execution Strike
                    const maxRange = this.getAttackRangeRadius();
                    const time = this.time.now * 0.008;
                    // Crimson blood-red mist range circle
                    this.skillGraphics.lineStyle(5, 0xd97706, 0.95);
                    this.skillGraphics.strokeCircle(px, py, maxRange + Math.sin(time * 3) * 8);
                    this.skillGraphics.lineStyle(3, 0xef4444, 0.85);
                    this.skillGraphics.strokeCircle(px, py, maxRange);
                    this.skillGraphics.fillStyle(0x991b1b, 0.22);
                    this.skillGraphics.fillCircle(px, py, maxRange);
                    // Blood mist particles floating inside red mist range
                    for (let i = 0; i < 8; i++) {
                        const mistAngle = time * 2.5 + (i * Math.PI / 4);
                        const mx = px + Math.cos(mistAngle) * (maxRange * 0.7);
                        const my = py + Math.sin(mistAngle) * (maxRange * 0.7);
                        this.skillGraphics.fillStyle(0xef4444, 0.85);
                        this.skillGraphics.fillCircle(mx, my, 4);
                    }
                    // Teleport & Execute Enemies inside blood mist range
                    let executed = false;
                    this.enemies.getChildren().slice().forEach((e) => {
                        if (!e || !e.active || e.isDefeated || executed)
                            return;
                        const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                        if (dist <= maxRange) {
                            executed = true;
                            // Teleport shadow shockwave FX at target location
                            const mistFx = this.add.graphics();
                            mistFx.fillStyle(0xef4444, 0.9);
                            mistFx.fillCircle(e.x, e.y, 32);
                            mistFx.lineStyle(4, 0x991b1b, 0.95);
                            mistFx.strokeCircle(e.x, e.y, 45);
                            this.tweens.add({ targets: mistFx, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 300, onComplete: () => mistFx.destroy() });
                            // Crimson execute slash lines
                            this.skillGraphics.lineStyle(6, 0xef4444, 1);
                            this.skillGraphics.lineBetween(e.x - 25, e.y - 25, e.x + 25, e.y + 25);
                            this.skillGraphics.lineBetween(e.x + 25, e.y - 25, e.x - 25, e.y + 25);
                            // Execute damage (Massive CP multiplier)
                            const execDamage = Math.max(15, Math.floor(cpDamage * 2.2));
                            e.hp -= execDamage;
                            this.showDamageText(execDamage, e.x, e.y);
                            if (e.hp <= 0 && !e.isDefeated)
                                this.onEnemyDefeated(e, e.x, e.y);
                        }
                    });
                }
            }
            updatePorterCollector() {
                if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                    return;
                const porter = self.gameState.state.equippedPorter;
                if (!porter || !this.player || !this.player.active) {
                    if (this.porterGraphics)
                        this.porterGraphics.clear();
                    if (this.porterText)
                        this.porterText.setVisible(false);
                    return;
                }
                const px = this.player.x;
                const py = this.player.y;
                if (!this.porterPos)
                    this.porterPos = { x: px - 45, y: py + 20 };
                let targetItem = null;
                let minDist = Infinity;
                const radius = porter.porterRadiusPx || 200;
                this.droppedItems.getChildren().slice().forEach((item) => {
                    if (!item || !item.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.porterPos.x, this.porterPos.y, item.x, item.y);
                    if (dist < minDist) {
                        minDist = dist;
                        targetItem = item;
                    }
                });
                const speedMult = (porter.rarity === 'mythic' ? 9.0 : (porter.rarity === 'legendary' ? 6.5 : (porter.rarity === 'rare' ? 4.8 : 3.2)));
                const moveSpeed = speedMult * (1 + ((porter.level || 1) - 1) * 0.1);
                if (targetItem && minDist <= radius) {
                    const angle = Phaser.Math.Angle.Between(this.porterPos.x, this.porterPos.y, targetItem.x, targetItem.y);
                    this.porterPos.x += Math.cos(angle) * moveSpeed;
                    this.porterPos.y += Math.sin(angle) * moveSpeed;
                    // Magnetically pull item towards Porter
                    const itemAngle = Phaser.Math.Angle.Between(targetItem.x, targetItem.y, this.porterPos.x, this.porterPos.y);
                    targetItem.x += Math.cos(itemAngle) * (moveSpeed * 1.4);
                    targetItem.y += Math.sin(itemAngle) * (moveSpeed * 1.4);
                    if (minDist <= 30) {
                        this.collectDroppedItem(targetItem);
                    }
                }
                else {
                    // Follow Hero
                    const targetX = px - 45;
                    const targetY = py + 20;
                    const heroDist = Phaser.Math.Distance.Between(this.porterPos.x, this.porterPos.y, targetX, targetY);
                    if (heroDist > 15) {
                        const idleAngle = Phaser.Math.Angle.Between(this.porterPos.x, this.porterPos.y, targetX, targetY);
                        this.porterPos.x += Math.cos(idleAngle) * (moveSpeed * 0.85);
                        this.porterPos.y += Math.sin(idleAngle) * (moveSpeed * 0.85);
                    }
                }
                // Magnetically pull items near player
                this.droppedItems.getChildren().forEach((item) => {
                    if (!item || !item.active)
                        return;
                    const pDist = Phaser.Math.Distance.Between(px, py, item.x, item.y);
                    if (pDist <= (radius * 0.75)) {
                        const pAngle = Phaser.Math.Angle.Between(item.x, item.y, px, py);
                        item.x += Math.cos(pAngle) * 7.5;
                        item.y += Math.sin(pAngle) * 7.5;
                        if (pDist <= 35) {
                            item.setActive(false).setVisible(false);
                            this.collectDroppedItem(item);
                        }
                    }
                });
                // Draw Porter follower graphics & label
                if (this.porterGraphics && this.porterText) {
                    this.porterGraphics.clear();
                    const pX = this.porterPos.x;
                    const pY = this.porterPos.y;
                    let ringColor = 0x10b981;
                    if (porter.rarity === 'rare')
                        ringColor = 0x38bdf8;
                    if (porter.rarity === 'legendary')
                        ringColor = 0xf59e0b;
                    if (porter.rarity === 'mythic')
                        ringColor = 0xa855f7;
                    this.porterGraphics.lineStyle(3, ringColor, 0.95);
                    this.porterGraphics.fillStyle(0x020617, 0.88);
                    this.porterGraphics.fillCircle(pX, pY, 15);
                    this.porterGraphics.strokeCircle(pX, pY, 17);
                    this.porterText.setPosition(pX, pY - 26);
                    this.porterText.setText(`${porter.icon || '🎒'} Lvl ${porter.level || 1}`);
                    this.porterText.setVisible(true);
                }
            }
            collectDroppedItem(item) {
                if (!item)
                    return;
                item.setActive(false).setVisible(false);
                if (item.isKey) {
                    self.gameState.state.towerKeys = Math.min(20, (self.gameState.state.towerKeys || 0) + 1);
                    self.ui.showToast('🔑 Tower Key Collected by Porter!', 'info');
                }
                else if (item.isPetDrop) {
                    self.gameState.state.gold += 500;
                    self.ui.showToast('🪙 Companion Essence Collected by Porter (+500 Gold)!', 'info');
                }
                else if (item.element) {
                    self.gameState.state.gold += 150;
                    self.ui.showToast(`✨ ${item.element.toUpperCase()} Rune Collected by Porter (+150 Gold)!`, 'info');
                }
                else {
                    self.gameState.state.gold += 80;
                }
                this.time.delayedCall(0, () => {
                    if (item && item.destroy)
                        item.destroy();
                });
                self.gameState.notify();
            }
            showAutosaveBadgeOverhead() {
                if (!this.heroAutosaveText || !this.player || !this.player.active)
                    return;
                this.heroAutosaveText.setPosition(this.player.x, (this.player.y) - 90);
                this.heroAutosaveText.setText('💾 AUTOSAVED TO FIREBASE DB');
                this.heroAutosaveText.setAlpha(1);
                if (this.autosaveTween)
                    this.autosaveTween.stop();
                this.autosaveTween = this.tweens.add({
                    targets: this.heroAutosaveText,
                    alpha: 0,
                    y: (this.player.y) - 110,
                    duration: 1800,
                    ease: 'Power2',
                    onComplete: () => {
                        if (this.heroAutosaveText && this.player) {
                            this.heroAutosaveText.setY((this.player.y) - 90);
                        }
                    }
                });
            }
            ensureMinimumMonsters(minCount = 10) {
                const activeEnemies = this.enemies.getChildren().filter((e) => e && e.active && !e.isDefeated);
                const activeCount = activeEnemies.length;
                const needed = minCount - activeCount;
                const currentTier = self.gameState.getWorldTier();
                const isTier10Multiple = currentTier > 0 && currentTier % 10 === 0;
                const hasMegaBoss = activeEnemies.some((e) => e.isMegaBoss);
                // Spawn World Tier 10 Colossal Mega Boss (2x Size of Regular Boss) on World Tier 10, 20, 30, etc.
                if (isTier10Multiple && !hasMegaBoss) {
                    const width = this.cameras.main.width;
                    const height = this.cameras.main.height;
                    const spawnX = Math.random() * (width - 300) + 150;
                    const spawnY = Math.random() * (height - 300) + 150;
                    this.spawnRandomEnemy(spawnX, spawnY, 'boss_abyssal_behemoth', `🐲 TIER ${currentTier} MYTHIC MOUNT SOVEREIGN`, 60, 5500, 'lightning', true, true);
                }
                for (let i = 0; i < needed; i++) {
                    const width = this.cameras.main.width;
                    const height = this.cameras.main.height;
                    const spawnX = Math.random() * (width - 240) + 120;
                    const spawnY = Math.random() * (height - 240) + 120;
                    const monsterVariants = [
                        { key: 'm_slime_emerald', name: 'Emerald Slime', lvl: 1, hp: 40, element: 'nature', isBoss: false },
                        { key: 'm_slime_ruby', name: 'Ruby Slime', lvl: 3, hp: 55, element: 'fire', isBoss: false },
                        { key: 'm_goblin', name: 'Goblin Scout', lvl: 5, hp: 65, element: 'none', isBoss: false },
                        { key: 'm_drake', name: 'Shadow Drake', lvl: 8, hp: 85, element: 'fire', isBoss: false },
                        { key: 'm_skeleton', name: 'Skeleton Warrior', lvl: 12, hp: 110, element: 'none', isBoss: false },
                        { key: 'm_beholder', name: 'Void Beholder', lvl: 15, hp: 140, element: 'lightning', isBoss: false },
                        { key: 'm_demon', name: 'Frost Demon', lvl: 18, hp: 180, element: 'lightning', isBoss: false },
                        { key: 'm_golem', name: 'Infernal Golem', lvl: 22, hp: 230, element: 'fire', isBoss: false },
                        { key: 'm_wyvern', name: 'Dark Wyvern', lvl: 25, hp: 300, element: 'nature', isBoss: false },
                        { key: 'boss_infernal_demon', name: '👹 Infernal Archdemon', lvl: 30, hp: 600, element: 'fire', isBoss: true },
                        { key: 'boss_abyssal_behemoth', name: '👾 Abyssal Behemoth', lvl: 35, hp: 800, element: 'lightning', isBoss: true }
                    ];
                    const monster = monsterVariants[Math.floor(Math.random() * monsterVariants.length)];
                    this.spawnRandomEnemy(spawnX, spawnY, monster.key, monster.name, monster.lvl, monster.hp, monster.element, monster.isBoss, false);
                }
            }
            autoSpawnLoop() {
                if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead || this.isSpawnPaused || this.isCutsceneActive)
                    return;
                this.ensureMinimumMonsters(10);
            }
            spawnRandomEnemy(x, y, spriteKey, name, lvl, baseHp, element, isBoss = false, isMegaBoss = false) {
                const scaledLvl = self.gameState.getScaledMonsterLvl(lvl);
                let scaledHp = self.gameState.getScaledMonsterHp(baseHp);
                if (isMegaBoss) {
                    scaledHp = Math.floor(scaledHp * 25);
                }
                else if (isBoss) {
                    scaledHp = Math.floor(scaledHp * 5);
                }
                const enemy = this.add.sprite(x, y, spriteKey);
                enemy.setInteractive();
                enemy.setScale(isMegaBoss ? 5.2 : (isBoss ? 2.6 : 1.2));
                enemy.isEnemy = true;
                enemy.isDefeated = false;
                enemy.enemyName = name;
                enemy.lvl = scaledLvl;
                enemy.hp = scaledHp;
                enemy.maxHp = scaledHp;
                enemy.element = element;
                enemy.isBoss = isBoss;
                enemy.isMegaBoss = isMegaBoss;
                // CREATE OVERHEAD LVL TEXT ONCE AT SPAWN TIME (ELIMINATES MEMORY LEAKS AND RE-CREATIONS IN UPDATE LOOP)
                enemy.lvlText = this.add.text(x - 15, y - (isMegaBoss ? 75 : (isBoss ? 45 : 30)), `LVL ${scaledLvl}`, {
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    fontStyle: 'bold',
                    color: isBoss ? '#fbbf24' : '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 2.5
                }).setDepth(101);
                this.enemies.add(enemy);
            }
            spawnElementRuneDrop(x, y, element) {
                const drop = this.add.sprite(x, y, 'drop_rune');
                drop.isKey = false;
                drop.element = element;
                this.tweens.add({ targets: drop, y: y - 12, scaleX: 1.2, scaleY: 1.2, duration: 550, yoyo: true, repeat: -1 });
                this.time.delayedCall(12000, () => { if (drop.active)
                    drop.destroy(); });
                this.droppedItems.add(drop);
            }
            spawnTowerKeyDrop(x, y) {
                const drop = this.add.sprite(x, y, 'drop_key');
                drop.isKey = true;
                this.tweens.add({ targets: drop, y: y - 12, scaleX: 1.2, scaleY: 1.2, duration: 550, yoyo: true, repeat: -1 });
                this.time.delayedCall(12000, () => { if (drop.active)
                    drop.destroy(); });
                this.droppedItems.add(drop);
            }
            spawnCompanionPetDrop(x, y) {
                const drop = this.add.sprite(x + 25, y, 'chibi_archer_f');
                drop.setScale(1.2);
                drop.setTint(0xf472b6);
                drop.isPetDrop = true;
                this.tweens.add({ targets: drop, y: y - 14, scaleX: 1.3, scaleY: 1.3, duration: 500, yoyo: true, repeat: -1 });
                this.time.delayedCall(12000, () => { if (drop.active)
                    drop.destroy(); });
                this.droppedItems.add(drop);
            }
            monsterAttackHeroLoop() {
                if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon' || this.isDead)
                    return;
                this.enemies.getChildren().forEach((e) => {
                    if (!e || !e.active || e.isDefeated || this.isDead)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    if (dist <= 85) {
                        const damage = Math.floor(Math.random() * 8) + 8;
                        self.gameState.state.hp = Math.max(0, self.gameState.state.hp - damage);
                        self.gameState.notify();
                        self.audio.playSound('hit');
                        // HERO DAMAGE TAKEN VISUAL EFFECTS (THROTTLED CAMERA FLASH & TINT)
                        const now = this.time.now;
                        if (!this.lastHitAudioTime || now - this.lastHitAudioTime > 400) {
                            this.cameras.main.flash(180, 239, 68, 68);
                            this.cameras.main.shake(100, 0.004);
                        }
                        if (this.player) {
                            this.player.setTint(0xef4444);
                            this.time.delayedCall(120, () => {
                                if (this.player && this.player.active)
                                    this.player.clearTint();
                            });
                        }
                        this.showHeroDamageText(damage, this.player.x, this.player.y);
                        if (self.gameState.state.hp <= 0) {
                            this.handleHeroDeath();
                        }
                    }
                });
            }
            handleHeroDeath() {
                if (this.isDead)
                    return;
                this.isDead = true;
                self.audio.playSound('hit');
                const overlay = document.getElementById('death-respawn-overlay');
                const timerText = document.getElementById('respawn-timer-text');
                if (overlay)
                    overlay.classList.remove('hidden');
                let secondsLeft = 5;
                if (timerText)
                    timerText.innerText = `${secondsLeft}s`;
                const countdownTimer = setInterval(() => {
                    secondsLeft--;
                    if (timerText)
                        timerText.innerText = `${secondsLeft}s`;
                    if (secondsLeft <= 0) {
                        clearInterval(countdownTimer);
                        if (overlay)
                            overlay.classList.add('hidden');
                        self.gameState.state.hp = self.gameState.state.maxHp;
                        self.gameState.notify();
                        self.gameState.saveToFirebase();
                        this.isDead = false;
                        self.audio.playSound('levelup');
                        this.spawnGoldenResurrectionLight();
                    }
                }, 1000);
            }
            spawnGoldenResurrectionLight() {
                const px = this.player.x;
                const py = this.player.y;
                const resFx = this.add.graphics();
                resFx.fillStyle(0xfbbf24, 0.9);
                resFx.fillCircle(px, py, 60);
                this.tweens.add({
                    targets: resFx,
                    alpha: 0,
                    scaleX: 2.8,
                    scaleY: 2.8,
                    duration: 750,
                    onComplete: () => resFx.destroy()
                });
                this.cameras.main.flash(500, 251, 191, 36);
                const el = document.createElement('div');
                el.className = 'level-up-float-text';
                el.innerText = '✨ HERO RESURRECTED ✨';
                el.style.left = `${px}px`;
                el.style.top = `${py - 80}px`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 1200);
            }
            executeAutomaticUniquePower() {
                const power = self.gameState.state.equippedUniquePower;
                if (!power || !this.player || !this.player.active)
                    return;
                const px = this.player.x;
                const py = this.player.y;
                const level = power.level || 1;
                const damage = Math.floor((power.cpBonus || 800) * level * 2.5);
                // Visual cosmic ring / aura wave effect
                const ring = this.add.graphics().setDepth(25);
                ring.lineStyle(8, 0xf59e0b, 1);
                ring.strokeCircle(px, py, 40);
                this.tweens.add({
                    targets: ring,
                    scaleX: 6,
                    scaleY: 6,
                    alpha: 0,
                    duration: 650,
                    onComplete: () => ring.destroy()
                });
                // Damage enemies in radius
                this.enemies.getChildren().forEach((e) => {
                    if (!e || !e.active || e.isDefeated)
                        return;
                    const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                    if (dist <= 380) {
                        e.hp -= damage;
                        this.showDamageText(damage, e.x, e.y);
                        if (e.hp <= 0 && !e.isDefeated) {
                            this.onEnemyDefeated(e, e.x, e.y);
                        }
                    }
                });
                self.audio.playSound('levelup');
                this.showFloatingPetText(`👑 ${power.name} ACTIVATED!`, px, py);
            }
            performRollDash(moveDx, moveDy) {
                const now = this.time.now;
                if (now - this.lastDashTime < 800 || this.isDashing || this.isDead)
                    return;
                this.lastDashTime = now;
                this.isDashing = true;
                self.audio.playSound('attack');
                // Calculate Roll Dash direction (horizontal / vertical / diagonal)
                let dirX = 0;
                let dirY = 0;
                if (this.cursors.left.isDown || this.wasd.A.isDown)
                    dirX -= 1;
                if (this.cursors.right.isDown || this.wasd.D.isDown)
                    dirX += 1;
                if (this.cursors.up.isDown || this.wasd.W.isDown)
                    dirY -= 1;
                if (this.cursors.down.isDown || this.wasd.S.isDown)
                    dirY += 1;
                if (dirX === 0 && dirY === 0) {
                    dirX = 1;
                    dirY = 0; // Default right dash if stationary
                }
                const dashDistance = 180;
                const targetShiftX = dirX * dashDistance;
                const targetShiftY = dirY * dashDistance;
                // Create 3 Afterimage Ghosts
                for (let i = 1; i <= 3; i++) {
                    this.time.delayedCall(i * 45, () => {
                        if (!this.player || !this.player.active)
                            return;
                        const ghost = this.add.sprite(this.player.x, this.player.y, this.player.texture.key);
                        ghost.setAlpha(0.65);
                        ghost.setTint(0x38bdf8);
                        ghost.setScale(1.8);
                        this.tweens.add({ targets: ghost, alpha: 0, scaleX: 2.2, scaleY: 2.2, duration: 250, onComplete: () => ghost.destroy() });
                    });
                }
                // Roll Rotation 360 Degrees Spin Animation
                const rotationDirection = dirX >= 0 ? Math.PI * 2 : -Math.PI * 2;
                this.tweens.add({
                    targets: this.player,
                    rotation: rotationDirection,
                    duration: 280,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        if (this.player)
                            this.player.setRotation(0);
                        this.isDashing = false;
                    }
                });
                // Fast Move World Elements in Opposing Vector
                this.enemies.getChildren().forEach((e) => {
                    this.tweens.add({
                        targets: e,
                        x: e.x - targetShiftX,
                        y: e.y - targetShiftY,
                        duration: 240,
                        ease: 'Cubic.easeOut'
                    });
                });
                this.droppedItems.getChildren().forEach((item) => {
                    this.tweens.add({
                        targets: item,
                        x: item.x - targetShiftX,
                        y: item.y - targetShiftY,
                        duration: 240,
                        ease: 'Cubic.easeOut'
                    });
                });
                // Floating Roll Dash text
                const el = document.createElement('div');
                el.className = 'exp-popup-text';
                el.innerText = '⚡ ROLL DASH!';
                el.style.color = '#38bdf8';
                el.style.left = `${this.player.x}px`;
                el.style.top = `${this.player.y - 50}px`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 700);
            }
            update(time, delta) {
                if (!this.player || this.isDead)
                    return;
                const activeEl = document.activeElement;
                const isTypingInInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
                if (isTypingInInput || ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon') {
                    return;
                }
                this.updateHeroTextureIfChanged();
                // UPDATE OVERHEAD FLOATING LVL, REIN & TITLE TEXT (YELLOW STYLIZED FONT)
                if (this.heroOverheadText) {
                    const lvl = self.gameState.state.level || 1;
                    const rein = self.gameState.state.ascensionLevel || 0;
                    const title = self.gameState.getClassTitle();
                    this.heroOverheadText.setText(`[LVL ${lvl} | REIN ${rein}] ${title}`);
                    const offsetY = this.isHeroTitanMode ? 140 : 65;
                    this.heroOverheadText.setPosition(this.player.x, this.player.y - offsetY);
                }
                // Q KEY ROLL DASH TRIGGER
                const Phaser = window.Phaser;
                if (this.wasd && this.wasd.Q && Phaser.Input.Keyboard.JustDown(this.wasd.Q)) {
                    this.performRollDash(0, 0);
                }
                const speed = this.getHeroMoveSpeed();
                let dx = 0;
                let dy = 0;
                if (this.cursors.left.isDown || this.wasd.A.isDown)
                    dx += speed;
                if (this.cursors.right.isDown || this.wasd.D.isDown)
                    dx -= speed;
                if (this.cursors.up.isDown || this.wasd.W.isDown)
                    dy += speed;
                if (this.cursors.down.isDown || this.wasd.S.isDown)
                    dy -= speed;
                if (self.joystickDx !== 0 || self.joystickDy !== 0) {
                    dx = -self.joystickDx * speed;
                    dy = -self.joystickDy * speed;
                }
                if (dx !== 0 || dy !== 0) {
                    this.isHeroMoving = true;
                    ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
                    this.spawnAnimeWindTrail();
                    this.earthRotationAngleX += dx * 0.003;
                    this.earthRotationAngleY += dy * 0.003;
                    this.drawGrid();
                    this.enemies.getChildren().forEach((e) => { e.x += dx; e.y += dy; });
                    this.droppedItems.getChildren().forEach((i) => { i.x += dx; i.y += dy; });
                }
                else if (!self.isAutoBattle) {
                    this.isHeroMoving = false;
                }
                // Enemies approach hero
                this.enemies.getChildren().slice().forEach((e) => {
                    if (!e || !e.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    if (dist > 70) {
                        const angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
                        e.x += Math.cos(angle) * 0.7;
                        e.y += Math.sin(angle) * 0.7;
                    }
                });
                // Forceful Magnet Auto-Pickup & AUTO Mode Global Map Auto-Collect
                const pickupRange = self.isAutoBattle ? 950 : 250;
                this.droppedItems.getChildren().slice().forEach((item) => {
                    if (!item || !item.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
                    if (dist <= pickupRange || item.isBeingCollected) {
                        const angle = Phaser.Math.Angle.Between(item.x, item.y, this.player.x, this.player.y);
                        const pullSpeed = Math.max(22.0, (pickupRange - dist) * 0.25);
                        item.x += Math.cos(angle) * pullSpeed;
                        item.y += Math.sin(angle) * pullSpeed;
                        if (dist <= 85 || item.isBeingCollected) {
                            if (!item.isBeingCollected) {
                                item.isBeingCollected = true;
                                this.collectLootDrop(item);
                            }
                        }
                    }
                });
                this.renderSuperSaiyanAura();
                this.renderEnemyAuras();
                this.renderAttackRangeCircle();
                this.renderFadedYellowPickupRangeCircle();
                this.updateEnemyLocators();
                this.updateCompanionPetLogic();
                // THROTTLE HEAVY 2D CANVAS MINIMAP & DOM UPDATES TO 10 FPS (EVERY 100ms) TO PREVENT CPU THRESHOLD FREEZING
                const now = time;
                if (!this.lastUiUpdateTime || now - this.lastUiUpdateTime > 100) {
                    this.lastUiUpdateTime = now;
                    this.renderRadarMinimap();
                    this.updateSoulKillMeterDOM();
                }
            }
            collectLootDrop(item) {
                if (!item || !item.active)
                    return;
                item.setActive(false).setVisible(false);
                self.audio.playSound('potion');
                if (item.isKey) {
                    const currentKeys = self.gameState.state.towerKeys || 0;
                    if (currentKeys < 20) {
                        self.gameState.state.towerKeys = Math.min(20, currentKeys + 1);
                        self.ui.showToast('🔑 Picked up Tower Key (+1 Key)!', 'success');
                    }
                    else {
                        self.ui.showToast('🔑 Picked up Tower Key (20/20 Max Keys)!', 'info');
                    }
                }
                else {
                    const elem = item.element || 'fire';
                    const runeName = `${elem.toUpperCase()} Rune`;
                    const existing = self.gameState.state.inventory.find(i => i.name === runeName);
                    if (existing) {
                        existing.count++;
                        existing.level = (existing.level || 1) + 1;
                        existing.cpBonus = 30 * existing.level;
                        self.ui.showToast(`✨ Upgraded ${runeName} to Lvl ${existing.level} (+1)!`, 'success');
                    }
                    else {
                        self.gameState.state.inventory.push({
                            id: `rune-${Date.now()}`,
                            name: runeName,
                            type: 'rune',
                            rarity: 'rare',
                            icon: elem === 'fire' ? '🔥' : elem === 'lightning' ? '⚡' : '🌿',
                            element: elem,
                            cpBonus: 30,
                            level: 1,
                            count: 1,
                            description: `An elemental rune channeling ${elem} aura energy.`,
                            isLocked: false
                        });
                        self.ui.showToast(`✨ Picked up Elemental Rune: ${runeName}!`, 'success');
                    }
                }
                self.gameState.notify();
                self.gameState.saveToFirebase();
                this.time.delayedCall(0, () => {
                    if (item && item.active)
                        item.destroy();
                });
            }
            renderSuperSaiyanAura() {
                this.auraGraphics.clear();
                const px = this.player.x;
                const py = this.player.y;
                const time = this.time.now * 0.008;
                const jobClass = self.gameState.state.jobClass || 'WARRIOR';
                const rune = self.gameState.state.equippedRune;
                const isAuto = self.isAutoBattle;
                // Custom Class / Element Color Palettes
                let flameColor = jobClass === 'WARRIOR' ? 0xef4444 : jobClass === 'MAGE' ? 0x8b5cf6 : 0x10b981;
                let coreColor = jobClass === 'WARRIOR' ? 0xf59e0b : jobClass === 'MAGE' ? 0x38bdf8 : 0x34d399;
                if (rune?.element === 'fire') {
                    flameColor = 0xef4444;
                    coreColor = 0xfbbf24;
                }
                else if (rune?.element === 'lightning') {
                    flameColor = 0x38bdf8;
                    coreColor = 0x60a5fa;
                }
                else if (rune?.element === 'nature') {
                    flameColor = 0x10b981;
                    coreColor = 0x34d399;
                }
                if (this.isHeroTitanMode) {
                    flameColor = 0xffffff; // Bright Pure White Flame Outline
                    coreColor = 0x000000; // Deep Jet Black Core
                }
                const numPoints = 32;
                const maxAttackRange = this.getAttackRangeRadius();
                const baseRadius = this.isHeroTitanMode ? maxAttackRange : (isAuto ? 46 : 38);
                // FULL RANGE BANKAI CONTINUOUS SHOCKWAVE DAMAGE (AUTO-ADJUSTS TO MAX ATTACK RANGE)
                if (this.isHeroTitanMode) {
                    const now = this.time.now;
                    if (!this.lastAuraPulse || now - this.lastAuraPulse > 350) {
                        this.lastAuraPulse = now;
                        this.enemies.getChildren().slice().forEach((e) => {
                            if (!e || !e.active || e.isDefeated)
                                return;
                            const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                            if (dist <= maxAttackRange) {
                                const titanDmg = Math.floor((self.gameState.state.cp || 35) * 1.6);
                                e.hp -= titanDmg;
                                this.showDamageText(titanDmg, e.x, e.y);
                                const shock = this.add.graphics().setDepth(30);
                                shock.lineStyle(4, 0xffffff, 0.95);
                                shock.lineBetween(px, py, e.x, e.y);
                                this.tweens.add({ targets: shock, alpha: 0, duration: 150, onComplete: () => shock.destroy() });
                                if (e.hp <= 0 && !e.isDefeated) {
                                    this.onEnemyDefeated(e, e.x, e.y);
                                }
                            }
                        });
                    }
                }
                // 1. DYNAMIC FLICKERING FLAME TONGUE POLYGON AURA (MONOCHROME FOR BANKAI)
                const lineW = this.isHeroTitanMode ? 7 : 4;
                const fillAlpha = this.isHeroTitanMode ? 0.65 : 0.22;
                this.auraGraphics.lineStyle(lineW, flameColor, 0.95);
                this.auraGraphics.fillStyle(coreColor, fillAlpha);
                this.auraGraphics.beginPath();
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const wave = Math.sin(angle * 6 + time * 5) * 7 + Math.cos(angle * 12 - time * 3) * 5;
                    const upwardFlameBoost = (Math.sin(angle) < 0 ? Math.abs(Math.sin(angle)) * 14 : 0);
                    const r = baseRadius + wave + upwardFlameBoost;
                    const x = px + Math.cos(angle) * r;
                    const y = py + Math.sin(angle) * r;
                    if (i === 0)
                        this.auraGraphics.moveTo(x, y);
                    else
                        this.auraGraphics.lineTo(x, y);
                }
                this.auraGraphics.closePath();
                this.auraGraphics.fillPath();
                this.auraGraphics.strokePath();
                // 2. INNER INTENSE CORE FLAME RING
                this.auraGraphics.lineStyle(3, flameColor, 0.95);
                this.auraGraphics.beginPath();
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const wave = Math.sin(angle * 8 + time * 6) * 4;
                    const r = (baseRadius * 0.65) + wave;
                    const x = px + Math.cos(angle) * r;
                    const y = py + Math.sin(angle) * r;
                    if (i === 0)
                        this.auraGraphics.moveTo(x, y);
                    else
                        this.auraGraphics.lineTo(x, y);
                }
                this.auraGraphics.closePath();
                this.auraGraphics.strokePath();
                // 3. RISING SWIRLING SPARK & EMBER PARTICLES WITH CRIMSON RED SPARKS IN BANKAI MODE
                for (let i = 0; i < 12; i++) {
                    const pTime = time * 2.8 + i * 1.1;
                    const emberX = px + Math.sin(pTime * 1.5 + i) * (30 + i * 5);
                    const emberY = py - ((pTime * 48) % 105) + 35;
                    const emberSize = 3 + (i % 4);
                    let pColor = coreColor;
                    if (this.isHeroTitanMode) {
                        // BLACK, WHITE & CRIMSON RED SPARK ANIMATION
                        pColor = i % 3 === 0 ? 0xef4444 : (i % 3 === 1 ? 0xffffff : 0x000000);
                    }
                    this.auraGraphics.fillStyle(pColor, 0.95);
                    this.auraGraphics.fillCircle(emberX, emberY, emberSize * (this.isHeroTitanMode ? 1.5 : 1));
                }
                // 4. BANKAI CRIMSON RED LIGHTNING ARCS BURSTING INSIDE AURA RING
                if (this.isHeroTitanMode) {
                    this.auraGraphics.lineStyle(3, 0xef4444, 0.95);
                    for (let k = 0; k < 4; k++) {
                        const arcAngle1 = Math.random() * Math.PI * 2;
                        const arcAngle2 = arcAngle1 + (Math.random() * 0.8 - 0.4);
                        const r1 = 60 + Math.random() * 180;
                        const r2 = 60 + Math.random() * 180;
                        this.auraGraphics.lineBetween(px + Math.cos(arcAngle1) * r1, py + Math.sin(arcAngle1) * r1, px + Math.cos(arcAngle2) * r2, py + Math.sin(arcAngle2) * r2);
                    }
                }
                // 4. JOJO STYLE "MENACING" ゴゴゴ RUMBLE TEXT PARTICLES
                if (!this.menacingTexts)
                    this.menacingTexts = [];
                if (this.menacingTexts.length === 0) {
                    for (let k = 0; k < 3; k++) {
                        const mText = this.add.text(px, py, 'ゴ', {
                            fontFamily: 'monospace',
                            fontSize: '18px',
                            fontStyle: 'bold',
                            color: '#a855f7',
                            stroke: '#000000',
                            strokeThickness: 3
                        }).setDepth(102);
                        this.menacingTexts.push(mText);
                    }
                }
                this.menacingTexts.forEach((mText, k) => {
                    const mTime = time * 1.2 + k * 2.2;
                    const mX = px + (k - 1) * 36 + Math.sin(mTime) * 14;
                    const mY = py - 35 - ((mTime * 28) % 55);
                    mText.setPosition(mX, mY);
                    mText.setAlpha(Math.max(0.1, 1 - (py - mY) / 75));
                    if (this.isHeroTitanMode) {
                        mText.setColor(k % 2 === 0 ? '#ffffff' : '#000000');
                    }
                    else {
                        mText.setColor(k % 2 === 0 ? '#a855f7' : '#f59e0b');
                    }
                });
            }
            renderAngryEntitiesAndHoppingAnimation() {
                if (!this.enemyCubeGraphics) {
                    this.enemyCubeGraphics = this.add.graphics().setDepth(14);
                }
                this.enemyCubeGraphics.clear();
                const time = this.time.now * 0.008;
                this.enemies.getChildren().forEach((e, index) => {
                    if (!e.active)
                        return;
                    // 1. SMOOTH & FANCY ELASTIC SQUASH-AND-STRETCH HOPPING WALK ANIMATION
                    const hopTime = (time * 8.5) + (index * 1.8);
                    const hopY = Math.abs(Math.sin(hopTime)) * (e.isMegaBoss ? 10 : 18);
                    const squashY = 1.0 + Math.sin(hopTime * 2) * 0.16;
                    const squashX = 1.0 - Math.sin(hopTime * 2) * 0.10;
                    const baseScale = e.isMegaBoss ? 5.2 : (e.isBoss ? 2.6 : 1.25);
                    e.setScale(baseScale * squashX, baseScale * squashY);
                    const drawX = e.x;
                    const drawY = e.y - hopY;
                    // 2. ANGRY ENTITY VISUAL ENHANCEMENT: GLOWING DEMONIC EYES & ANGRY AURA OUTLINES
                    const size = e.isMegaBoss ? 110 : (e.isBoss ? 52 : 24);
                    const eyeColor = e.isMegaBoss ? 0xfbbf24 : (e.isBoss ? 0xef4444 : 0xf59e0b);
                    // Glowing Demonic Red/Amber Eyes
                    const eyeOffset = size * 0.22;
                    const eyeY = drawY - size * 0.15;
                    this.enemyCubeGraphics.fillStyle(0x000000, 0.95);
                    this.enemyCubeGraphics.fillCircle(drawX - eyeOffset, eyeY, size * 0.18);
                    this.enemyCubeGraphics.fillCircle(drawX + eyeOffset, eyeY, size * 0.18);
                    this.enemyCubeGraphics.fillStyle(eyeColor, 1);
                    this.enemyCubeGraphics.fillCircle(drawX - eyeOffset, eyeY, size * 0.12);
                    this.enemyCubeGraphics.fillCircle(drawX + eyeOffset, eyeY, size * 0.12);
                    this.enemyCubeGraphics.fillStyle(0xffffff, 1);
                    this.enemyCubeGraphics.fillCircle(drawX - eyeOffset + 1, eyeY - 1, size * 0.05);
                    this.enemyCubeGraphics.fillCircle(drawX + eyeOffset + 1, eyeY - 1, size * 0.05);
                    // Angry Jagged Fangs / Demonic Horns for Bosses
                    if (e.isBoss || e.isMegaBoss) {
                        this.enemyCubeGraphics.fillStyle(0xffffff, 0.95);
                        // Left Horn
                        this.enemyCubeGraphics.beginPath();
                        this.enemyCubeGraphics.moveTo(drawX - size * 0.4, drawY - size * 0.4);
                        this.enemyCubeGraphics.lineTo(drawX - size * 0.6, drawY - size * 0.8);
                        this.enemyCubeGraphics.lineTo(drawX - size * 0.2, drawY - size * 0.5);
                        this.enemyCubeGraphics.closePath();
                        this.enemyCubeGraphics.fillPath();
                        // Right Horn
                        this.enemyCubeGraphics.beginPath();
                        this.enemyCubeGraphics.moveTo(drawX + size * 0.4, drawY - size * 0.4);
                        this.enemyCubeGraphics.lineTo(drawX + size * 0.6, drawY - size * 0.8);
                        this.enemyCubeGraphics.lineTo(drawX + size * 0.2, drawY - size * 0.5);
                        this.enemyCubeGraphics.closePath();
                        this.enemyCubeGraphics.fillPath();
                    }
                });
            }
            renderEnemyAuras() {
                this.enemyAuraGraphics.clear();
                this.renderAngryEntitiesAndHoppingAnimation();
                const time = this.time.now * 0.008;
                this.enemies.getChildren().forEach((e) => {
                    if (!e || !e.active || e.isDefeated)
                        return;
                    // AURA GRAPHICS EXCLUSIVELY ON BOSSES ONLY!
                    if (e.isBoss || e.isMegaBoss) {
                        const bossColor = e.isMegaBoss ? 0xfbbf24 : (e.texture.key === 'boss_infernal_demon' ? 0xef4444 : 0x8b5cf6);
                        const coreColor = 0xfbbf24;
                        const numPoints = 28;
                        const baseRadius = e.isMegaBoss ? 130 : 58;
                        // MONSTROUS BOSS HELLFIRE FLAME POLYGON AURA
                        this.enemyAuraGraphics.lineStyle(5, bossColor, 0.95);
                        this.enemyAuraGraphics.fillStyle(bossColor, 0.25);
                        this.enemyAuraGraphics.beginPath();
                        for (let i = 0; i <= numPoints; i++) {
                            const angle = (i / numPoints) * Math.PI * 2;
                            const wave = Math.sin(angle * 7 + time * 6) * 10 + Math.cos(angle * 14 - time * 4) * 6;
                            const upwardFlameBoost = (Math.sin(angle) < 0 ? Math.abs(Math.sin(angle)) * 18 : 0);
                            const r = baseRadius + wave + upwardFlameBoost;
                            const x = e.x + Math.cos(angle) * r;
                            const y = e.y + Math.sin(angle) * r;
                            if (i === 0)
                                this.enemyAuraGraphics.moveTo(x, y);
                            else
                                this.enemyAuraGraphics.lineTo(x, y);
                        }
                        this.enemyAuraGraphics.closePath();
                        this.enemyAuraGraphics.fillPath();
                        this.enemyAuraGraphics.strokePath();
                        // BOSS INNER CORE GOLDEN FIRE RING
                        this.enemyAuraGraphics.lineStyle(3, coreColor, 0.9);
                        this.enemyAuraGraphics.strokeCircle(e.x, e.y, (e.isMegaBoss ? 75 : 45) + Math.sin(time * 5) * 5);
                        // BOSS RISING HELLFIRE PARTICLES
                        for (let i = 0; i < 5; i++) {
                            const pTime = time * 2 + i * 1.5;
                            const emberX = e.x + Math.sin(pTime) * ((e.isMegaBoss ? 60 : 35) + i * 6);
                            const emberY = e.y - ((pTime * 38) % 85) + 30;
                            this.enemyAuraGraphics.fillStyle(coreColor, 0.9);
                            this.enemyAuraGraphics.fillCircle(emberX, emberY, 4);
                        }
                    }
                });
            }
            renderAttackRangeCircle() {
                this.rangeGraphics.clear();
                const radius = this.getAttackRangeRadius();
                const jobClass = self.gameState.state.jobClass || 'WARRIOR';
                const color = jobClass === 'WARRIOR' ? 0x10b981 : jobClass === 'MAGE' ? 0x3b82f6 : 0x059669;
                this.rangeGraphics.lineStyle(2, color, 0.6);
                this.rangeGraphics.fillStyle(color, 0.08);
                this.rangeGraphics.fillCircle(this.player.x, this.player.y, radius);
                this.rangeGraphics.strokeCircle(this.player.x, this.player.y, radius);
            }
            renderFadedYellowPickupRangeCircle() {
                this.pickupRangeGraphics.clear();
                this.pickupRangeGraphics.lineStyle(2, 0xfacc15, 0.55);
                this.pickupRangeGraphics.fillStyle(0xfacc15, 0.08);
                this.pickupRangeGraphics.fillCircle(this.player.x, this.player.y, 140);
                this.pickupRangeGraphics.strokeCircle(this.player.x, this.player.y, 140);
            }
            renderHeroDungeonHUD() {
                if (!this.player || !this.player.active)
                    return;
                const hp = self.gameState.state.hp;
                const maxHp = self.gameState.state.maxHp || 120;
                const hpRatio = Math.max(0, Math.min(100, (hp / maxHp) * 100));
                const exp = self.gameState.state.exp || 0;
                const maxExp = self.gameState.state.maxExp || 100;
                const expRatio = Math.max(0, Math.min(100, (exp / maxExp) * 100));
                const nameEl = document.getElementById('hero-hud-name');
                const rankEl = document.getElementById('hero-hud-rank');
                const hpTextEl = document.getElementById('hero-hud-hp-text');
                const hpBarEl = document.getElementById('hero-hud-hp-bar');
                const expTextEl = document.getElementById('hero-hud-exp-text');
                const expBarEl = document.getElementById('hero-hud-exp-bar');
                const lvlTextEl = document.getElementById('hero-hud-level-text');
                const cpTextEl = document.getElementById('hero-hud-cp-text');
                const iconEl = document.getElementById('hero-hud-class-icon');
                const heroRank = self.gameState.getHeroRank(self.gameState.state.level);
                const jobClass = self.gameState.state.jobClass || 'WARRIOR';
                if (nameEl)
                    nameEl.innerText = self.gameState.state.name || 'Hero';
                if (rankEl) {
                    rankEl.innerText = `RANK ${heroRank.rank}`;
                    rankEl.style.color = heroRank.color;
                }
                if (hpTextEl)
                    hpTextEl.innerText = `${Math.floor(hp)} / ${maxHp}`;
                if (hpBarEl)
                    hpBarEl.style.width = `${hpRatio}%`;
                if (expTextEl)
                    expTextEl.innerText = `${exp} / ${maxExp}`;
                if (expBarEl)
                    expBarEl.style.width = `${expRatio}%`;
                if (lvlTextEl)
                    lvlTextEl.innerText = `LVL ${self.gameState.state.level} (REIN ${self.gameState.state.ascensionLevel || 0})`;
                if (cpTextEl)
                    cpTextEl.innerText = `⚡ ${self.gameState.state.cp || 35} CP`;
                if (iconEl)
                    iconEl.innerText = jobClass === 'WARRIOR' ? '🗡️' : jobClass === 'SAMURAI' ? '🥷' : jobClass === 'MAGE' ? '🔮' : '🏹';
                this.updateWorldTierDOM();
                this.updateMountDisplay();
            }
            updateMountDisplay() {
                if (!this.player || !this.mountSprite)
                    return;
                const eqMount = self.gameState.state.equippedMount;
                const centerX = this.cameras.main.width / 2;
                const centerY = this.cameras.main.height / 2;
                if (this.flyingSwordSprite && !this.isFlyingSwordAttacking) {
                    // TELEKINETIC FLYING SWORD SHEATHED IDLE POSITION BESIDE WAIST
                    const floatHover = Math.sin(this.time.now * 0.006) * 3;
                    this.flyingSwordSprite.setPosition(this.player.x + 18, this.player.y + 4 + floatHover);
                    this.flyingSwordSprite.setRotation(-Math.PI / 4);
                }
                if (!eqMount) {
                    // CHARACTER SKELETAL RIGGING: FLOATING BREATHING ANIMATION
                    const idleFloat = Math.sin(this.time.now * 0.005) * 3;
                    const breatheScale = 2.0 + Math.sin(this.time.now * 0.007) * 0.04;
                    this.player.setPosition(centerX, centerY + idleFloat);
                    this.player.setScale(breatheScale);
                    this.mountSprite.setVisible(false);
                    if (this.heroOverheadText)
                        this.heroOverheadText.setPosition(centerX, centerY - 65 + idleFloat);
                    return;
                }
                let mountKey = 'mount_flame_dragon';
                const name = eqMount.name || '';
                if (name.includes('Stallion') || name.includes('Thunder'))
                    mountKey = 'mount_thunder_stallion';
                else if (name.includes('Phoenix') || name.includes('Celestial'))
                    mountKey = 'mount_celestial_phoenix';
                else if (name.includes('Drake') || name.includes('Void'))
                    mountKey = 'mount_void_drake';
                if (this.mountSprite.texture.key !== mountKey) {
                    this.mountSprite.setTexture(mountKey);
                }
                this.mountSprite.setVisible(true);
                this.mountSprite.setScale(2.4);
                // SMOOTH MOUNT LEG STRIDE & GALLOPING MOTION WHEN MOVING, IDLE FREEZE POSE WHEN STOPPED
                if (this.isHeroMoving) {
                    const runTime = this.time.now * 0.016;
                    const legStride = Math.sin(runTime) * 3;
                    const gallopBounce = Math.abs(Math.sin(runTime)) * 3;
                    const tiltRotation = Math.sin(runTime) * 0.07;
                    this.mountSprite.setPosition(centerX + legStride, centerY + 14 - gallopBounce);
                    this.mountSprite.setRotation(tiltRotation);
                    this.player.setPosition(centerX, centerY - 14 - gallopBounce);
                    if (this.heroOverheadText)
                        this.heroOverheadText.setPosition(centerX, centerY - 76 - gallopBounce);
                }
                else {
                    // IDLE FREEZE POSE WHEN CHARACTER IS STOPPED / NOT MOVING
                    this.mountSprite.setPosition(centerX, centerY + 14);
                    this.mountSprite.setRotation(0);
                    this.player.setPosition(centerX, centerY - 14);
                    if (this.heroOverheadText)
                        this.heroOverheadText.setPosition(centerX, centerY - 76);
                }
            }
            updateEnemyLocators() {
                this.locatorGraphics.clear();
                this.renderHeroDungeonHUD();
                this.enemies.getChildren().slice().forEach((e) => {
                    if (!e || !e.active || e.isDefeated) {
                        if (e && e.lvlText && e.lvlText.active) {
                            e.lvlText.destroy();
                            e.lvlText = null;
                        }
                        return;
                    }
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    const inRange = dist <= this.getAttackRangeRadius();
                    const radius = e.isMegaBoss ? 115 : (e.isBoss ? 56 : 30);
                    // Target Circle Ring Around Entity
                    this.locatorGraphics.lineStyle(e.isMegaBoss ? 7 : (e.isBoss ? 5 : 2), e.isMegaBoss ? 0xfbbf24 : (e.isBoss ? 0xf59e0b : (inRange ? 0x10b981 : 0xef4444)), 0.9);
                    this.locatorGraphics.strokeCircle(e.x, e.y, radius);
                    const barWidth = e.isMegaBoss ? 180 : (e.isBoss ? 96 : 58);
                    const barHeight = e.isMegaBoss ? 12 : (e.isBoss ? 8 : 5);
                    const drawX = e.x - barWidth / 2;
                    // MOVED HIGHER ABOVE THE HEAD OF THE ENTITIES!
                    const drawY = e.y - (e.isMegaBoss ? 150 : (e.isBoss ? 76 : 50));
                    // 1. Sleek Outer Metallic Border Frame (Golden for Boss, Emerald/Red for Normal)
                    const borderColor = (e.isBoss || e.isMegaBoss) ? 0xfbbf24 : (inRange ? 0x34d399 : 0xf87171);
                    this.locatorGraphics.lineStyle(1.5, borderColor, 0.95);
                    this.locatorGraphics.strokeRect(drawX - 1.5, drawY - 1.5, barWidth + 3, barHeight + 3);
                    // 2. Dark Background Bar Container
                    this.locatorGraphics.fillStyle(0x0f172a, 0.9);
                    this.locatorGraphics.fillRect(drawX, drawY, barWidth, barHeight);
                    // 3. Health Bar Fill (Glowing Fill Color)
                    const hpRatio = Math.max(0, Math.min(1, e.hp / (e.maxHp || 50)));
                    const fillColor = e.isBoss ? 0xd97706 : (inRange ? 0x10b981 : 0xef4444);
                    this.locatorGraphics.fillStyle(fillColor, 1);
                    this.locatorGraphics.fillRect(drawX, drawY, barWidth * hpRatio, barHeight);
                    // 4. Shiny Top Highlight Bar Line
                    this.locatorGraphics.fillStyle(0xffffff, 0.45);
                    this.locatorGraphics.fillRect(drawX, drawY, barWidth * hpRatio, Math.max(1, Math.floor(barHeight / 3)));
                    // 5. Reposition existing LVL Text Tag over/beside Health Bar
                    if (e.lvlText && e.lvlText.active) {
                        e.lvlText.setPosition(drawX - 2, drawY - 12);
                    }
                });
            }
            attackTowardsPointer(targetX, targetY) {
                if (this.isDead || this.isFlyingSwordAttacking)
                    return;
                const maxRange = this.getAttackRangeRadius();
                const px = this.player.x;
                const py = this.player.y;
                // Collect valid active enemies in range (limit chain up to 4 targets to prevent lag)
                const targetEnemies = [];
                this.enemies.getChildren().slice().forEach((e) => {
                    if (e && e.active && targetEnemies.length < 4) {
                        const dist = Phaser.Math.Distance.Between(px, py, e.x, e.y);
                        if (dist <= maxRange) {
                            targetEnemies.push(e);
                        }
                    }
                });
                if (targetEnemies.length === 0)
                    return;
                this.isFlyingSwordAttacking = true;
                // Safety fallback timer: guarantee isFlyingSwordAttacking is reset after 1000ms max!
                this.time.delayedCall(1000, () => {
                    this.isFlyingSwordAttacking = false;
                });
                self.audio.playSound('attack');
                let chainIndex = 0;
                const processNextTarget = () => {
                    if (chainIndex >= targetEnemies.length || !this.flyingSwordSprite || this.isDead) {
                        // Return Flying Sword back to sheath beside waist
                        if (this.flyingSwordSprite && this.player) {
                            this.tweens.add({
                                targets: this.flyingSwordSprite,
                                x: this.player.x + 18,
                                y: this.player.y + 4,
                                duration: 140,
                                ease: 'Power2',
                                onComplete: () => {
                                    this.isFlyingSwordAttacking = false;
                                    if (this.flyingSwordSprite)
                                        this.flyingSwordSprite.setRotation(-Math.PI / 4);
                                }
                            });
                        }
                        else {
                            this.isFlyingSwordAttacking = false;
                        }
                        return;
                    }
                    const currentEnemy = targetEnemies[chainIndex];
                    chainIndex++;
                    if (!currentEnemy || !currentEnemy.active) {
                        this.time.delayedCall(30, () => processNextTarget());
                        return;
                    }
                    const angle = Phaser.Math.Angle.Between(this.flyingSwordSprite.x, this.flyingSwordSprite.y, currentEnemy.x, currentEnemy.y);
                    this.flyingSwordSprite.setRotation(angle);
                    this.flyingSwordSprite.setScale(1.85); // PERFECTLY PROPORTIONED FLYING SWORD!
                    this.tweens.add({
                        targets: this.flyingSwordSprite,
                        x: currentEnemy.x,
                        y: currentEnemy.y,
                        duration: 100,
                        ease: 'Linear',
                        onComplete: () => {
                            if (currentEnemy && currentEnemy.active) {
                                // Play Crisp Metal Sword Impact Audio SFX
                                self.audio.playSound('hit');
                                // 1. "CHING CHING! ✨" METALLIC GOLDEN TEXT POPUP
                                const chingText = this.add.text(currentEnemy.x, currentEnemy.y - 30, 'CHING CHING! ✨', {
                                    fontFamily: 'monospace',
                                    fontSize: '15px',
                                    fontStyle: 'bold',
                                    color: '#fbbf24',
                                    stroke: '#06b6d4',
                                    strokeThickness: 3.5
                                }).setOrigin(0.5).setDepth(120);
                                this.tweens.add({
                                    targets: chingText,
                                    y: currentEnemy.y - 65,
                                    scaleX: 1.4,
                                    scaleY: 1.4,
                                    alpha: 0,
                                    duration: 450,
                                    ease: 'Back.out',
                                    onComplete: () => chingText.destroy()
                                });
                                // 2. GOLDEN QI SPARK RINGS & CLASH BURST FX (REPLACED HORIZONTAL SLASH)
                                const spark = this.add.graphics().setDepth(35);
                                spark.lineStyle(4, 0xfbbf24, 0.95);
                                spark.strokeCircle(currentEnemy.x, currentEnemy.y, 22);
                                spark.lineStyle(3, 0x06b6d4, 1);
                                spark.lineBetween(currentEnemy.x - 20, currentEnemy.y - 20, currentEnemy.x + 20, currentEnemy.y + 20);
                                spark.lineBetween(currentEnemy.x + 20, currentEnemy.y - 20, currentEnemy.x - 20, currentEnemy.y + 20);
                                this.tweens.add({
                                    targets: spark,
                                    alpha: 0,
                                    scaleX: 1.8,
                                    scaleY: 1.8,
                                    duration: 180,
                                    onComplete: () => spark.destroy()
                                });
                                this.applyAttackImpact(currentEnemy, currentEnemy.x, currentEnemy.y);
                            }
                            this.time.delayedCall(35, () => processNextTarget());
                        }
                    });
                };
                processNextTarget();
            }
            checkRangeImpact(x, y) {
                this.enemies.getChildren().slice().forEach((e) => {
                    if (!e || !e.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
                    if (dist <= 40) {
                        this.applyAttackImpact(e, e.x, e.y);
                    }
                });
            }
            attackEnemy(enemy) {
                if (!enemy || !enemy.active || this.isDead)
                    return;
                this.attackTowardsPointer(enemy.x, enemy.y);
            }
            applyAttackImpact(enemy, x, y) {
                if (!enemy || !enemy.active || enemy.isDefeated)
                    return;
                const now = this.time.now;
                // THROTTLE AUDIO & CAMERA SHAKE TO PREVENT CANVAS STUTTER & FREEZING
                if (!this.lastHitAudioTime || now - this.lastHitAudioTime > 150) {
                    this.lastHitAudioTime = now;
                    self.audio.playSound('hit');
                }
                if (enemy.isBoss && (!this.lastShakeTime || now - this.lastShakeTime > 700)) {
                    this.lastShakeTime = now;
                    if (this.cameras && this.cameras.main) {
                        this.cameras.main.shake(100, 0.004);
                    }
                }
                // ENEMY DAMAGE TAKEN RED TINT FLASH
                enemy.setTint(0xef4444);
                this.time.delayedCall(100, () => {
                    if (enemy && enemy.active)
                        enemy.clearTint();
                });
                // Crimson Slash Spark Graphic Impact
                const spark = this.add.graphics().setDepth(20);
                spark.lineStyle(4, 0xef4444, 1);
                spark.lineBetween(x - 16, y - 16, x + 16, y + 16);
                spark.lineBetween(x + 16, y - 16, x - 16, y + 16);
                this.tweens.add({ targets: spark, alpha: 0, scaleX: 1.4, scaleY: 1.4, duration: 140, onComplete: () => spark.destroy() });
                const cp = self.gameState.state.cp || 35;
                const baseDamage = Math.floor(cp * 1.5) + Math.floor(Math.random() * (cp * 0.5));
                enemy.hp -= baseDamage;
                this.showDamageText(baseDamage, x, y);
                if (enemy.hp <= 0 && !enemy.isDefeated) {
                    this.onEnemyDefeated(enemy, x, y);
                }
            }
            // WAVE SYSTEM & WORLD TIER INCREASE NOTICE
            onEnemyDefeated(enemy, x, y) {
                if (!enemy || !enemy.active || enemy.isDefeated)
                    return;
                enemy.isDefeated = true;
                enemy.setActive(false);
                enemy.setVisible(false);
                if (enemy.lvlText) {
                    enemy.lvlText.destroy();
                    enemy.lvlText = null;
                }
                const tier = self.gameState.getWorldTier();
                const isBoss = enemy.isBoss;
                const reinExpMult = self.gameState.getReincarnationExpMultiplier();
                // BASE EXP DROP SCALED BY WORLD TIER & REINCARNATION STACKING MULTIPLIER (+50% PER REIN LEVEL)
                const baseExp = (25 + (tier - 1) * 15) * (isBoss ? 8 : 1);
                const expGained = Math.floor(baseExp * reinExpMult);
                const goldGained = (60 + (tier - 1) * 35) * (isBoss ? 6 : 1);
                self.gameState.state.exp += expGained;
                self.gameState.state.gold += goldGained;
                self.gameState.state.redGems = (self.gameState.state.redGems || 0) + (isBoss ? 25 : 5);
                if (isBoss) {
                    self.gameState.state.purpleGems = (self.gameState.state.purpleGems || 0) + 2;
                }
                self.gameState.state.waveKills = (self.gameState.state.waveKills || 0) + (isBoss ? 3 : 1);
                // Increment Soul Kill Meter up to 100
                self.gameState.state.killMeter = Math.min(100, (self.gameState.state.killMeter || 0) + 1);
                this.updateSoulKillMeterDOM();
                // Increment Pet Squad Meter per kill (+1 for normal, +3 for boss) & auto-activate at 100
                this.petSquadMeter = Math.min(100, (this.petSquadMeter || 0) + (isBoss ? 3 : 1));
                this.updatePetSquadMeterDOM();
                if (this.petSquadMeter >= 100 && !this.isSuperPetMode) {
                    this.triggerSuperPetMode();
                }
                // FLOATING PURPLE EXP GAINED POPUP (SHOWING REINCARNATION BOOSTED EXP!)
                this.showFloatingExpText(expGained, this.player.x, this.player.y);
                // GUARANTEED MYTHIC MOUNT REWARD FROM 2X SIZE WORLD TIER 10 MEGA BOSS!
                if (enemy.isMegaBoss) {
                    this.rewardMythicMountFromBoss(x, y);
                }
                // TOWER KEY DROPS GUARANTEED FROM BOSSES ONLY!
                if (isBoss) {
                    this.spawnTowerKeyDrop(x, y);
                }
                else if (enemy.element && enemy.element !== 'none' && Math.random() <= 0.12) {
                    this.spawnElementRuneDrop(x, y, enemy.element);
                }
                else if (Math.random() <= 0.08) {
                    this.spawnElementRuneDrop(x, y, 'fire');
                }
                // EXP SCALING PER LEVEL WITH EXP CARRY-OVER (PREVENT INFINITE LOOPS)
                let levelUpSafety = 0;
                while (self.gameState.state.exp >= self.gameState.state.maxExp && levelUpSafety < 100) {
                    levelUpSafety++;
                    self.gameState.state.level++;
                    self.gameState.state.exp -= self.gameState.state.maxExp;
                    self.gameState.state.maxExp = self.gameState.getNextLevelMaxExp(self.gameState.state.level);
                    self.gameState.state.statPoints += 3;
                    self.gameState.state.maxHp += 20;
                    self.gameState.state.hp = self.gameState.state.maxHp;
                    self.audio.playSound('levelup');
                    this.showFloatingLevelUpText(self.gameState.state.level);
                    self.gameState.triggerStatGlowEffect();
                }
                // WAVE SYSTEM: 8 kills per Wave (1/10 to 10/10). Clearing 10/10 increases World Tier!
                if (self.gameState.state.waveKills >= 8) {
                    self.gameState.state.waveKills = 0;
                    const currentWave = self.gameState.state.wave || 1;
                    if (currentWave >= 10) {
                        // Cleared Wave 10/10 -> Reset to Wave 1 & Increase World Tier!
                        self.gameState.state.wave = 1;
                        self.gameState.state.worldTier = (self.gameState.state.worldTier || 1) + 1;
                        this.triggerWorldTierIncreasedNotice(self.gameState.state.worldTier);
                    }
                    else {
                        // Advance to next Wave in current World Tier (e.g., Wave 1 -> Wave 2)
                        self.gameState.state.wave = currentWave + 1;
                        this.triggerWaveCompletedNotice(currentWave, self.gameState.state.wave, self.gameState.state.worldTier);
                    }
                }
                self.gameState.notify();
                self.gameState.saveToFirebase();
                // Safely destroy enemy on next tick to prevent array mutation during forEach iteration
                this.time.delayedCall(0, () => {
                    if (enemy && enemy.active) {
                        enemy.destroy();
                    }
                });
                // Maintain minimum 10 active monsters
                this.ensureMinimumMonsters(10);
            }
            triggerWaveCompletedNotice(clearedWave, nextWave, worldTierNum) {
                self.audio.playSound('levelup');
                const banner = document.getElementById('dungeon-wave-banner');
                const textEl = document.getElementById('wave-banner-text');
                const subEl = document.getElementById('wave-sub-text');
                if (banner && textEl && subEl) {
                    textEl.innerText = `🌊 WAVE ${clearedWave}/10 CLEARED! 🌊`;
                    subEl.innerText = `ADVANCING TO WAVE ${nextWave}/10 (WORLD TIER ${worldTierNum})`;
                    banner.classList.remove('hidden');
                    setTimeout(() => {
                        banner.classList.add('hidden');
                    }, 2000);
                }
                const tierBanner = document.getElementById('dungeon-world-banner');
                if (tierBanner) {
                    tierBanner.classList.add('scale-150', 'text-amber-400');
                    setTimeout(() => {
                        tierBanner.classList.remove('scale-150', 'text-amber-400');
                    }, 1000);
                }
            }
            rewardMythicMountFromBoss(x, y) {
                const mountPool = [
                    { id: `mount-dragon-${Date.now()}`, name: 'Flame Dragon Mount', type: 'mount', rarity: 'mythic', icon: '🐉', cpBonus: 2500, level: 1, count: 1, description: 'Legendary Flame Dragon mount granting +45% move speed boost.', isLocked: false },
                    { id: `mount-stallion-${Date.now()}`, name: 'Thunder Stallion Mount', type: 'mount', rarity: 'mythic', icon: '🐎', cpBonus: 2400, level: 1, count: 1, description: 'Mythic Thunder Stallion mount granting +45% move speed boost.', isLocked: false },
                    { id: `mount-phoenix-${Date.now()}`, name: 'Celestial Phoenix Mount', type: 'mount', rarity: 'mythic', icon: '🦅', cpBonus: 2600, level: 1, count: 1, description: 'Divine Phoenix mount granting +45% move speed boost.', isLocked: false },
                    { id: `mount-voiddrake-${Date.now()}`, name: 'Void Shadow Drake Mount', type: 'mount', rarity: 'mythic', icon: '🐲', cpBonus: 2800, level: 1, count: 1, description: 'Supreme Void Drake mount granting +45% move speed boost.', isLocked: false }
                ];
                const mount = mountPool[Math.floor(Math.random() * mountPool.length)];
                if (!self.gameState.state.inventory)
                    self.gameState.state.inventory = [];
                const existing = self.gameState.state.inventory.find(i => i.name === mount.name);
                if (existing) {
                    existing.count = (existing.count || 1) + 1;
                    existing.level = (existing.level || 1) + 1;
                    existing.cpBonus = Math.floor((mount.cpBonus || 2500) * (1 + 0.2 * existing.level));
                    self.ui.showToast(`🐉 Upgraded ${mount.name} to Lvl ${existing.level}! (+${existing.cpBonus} CP)`, 'success');
                }
                else {
                    self.gameState.state.inventory.push(mount);
                    self.ui.showToast(`🐉 VICTORY! Obtained ${mount.name} (+${mount.cpBonus} CP)!`, 'success');
                }
                self.gameState.recalculateCP();
                self.gameState.notify();
                self.gameState.saveToFirebase();
                // Show Big Golden Victory Banner
                const banner = document.getElementById('dungeon-wave-banner');
                const textEl = document.getElementById('wave-banner-text');
                const subEl = document.getElementById('wave-sub-text');
                if (banner && textEl && subEl) {
                    textEl.innerText = `🐉 2X SIZE MOUNT BOSS SLAIN! 🐉`;
                    subEl.innerText = `OBTAINED MYTHIC MOUNT: ${mount.name.toUpperCase()}!`;
                    banner.classList.remove('hidden');
                    setTimeout(() => {
                        banner.classList.add('hidden');
                    }, 3200);
                }
            }
            triggerWorldTierIncreasedNotice(newTierNum) {
                self.audio.playSound('levelup');
                const banner = document.getElementById('dungeon-wave-banner');
                const textEl = document.getElementById('wave-banner-text');
                const subEl = document.getElementById('wave-sub-text');
                if (banner && textEl && subEl) {
                    textEl.innerText = `🏆 WAVE 10/10 CLEARED! 🏆`;
                    subEl.innerText = `WORLD TIER INCREASED TO TIER ${newTierNum}!`;
                    banner.classList.remove('hidden');
                    setTimeout(() => {
                        banner.classList.add('hidden');
                    }, 2400);
                }
                // DRAMATIC ZOOM IN AND OUT SCALE BOUNCE EFFECT ON WORLD TIER INCREASE
                const tierTextEl = document.getElementById('dungeon-world-tier-text');
                const containerEl = document.getElementById('world-tier-floating-container');
                if (tierTextEl) {
                    tierTextEl.innerText = `WORLD TIER ${newTierNum}`;
                }
                const targetAnimEl = containerEl || tierTextEl;
                if (targetAnimEl) {
                    // 1. ZOOM IN (SCALE UP TO 2.2X WITH INTENSE GLOW)
                    targetAnimEl.classList.remove('scale-100');
                    targetAnimEl.classList.add('scale-150', 'md:scale-[2.2]', 'drop-shadow-[0_0_50px_rgba(245,158,11,1)]', 'animate-pulse');
                    setTimeout(() => {
                        // 2. ZOOM OUT BACK TO NORMAL SCALE (1.0X)
                        targetAnimEl.classList.remove('scale-150', 'md:scale-[2.2]', 'drop-shadow-[0_0_50px_rgba(245,158,11,1)]', 'animate-pulse');
                        targetAnimEl.classList.add('scale-100');
                    }, 900);
                }
            }
            showFloatingExpText(expAmount, x, y) {
                if (this.activeExpPopupCount >= 8)
                    return;
                this.activeExpPopupCount++;
                const el = document.createElement('div');
                el.className = 'exp-popup-text';
                el.innerText = `+${expAmount} EXP`;
                el.style.left = `${x}px`;
                el.style.top = `${y - 45}px`;
                document.body.appendChild(el);
                setTimeout(() => {
                    this.activeExpPopupCount = Math.max(0, this.activeExpPopupCount - 1);
                    if (el && el.parentNode)
                        el.remove();
                }, 1000);
            }
            showFloatingLevelUpText(level) {
                const el = document.createElement('div');
                el.className = 'level-up-float-text';
                el.innerText = `⭐ LEVEL UP! LEVEL ${level} ⭐`;
                el.style.left = `${this.player.x}px`;
                el.style.top = `${this.player.y - 70}px`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 1200);
            }
            attackNearestEnemy() {
                if (this.isDead)
                    return;
                const enemies = this.enemies.getChildren().slice();
                const maxRange = this.getAttackRangeRadius();
                let targetEnemy = null;
                let minDist = Infinity;
                enemies.forEach((e) => {
                    if (!e || !e.active)
                        return;
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
                    if (dist <= maxRange && dist < minDist) {
                        minDist = dist;
                        targetEnemy = e;
                    }
                });
                if (targetEnemy) {
                    this.attackEnemy(targetEnemy);
                }
                else {
                    this.attackTowardsPointer(this.player.x + 100, this.player.y);
                }
            }
            showDamageText(damage, x, y) {
                if (this.activeDamageTextCount >= 20)
                    return;
                this.activeDamageTextCount++;
                const txt = this.add.text(x + (Math.random() * 20 - 10), y - 30, `-${damage}`, {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontStyle: 'bold',
                    color: '#fbbf24',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setDepth(110);
                this.tweens.add({
                    targets: txt,
                    y: y - 65,
                    alpha: 0,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 400,
                    ease: 'Power1',
                    onComplete: () => {
                        this.activeDamageTextCount = Math.max(0, this.activeDamageTextCount - 1);
                        if (txt && txt.destroy)
                            txt.destroy();
                    }
                });
            }
            showHeroDamageText(damage, x, y) {
                const txt = this.add.text(x, y - 35, `💥 -${damage} HP`, {
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontStyle: 'bold',
                    color: '#ef4444',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setDepth(110);
                this.tweens.add({
                    targets: txt,
                    y: y - 70,
                    alpha: 0,
                    scaleX: 1.4,
                    scaleY: 1.4,
                    duration: 450,
                    ease: 'Power1',
                    onComplete: () => txt.destroy()
                });
            }
            updateSoulKillMeterDOM() {
                const equippedCutscene = self.gameState.state.equippedCutscene;
                const containerEl = document.getElementById('soul-killmeter-container');
                // DO NOT SHOW SOUL METER IF NO CUTSCENE IS EQUIPPED OR NOT IN DUNGEON!
                if (!equippedCutscene || ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon') {
                    if (containerEl)
                        containerEl.classList.add('hidden');
                    return;
                }
                else {
                    if (containerEl && !this.isCutsceneActive)
                        containerEl.classList.remove('hidden');
                }
                const count = self.gameState.state.killMeter || 0;
                const textEl = document.getElementById('soul-meter-text');
                const btnEl = document.getElementById('soul-killmeter-btn');
                const ascEl = document.getElementById('ascension-lvl-text');
                if (textEl)
                    textEl.innerText = `${count}/100`;
                if (ascEl)
                    ascEl.innerText = `Lvl ${self.gameState.state.ascensionLevel || 0}`;
                if (btnEl) {
                    if (count >= 100) {
                        btnEl.classList.add('animate-bounce', 'ring-4', 'ring-purple-400', 'shadow-[0_0_30px_rgba(168,85,247,1)]');
                    }
                    else {
                        btnEl.classList.remove('animate-bounce', 'ring-4', 'ring-purple-400', 'shadow-[0_0_30px_rgba(168,85,247,1)]');
                    }
                }
            }
            triggerSuperPetMode() {
                if (this.isSuperPetMode)
                    return;
                this.isSuperPetMode = true;
                this.petSquadMeter = 0;
                this.updatePetSquadMeterDOM();
                self.audio.playSound('levelup');
                self.ui.showToast('🔥 PET RUSH MODE ACTIVATED! (5s 5X BOOST)', 'success');
                this.time.delayedCall(5000, () => {
                    this.isSuperPetMode = false;
                    self.ui.showToast('🐾 PET RUSH Mode ended.', 'info');
                });
            }
            triggerHeroTitanAuraMode() {
                const count = self.gameState.state.heroAuraMeter || 0;
                if (count < 100) {
                    self.ui.showToast(`🖤 BANKAI Meter not full yet! (${count}/100 Kills)`, 'warning');
                    return;
                }
                if (this.isHeroTitanMode)
                    return;
                this.isHeroTitanMode = true;
                self.gameState.state.heroAuraMeter = 0;
                this.updateHeroAuraMeterDOM();
                // 2X TEMPORARY CP BOOST
                const originalCP = self.gameState.state.cp || 35;
                self.gameState.state.cp = Math.floor(originalCP * 2);
                self.gameState.notify();
                self.audio.playSound('levelup');
                self.ui.showToast('🖤 BANKAI ACTIVATED! (2X CP BOOST, MOVE & ATTACK SPEED, MONOCHROME BLACK & WHITE FLAME AURA FOR 8S)', 'success');
                // MONOCHROME BLACK & WHITE FLASH
                this.cameras.main.flash(500, 0, 0, 0);
                // 8-SECOND DURATION
                this.time.delayedCall(8000, () => {
                    this.isHeroTitanMode = false;
                    // RESTORE NORMAL STATE & CP
                    self.gameState.state.cp = originalCP;
                    self.gameState.notify();
                    self.gameState.saveToFirebase();
                    self.ui.showToast('🖤 BANKAI Mode ended. CP returned to normal.', 'info');
                });
            }
            updateWorldTierDOM() {
                const tierTextEl = document.getElementById('dungeon-world-tier-text');
                const waveTextEl = document.getElementById('dungeon-wave-text');
                const tier = self.gameState.state.worldTier || 1;
                const wave = self.gameState.state.wave || 1;
                const waveKills = self.gameState.state.waveKills || 0;
                if (tierTextEl)
                    tierTextEl.innerText = `WORLD TIER ${tier}`;
                if (waveTextEl)
                    waveTextEl.innerText = `WAVE ${wave}/10 (${waveKills}/8 KILLS)`;
            }
            updateHeroAuraMeterDOM() {
                const textEl = document.getElementById('hero-aura-text');
                const btnEl = document.getElementById('hero-aura-meter-btn');
                const count = self.gameState.state.heroAuraMeter || 0;
                if (textEl)
                    textEl.innerText = `${count}/100`;
                if (btnEl) {
                    if (count >= 100 && !this.isHeroTitanMode) {
                        btnEl.classList.add('animate-bounce', 'ring-4', 'ring-amber-400', 'shadow-[0_0_30px_rgba(245,158,11,1)]');
                    }
                    else {
                        btnEl.classList.remove('animate-bounce', 'ring-4', 'ring-amber-400', 'shadow-[0_0_30px_rgba(245,158,11,1)]');
                    }
                }
            }
            updatePetSquadMeterDOM() {
                const textEl = document.getElementById('pet-meter-text');
                const btnEl = document.getElementById('pet-squad-meter-btn');
                const containerEl = document.getElementById('pet-squad-meter-container');
                const count = this.petSquadMeter || 0;
                let activePets = self.gameState.state.equippedPets || [];
                if (activePets.length === 0 && self.gameState.state.equippedPet) {
                    activePets = [self.gameState.state.equippedPet];
                }
                // HIDE PET RUSH METER IF NO ACTIVE PET IS EQUIPPED OR NOT IN DUNGEON!
                if (activePets.length === 0 || ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() !== 'dungeon') {
                    if (containerEl)
                        containerEl.classList.add('hidden');
                    return;
                }
                else {
                    if (containerEl)
                        containerEl.classList.remove('hidden');
                }
                if (textEl)
                    textEl.innerText = `${count}/100`;
                if (btnEl) {
                    if (count >= 100 && !this.isSuperPetMode) {
                        btnEl.classList.add('ring-4', 'ring-pink-400', 'shadow-[0_0_30px_rgba(244,114,182,1)]');
                    }
                    else {
                        btnEl.classList.remove('ring-4', 'ring-pink-400', 'shadow-[0_0_30px_rgba(244,114,182,1)]');
                    }
                }
            }
            updateCompanionPetLogic() {
                let activePets = self.gameState.state.equippedPets || [];
                if (activePets.length === 0 && self.gameState.state.equippedPet) {
                    activePets = [self.gameState.state.equippedPet];
                }
                if (!this.petSprites)
                    this.petSprites = [];
                if (!this.petStates)
                    this.petStates = [];
                if (!this.petKillCounts)
                    this.petKillCounts = [];
                if (!this.petLastAttackTimes)
                    this.petLastAttackTimes = [];
                // Clean up extra sprites if equipped pets count decreased
                while (this.petSprites.length > activePets.length) {
                    const sprite = this.petSprites.pop();
                    if (sprite)
                        sprite.destroy();
                    this.petStates.pop();
                    this.petKillCounts.pop();
                    this.petLastAttackTimes.pop();
                }
                const px = this.player.x;
                const py = this.player.y;
                const maxHeroRange = this.getAttackRangeRadius();
                const isSuper = this.isSuperPetMode;
                activePets.forEach((petData, index) => {
                    if (!this.petSprites[index] || !this.petSprites[index].active) {
                        const offsetX = (index % 3 - 1) * 45;
                        const offsetY = (Math.floor(index / 3) + 1) * 35;
                        let spriteKey = 'pet_flame_drake';
                        const name = petData.name || '';
                        if (name.includes('Kitsune'))
                            spriteKey = 'pet_thunder_kitsune';
                        else if (name.includes('Void') || name.includes('Behemoth'))
                            spriteKey = 'pet_void_behemoth';
                        else if (name.includes('Fenrir') || name.includes('Wolf'))
                            spriteKey = 'pet_ice_fenrir';
                        else if (name.includes('Gryphon'))
                            spriteKey = 'pet_golden_gryphon';
                        else if (name.includes('Kraken'))
                            spriteKey = 'pet_abyssal_kraken';
                        else if (name.includes('Sentinel') || name.includes('Mecha'))
                            spriteKey = 'pet_mecha_sentinel';
                        else if (name.includes('Unicorn'))
                            spriteKey = 'pet_star_unicorn';
                        else if (name.includes('Lion'))
                            spriteKey = 'pet_sunfire_lion';
                        else if (name.includes('Serpent'))
                            spriteKey = 'pet_emerald_serpent';
                        const sprite = this.add.sprite(px + offsetX, py + offsetY, spriteKey);
                        sprite.setScale(2.2);
                        sprite.setDepth(12);
                        this.petSprites[index] = sprite;
                        this.petStates[index] = 'hunting';
                        this.petKillCounts[index] = 0;
                        this.petLastAttackTimes[index] = 0;
                    }
                    const pet = this.petSprites[index];
                    const atkType = petData.petAttackType || 'slash';
                    // 5X SPEED, 5X ATTACK DAMAGE, 2X SIZE BOOST & RARITY-COLORED TEMPORARY AURA IN SUPER PET MODE
                    const currentScale = isSuper ? 4.4 : 2.2; // 2x Size Boost!
                    const currentSpeed = isSuper ? 18.0 : 6.5; // 5x Speed Boost!
                    const currentDmgMult = isSuper ? 5.0 : 1.0; // 5x Attack Boost!
                    pet.setScale(currentScale);
                    if (isSuper) {
                        let rarityColor = 0x94a3b8;
                        if (petData.rarity === 'rare')
                            rarityColor = 0x10b981;
                        if (petData.rarity === 'epic')
                            rarityColor = 0x06b6d4;
                        if (petData.rarity === 'legendary')
                            rarityColor = 0xf59e0b;
                        if (petData.rarity === 'mythic')
                            rarityColor = 0xef4444;
                        const time = this.time.now * 0.01;
                        this.auraGraphics.lineStyle(6, rarityColor, 0.95);
                        this.auraGraphics.strokeCircle(pet.x, pet.y, 45 + Math.sin(time * 6) * 6);
                        this.auraGraphics.fillStyle(rarityColor, 0.25);
                        this.auraGraphics.fillCircle(pet.x, pet.y, 45);
                    }
                    // 1. PET SEPARATION / BOIDS REPULSION LOGIC (PREVENTS COVERING & OVERLAPPING)
                    activePets.forEach((otherPetData, otherIndex) => {
                        if (index === otherIndex)
                            return;
                        const otherPet = this.petSprites[otherIndex];
                        if (!otherPet || !otherPet.active)
                            return;
                        const distBetweenPets = Phaser.Math.Distance.Between(pet.x, pet.y, otherPet.x, otherPet.y);
                        const minSeparation = 55; // 55px minimum separation buffer
                        if (distBetweenPets < minSeparation && distBetweenPets > 0) {
                            const repAngle = Phaser.Math.Angle.Between(otherPet.x, otherPet.y, pet.x, pet.y);
                            const pushForce = (minSeparation - distBetweenPets) * 0.25;
                            pet.x += Math.cos(repAngle) * pushForce;
                            pet.y += Math.sin(repAngle) * pushForce;
                        }
                    });
                    if ((this.petKillCounts[index] || 0) >= 3) {
                        this.petStates[index] = 'returning';
                    }
                    if (this.petStates[index] === 'returning') {
                        const distToHero = Phaser.Math.Distance.Between(pet.x, pet.y, px, py);
                        const angle = Phaser.Math.Angle.Between(pet.x, pet.y, px, py);
                        pet.x += Math.cos(angle) * (currentSpeed * 1.2);
                        pet.y += Math.sin(angle) * (currentSpeed * 1.2);
                        if (distToHero <= 40) {
                            this.petKillCounts[index] = 0;
                            this.petStates[index] = 'hunting';
                            this.showFloatingPetText(`✨ RECHARGED ${petData.name}! 🐾`, px, py);
                            self.audio.playSound('levelup');
                        }
                    }
                    else {
                        // 2. SEPARATED TARGET SELECTION (DISTRIBUTE PETS ACROSS DIFFERENT ENEMIES)
                        const activeEnemies = this.enemies.getChildren().filter((e) => e.active && !e.isDefeated);
                        let targetEnemy = null;
                        if (activeEnemies.length > 0) {
                            // Assign distinct enemy per pet index so pets attack separated enemies!
                            targetEnemy = activeEnemies[index % activeEnemies.length];
                        }
                        if (targetEnemy) {
                            // Add a unique orbital angle offset for each pet so pets attack from different flanks
                            const petOffsetAngle = index * ((2 * Math.PI) / Math.max(1, activePets.length));
                            const destX = targetEnemy.x + Math.cos(petOffsetAngle) * 35;
                            const destY = targetEnemy.y + Math.sin(petOffsetAngle) * 35;
                            const distToEnemy = Phaser.Math.Distance.Between(pet.x, pet.y, destX, destY);
                            const angle = Phaser.Math.Angle.Between(pet.x, pet.y, destX, destY);
                            pet.x += Math.cos(angle) * currentSpeed;
                            pet.y += Math.sin(angle) * currentSpeed;
                            // EXECUTE UNIQUE ATTACK PATTERN FOR EACH PET VARIANT (WITH ATTACK COOLDOWN)
                            const now = this.time.now;
                            const lastAtk = this.petLastAttackTimes[index] || 0;
                            const petAtkCooldown = isSuper ? 300 : 600;
                            if (distToEnemy <= (atkType === 'sniper' || atkType === 'laser' ? 240 : 65) && (now - lastAtk >= petAtkCooldown)) {
                                this.petLastAttackTimes[index] = now;
                                const petDamage = Math.floor((petData.cpBonus || 45) * (petData.level || 1) * 1.6 * currentDmgMult);
                                targetEnemy.hp -= petDamage;
                                this.showDamageText(petDamage, targetEnemy.x, targetEnemy.y);
                                if (atkType === 'sniper') {
                                    const bolt = this.add.graphics().setDepth(20);
                                    bolt.lineStyle(3, 0x38bdf8, 1);
                                    bolt.lineBetween(pet.x, pet.y, targetEnemy.x, targetEnemy.y);
                                    this.tweens.add({ targets: bolt, alpha: 0, duration: 150, onComplete: () => bolt.destroy() });
                                }
                                else if (atkType === 'laser') {
                                    const beam = this.add.graphics().setDepth(20);
                                    beam.lineStyle(8, 0x06b6d4, 0.9);
                                    beam.lineBetween(pet.x, pet.y, targetEnemy.x, targetEnemy.y);
                                    this.tweens.add({ targets: beam, alpha: 0, scaleY: 2, duration: 200, onComplete: () => beam.destroy() });
                                }
                                else if (atkType === 'mage') {
                                    const nova = this.add.graphics().setDepth(20);
                                    nova.lineStyle(4, 0xa855f7, 1);
                                    nova.strokeCircle(targetEnemy.x, targetEnemy.y, 25);
                                    this.tweens.add({ targets: nova, alpha: 0, scaleX: 1.8, scaleY: 1.8, duration: 220, onComplete: () => nova.destroy() });
                                }
                                else if (atkType === 'shield') {
                                    const shock = this.add.graphics().setDepth(20);
                                    shock.lineStyle(5, 0xfacc15, 1);
                                    shock.strokeCircle(targetEnemy.x, targetEnemy.y, 35);
                                    this.tweens.add({ targets: shock, alpha: 0, scaleX: 1.6, scaleY: 1.6, duration: 200, onComplete: () => shock.destroy() });
                                }
                                else {
                                    const clawFx = this.add.graphics().setDepth(20);
                                    clawFx.lineStyle(5, 0xf472b6, 1);
                                    clawFx.lineBetween(targetEnemy.x - 20, targetEnemy.y - 20, targetEnemy.x + 20, targetEnemy.y + 20);
                                    clawFx.lineBetween(targetEnemy.x - 10, targetEnemy.y - 25, targetEnemy.x + 25, targetEnemy.y + 10);
                                    this.tweens.add({ targets: clawFx, alpha: 0, scaleX: 1.5, scaleY: 1.5, duration: 180, onComplete: () => clawFx.destroy() });
                                }
                                if (targetEnemy.hp <= 0 && !targetEnemy.isDefeated) {
                                    this.petKillCounts[index] = (this.petKillCounts[index] || 0) + 1;
                                    this.onEnemyDefeated(targetEnemy, targetEnemy.x, targetEnemy.y);
                                }
                            }
                        }
                        else {
                            // 3. UNIQUE ORBITAL STANCE FORMATION AROUND HERO (NO CLUMPING)
                            const orbitAngle = index * ((2 * Math.PI) / Math.max(1, activePets.length));
                            const heroStanceX = px + Math.cos(orbitAngle) * 70;
                            const heroStanceY = py + Math.sin(orbitAngle) * 70;
                            const distToStance = Phaser.Math.Distance.Between(pet.x, pet.y, heroStanceX, heroStanceY);
                            if (distToStance > 15) {
                                const angle = Phaser.Math.Angle.Between(pet.x, pet.y, heroStanceX, heroStanceY);
                                pet.x += Math.cos(angle) * 5.5;
                                pet.y += Math.sin(angle) * 5.5;
                            }
                        }
                    }
                });
            }
            showFloatingPetText(text, x, y) {
                const el = document.createElement('div');
                el.className = 'level-up-float-text';
                el.innerText = text;
                el.style.color = '#f472b6';
                el.style.left = `${x}px`;
                el.style.top = `${y - 60}px`;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 900);
            }
            triggerCutscene() {
                const count = self.gameState.state.killMeter || 0;
                if (count < 100) {
                    self.ui.showToast(`👻 Soul Meter not full yet! (${count}/100 Kills)`, 'warning');
                    return;
                }
                if (this.isCutsceneActive)
                    return;
                this.isCutsceneActive = true;
                // Automatically turn ON Auto Battle when cutscene is triggered!
                if (!self.isAutoBattle) {
                    self.toggleAutoBattle();
                }
                // Disable IDLE AFK Timer during cutscene!
                ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
                self.gameState.state.killMeter = 0;
                this.updateSoulKillMeterDOM();
                const cutscene = self.gameState.state.equippedCutscene;
                const cutsceneId = cutscene?.cutsceneId || 'shadow_arise';
                const title = cutscene ? cutscene.name : 'SHADOW ARISE';
                const overlay = document.getElementById('cutscene-overlay');
                const bgImage = document.getElementById('cutscene-bg-image');
                const strobeEl = document.getElementById('cutscene-strobe-flash');
                const titleEl = document.getElementById('cutscene-title');
                const subEl = document.getElementById('cutscene-subtitle');
                const titleBox = document.getElementById('cutscene-title-box');
                const titleSlashLine = document.getElementById('title-slash-line');
                const whiteFlashEl = document.getElementById('cutscene-white-flash');
                if (overlay)
                    overlay.classList.remove('hidden');
                if (whiteFlashEl)
                    whiteFlashEl.style.opacity = '0';
                if (titleEl)
                    titleEl.innerText = title;
                if (subEl) {
                    if (cutsceneId === 'shadow_arise')
                        subEl.innerText = '🌑 SHADOW MONARCH ARMY ARISE • NOIR VOID SLASH!';
                    else if (cutsceneId === 'getsuga_tensho')
                        subEl.innerText = '⚔️ GETSUGA TENSHO • CRESCENT MOON KATANA BLADE!';
                    else
                        subEl.innerText = '💥 I AM ATOMIC • SCREEN SHATTERING ATOMIC EXPLOSION!';
                }
                // Trigger Title Zoom-In & Katana Slash FX
                if (titleBox) {
                    titleBox.className = 'relative z-20 text-center space-y-3 p-4 max-w-4xl pointer-events-none transform transition-all duration-500 scale-150 opacity-0';
                    setTimeout(() => {
                        titleBox.className = 'relative z-20 text-center space-y-3 p-4 max-w-4xl pointer-events-none transform transition-all duration-500 scale-100 opacity-100';
                    }, 100);
                }
                if (titleSlashLine) {
                    titleSlashLine.className = 'w-[140%] h-3.5 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-x-0 opacity-0 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,1)]';
                    setTimeout(() => {
                        titleSlashLine.className = 'w-[140%] h-3.5 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-x-100 opacity-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,1)]';
                        self.audio.playSound('hit');
                    }, 450);
                }
                // Apply distinct background filter styling per variant
                if (bgImage) {
                    if (cutsceneId === 'shadow_arise') {
                        bgImage.className = 'absolute inset-0 w-full h-full object-cover filter contrast-200 brightness-90 hue-rotate-270 opacity-80 transition-all duration-700 transform scale-105';
                    }
                    else if (cutsceneId === 'i_am_atomic') {
                        bgImage.className = 'absolute inset-0 w-full h-full object-cover filter contrast-200 brightness-120 sepia opacity-85 transition-all duration-700 transform scale-105';
                    }
                    else {
                        bgImage.className = 'absolute inset-0 w-full h-full object-cover filter grayscale contrast-200 brightness-110 opacity-80 transition-all duration-700 transform scale-105';
                    }
                }
                const header = document.querySelector('header');
                const footer = document.getElementById('hud-bottom-bar');
                const rightMeters = document.getElementById('hud-bottom-right-meters');
                if (header)
                    header.classList.add('hidden');
                if (footer)
                    footer.classList.add('hidden');
                if (rightMeters)
                    rightMeters.classList.add('hidden');
                self.audio.playSound('levelup');
                const cutsceneGraphics = this.add.graphics().setDepth(200);
                let secondsLeft = 3.0;
                let isStrobeOn = false;
                const cutsceneInterval = setInterval(() => {
                    secondsLeft -= 0.1;
                    if (!this.player || !this.player.active || !cutsceneGraphics || !cutsceneGraphics.active) {
                        clearInterval(cutsceneInterval);
                        if (strobeEl)
                            strobeEl.style.opacity = '0';
                        this.isCutsceneActive = false;
                        return;
                    }
                    // 1. FAST FLASHING STROBE LIGHT ON & OFF
                    if (strobeEl) {
                        isStrobeOn = !isStrobeOn;
                        strobeEl.style.opacity = isStrobeOn ? '0.7' : '0';
                    }
                    // 2. BACKGROUND ZOOM-IN WITH CLIMAX TENSION IN THE END OF DURATION (FINAL 1.0s)
                    if (bgImage && secondsLeft <= 1.0) {
                        bgImage.className = `absolute inset-0 w-full h-full object-cover filter contrast-300 brightness-150 transition-all duration-500 transform scale-140 ${cutsceneId === 'shadow_arise' ? 'hue-rotate-270' : cutsceneId === 'i_am_atomic' ? 'sepia' : 'grayscale'}`;
                        this.cameras.main.shake(120, 0.015);
                    }
                    cutsceneGraphics.clear();
                    const px = this.player.x;
                    const py = this.player.y;
                    const time = this.time.now * 0.012;
                    // DYNAMIC HIGH-CONTRAST KATANA SLASH BEAM ARCS & MANGA SPEED LINES
                    const slashAngle = time * 4.5;
                    const slashRadius = 240 + Math.sin(time * 8) * 80;
                    // Pure white high-voltage katana slash beam
                    cutsceneGraphics.lineStyle(28, 0xffffff, 0.95);
                    cutsceneGraphics.arc(px, py, slashRadius, slashAngle - 1.2, slashAngle + 1.2, false);
                    // Secondary noir black accent slash outline
                    cutsceneGraphics.lineStyle(14, 0x000000, 1);
                    cutsceneGraphics.arc(px, py, slashRadius - 8, slashAngle - 1.0, slashAngle + 1.0, false);
                    // Manga flash speed lines across player
                    for (let i = 0; i < 8; i++) {
                        const angle = (i * Math.PI / 4) + time;
                        const startX = px + Math.cos(angle) * 50;
                        const startY = py + Math.sin(angle) * 50;
                        const endX = px + Math.cos(angle) * (200 + i * 25);
                        const endY = py + Math.sin(angle) * (200 + i * 25);
                        cutsceneGraphics.lineStyle(3, 0xffffff, 0.9);
                        cutsceneGraphics.lineBetween(startX, startY, endX, endY);
                    }
                    if (secondsLeft <= 0) {
                        clearInterval(cutsceneInterval);
                        if (strobeEl)
                            strobeEl.style.opacity = '0';
                        if (cutsceneGraphics && cutsceneGraphics.active)
                            cutsceneGraphics.destroy();
                        // INSTANT PURE WHITE SCREEN FLASH
                        if (whiteFlashEl) {
                            whiteFlashEl.style.opacity = '1';
                        }
                        // Clear out ALL active enemies completely
                        this.enemies.getChildren().forEach((e) => {
                            if (e && e.active) {
                                e.hp = 0;
                                this.onEnemyDefeated(e, e.x, e.y);
                            }
                        });
                        // Temporarily pause enemy spawning for 1.5 seconds after cutscene
                        this.isSpawnPaused = true;
                        this.time.delayedCall(1500, () => {
                            this.isSpawnPaused = false;
                            if (ScreenManager_1.ScreenManager.getInstance().getCurrentScreen() === 'dungeon' && !this.isDead) {
                                this.ensureMinimumMonsters(10);
                            }
                        });
                        self.audio.playSound('levelup');
                        self.ui.showToast('💥 ULTIMATE CUTSCENE EXECUTED! ALL ENEMIES ANNIHILATED!', 'success');
                        if (overlay)
                            overlay.classList.add('hidden');
                        if (header)
                            header.classList.remove('hidden');
                        if (footer)
                            footer.classList.remove('hidden');
                        if (rightMeters)
                            rightMeters.classList.remove('hidden');
                        this.isCutsceneActive = false;
                        // SLOWLY FADE OUT WHITE FLASH TO REVEAL DUNGEON IN NORMAL STATE
                        setTimeout(() => {
                            if (whiteFlashEl)
                                whiteFlashEl.style.opacity = '0';
                        }, 200);
                    }
                }, 100);
            }
        }
        this.phaserGame = new Phaser.Game({
            type: Phaser.AUTO,
            parent: 'game-container',
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#01140e',
            scene: MainGameScene
        });
        window.addEventListener('resize', () => {
            if (this.phaserGame) {
                this.phaserGame.scale.resize(window.innerWidth, window.innerHeight);
            }
        });
        const autoBattleBtn = document.getElementById('btn-toggle-autobattle');
        if (autoBattleBtn) {
            autoBattleBtn.onclick = () => this.toggleAutoBattle();
        }
    }
    toggleAutoBattle() {
        this.isAutoBattle = !this.isAutoBattle;
        const btn = document.getElementById('btn-toggle-autobattle');
        const statusText = document.getElementById('autobattle-status-text');
        if (btn) {
            if (this.isAutoBattle) {
                btn.className = 'w-20 h-20 md:w-24 md:h-24 rounded-3xl glass-panel border-2 border-emerald-400 bg-gradient-to-b from-emerald-600 via-emerald-800 to-black flex flex-col items-center justify-center text-emerald-200 shadow-[0_0_35px_rgba(16,185,129,1)] ring-4 ring-emerald-400 animate-pulse transition hover:scale-110 active:scale-95 group relative cursor-pointer';
                if (statusText)
                    statusText.innerText = 'ON 🔥';
                this.ui.showToast('⚔️ AUTO Mode (Battle & Loot Collect) Activated!', 'success');
            }
            else {
                btn.className = 'w-20 h-20 md:w-24 md:h-24 rounded-3xl glass-panel border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-950 via-slate-900 to-black flex flex-col items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition hover:scale-110 active:scale-95 group relative cursor-pointer';
                if (statusText)
                    statusText.innerText = 'OFF';
                this.ui.showToast('⚔️ AUTO Mode Deactivated.', 'info');
            }
        }
        ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
        this.audio.playSound('click');
    }
    triggerAttack() {
        ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
        if (this.phaserScene) {
            this.phaserScene.attackNearestEnemy();
        }
    }
    triggerSuperPetMode() {
        if (this.phaserScene) {
            this.phaserScene.triggerSuperPetMode();
        }
    }
    triggerHeroTitanAuraMode() {
        if (this.phaserScene) {
            this.phaserScene.triggerHeroTitanAuraMode();
        }
    }
    triggerSoulCutscene() {
        if (this.phaserScene) {
            this.phaserScene.triggerCutscene();
        }
    }
    onEnter() {
        ScreenManager_1.ScreenManager.getInstance().resetDungeonAfkTimer();
        ['dungeon-hero-stats-dock', 'hero-aura-meter-container'].forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.remove('hidden');
        });
        if (this.phaserScene) {
            this.phaserScene.updateSoulKillMeterDOM();
            this.phaserScene.updatePetSquadMeterDOM();
        }
    }
    onLeave() {
        ['dungeon-hero-stats-dock', 'hero-aura-meter-container', 'pet-squad-meter-container', 'soul-killmeter-container'].forEach(id => {
            const el = document.getElementById(id);
            if (el)
                el.classList.add('hidden');
        });
    }
}
exports.DungeonScreen = DungeonScreen;
