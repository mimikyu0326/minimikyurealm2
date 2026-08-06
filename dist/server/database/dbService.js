"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSettings = getServerSettings;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.savePlayerStats = savePlayerStats;
const prisma_1 = __importDefault(require("./prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'minimikyu_ultra_secure_secret_key_2026';
async function getServerSettings() {
    let settings = await prisma_1.default.serverSetting.findUnique({ where: { id: 1 } });
    if (!settings) {
        settings = await prisma_1.default.serverSetting.create({
            data: {
                id: 1,
                isMaintenance: false,
                announcement: "Welcome to Minimikyu RPG! Defeat monsters to grow stronger."
            }
        });
    }
    return settings;
}
async function registerUser(username, passwordHashRaw, jobClass = 'WARRIOR') {
    const existing = await prisma_1.default.user.findUnique({ where: { username } });
    if (existing) {
        throw new Error('Username already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(passwordHashRaw, 10);
    const user = await prisma_1.default.user.create({
        data: {
            username,
            password: hashedPassword,
            character: {
                create: {
                    name: username,
                    jobClass: jobClass.toUpperCase(),
                    level: 1,
                    exp: 0,
                    hp: 100,
                    maxHp: 100,
                    combatPower: 30,
                    statPoints: 0,
                    str: 5,
                    int: 5,
                    agi: 5,
                    vit: 5
                }
            }
        },
        include: {
            character: true
        }
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
}
async function loginUser(username, passwordHashRaw) {
    const user = await prisma_1.default.user.findUnique({
        where: { username },
        include: { character: { include: { equipment: true, inventory: true } } }
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isValid = await bcryptjs_1.default.compare(passwordHashRaw, user.password);
    if (!isValid) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
}
async function savePlayerStats(characterId, level, hp, maxHp, exp) {
    return await prisma_1.default.character.update({
        where: { id: characterId },
        data: { level, hp, maxHp, exp }
    });
}
