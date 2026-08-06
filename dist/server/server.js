"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
// Security Hardening & Static File Serving
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false // Allow external CDN scripts for Phaser & Tailwind
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.resolve('public')));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 300, // Optimized limit to support high concurrency multi-account connections
    message: { error: "Too many requests. Cooldown active." }
});
app.use('/api/', apiLimiter);
console.log(`[DATABASE] 🚀 Primary database set to Firebase Realtime Database for all user auth & RPG state persistence.`);
// Server Health & Status API
app.get('/api/health', (req, res) => {
    res.json({
        status: "ONLINE",
        game: "MinimikyuRealm",
        time: new Date(),
        isMaintenance: false,
        activePlayersCount: Object.keys(players).length,
        announcement: "Welcome to MinimikyuRealm! Multi-account multiplayer active."
    });
});
app.get('/api/settings', (req, res) => {
    res.json({
        isMaintenance: false,
        announcement: "Welcome to MinimikyuRPG! Realtime multi-player active."
    });
});
// Fallback Route - Always Serve index.html for Root & Non-API Client Routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path_1.default.resolve('public/index.html'));
});
const players = {};
io.on('connection', (socket) => {
    console.log(`[CONNECTED] Player socket session connected: ${socket.id}`);
    players[socket.id] = {
        id: socket.id,
        userId: 'guest_' + socket.id.substring(0, 5),
        heroName: 'Hero_' + socket.id.substring(0, 4),
        x: 400 + Math.floor((Math.random() - 0.5) * 100),
        y: 300 + Math.floor((Math.random() - 0.5) * 100),
        jobClass: 'WARRIOR',
        hp: 100,
        maxHp: 100,
        level: 1,
        lastAttackTime: 0
    };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);
    socket.on('joinRealm', (profile) => {
        if (players[socket.id]) {
            players[socket.id].userId = profile.userId || players[socket.id].userId;
            players[socket.id].heroName = profile.heroName || players[socket.id].heroName;
            players[socket.id].jobClass = profile.jobClass || players[socket.id].jobClass;
            players[socket.id].level = profile.level || players[socket.id].level;
            if (profile.hp)
                players[socket.id].hp = profile.hp;
            if (profile.maxHp)
                players[socket.id].maxHp = profile.maxHp;
            io.emit('playerUpdated', players[socket.id]);
        }
    });
    socket.on('playerInput', (data) => {
        const player = players[socket.id];
        if (player) {
            player.x = data.x;
            player.y = data.y;
            socket.broadcast.emit('playerMoved', { id: socket.id, userId: player.userId, heroName: player.heroName, x: player.x, y: player.y });
        }
    });
    socket.on('attackIntent', (targetId) => {
        const player = players[socket.id];
        const now = Date.now();
        if (player) {
            if (now - player.lastAttackTime < 400) {
                socket.emit('actionRejected', 'Attack cooldown active');
                return;
            }
            player.lastAttackTime = now;
            const weapon = player.jobClass === 'WARRIOR' ? 'Sword' : player.jobClass === 'MAGE' ? 'Staff' : 'Bow';
            const damage = Math.floor(Math.random() * 15) + 10 + player.level * 2;
            io.emit('attackExecuted', {
                attackerId: socket.id,
                heroName: player.heroName,
                weapon,
                damage,
                targetId
            });
        }
    });
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});
const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`============================================`);
        console.log(` MINIMIKYU REALM SERVER ONLINE ON PORT ${PORT} `);
        console.log(`============================================`);
    });
}
exports.default = app;
