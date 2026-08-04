import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Security Hardening & Static File Serving
app.use(helmet({
  contentSecurityPolicy: false // Allow external CDN scripts for Phaser & Tailwind
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('public')));

const apiLimiter = rateLimit({
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
  res.sendFile(path.resolve('public/index.html'));
});

// In-Memory Authoritative Multi-Account Player Sync
interface PlayerState {
  id: string;
  userId: string;
  heroName: string;
  x: number;
  y: number;
  jobClass: 'WARRIOR' | 'MAGE' | 'ARCHER';
  hp: number;
  maxHp: number;
  level: number;
  lastAttackTime: number;
}

const players: Record<string, PlayerState> = {};

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

  socket.on('joinRealm', (profile: { userId: string; heroName: string; jobClass: 'WARRIOR' | 'MAGE' | 'ARCHER'; level: number; hp?: number; maxHp?: number }) => {
    if (players[socket.id]) {
      players[socket.id].userId = profile.userId || players[socket.id].userId;
      players[socket.id].heroName = profile.heroName || players[socket.id].heroName;
      players[socket.id].jobClass = profile.jobClass || players[socket.id].jobClass;
      players[socket.id].level = profile.level || players[socket.id].level;
      if (profile.hp) players[socket.id].hp = profile.hp;
      if (profile.maxHp) players[socket.id].maxHp = profile.maxHp;

      io.emit('playerUpdated', players[socket.id]);
    }
  });

  socket.on('playerInput', (data: { x: number; y: number }) => {
    const player = players[socket.id];
    if (player) {
      player.x = data.x;
      player.y = data.y;
      socket.broadcast.emit('playerMoved', { id: socket.id, userId: player.userId, heroName: player.heroName, x: player.x, y: player.y });
    }
  });

  socket.on('attackIntent', (targetId: string) => {
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

export default app;


