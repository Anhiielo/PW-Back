import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import gamesRouter from './routes/games.js';
import authRouter from './routes/auth.js';
import checkoutRouter from './routes/checkout.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// ─── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/games', gamesRouter);
app.use('/api/auth', authRouter);
app.use('/api/checkout', checkoutRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.path} no encontrada.` });
});

// ─── Inicio ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 PeKeys API corriendo en http://localhost:${PORT}`);
  console.log(`🌐 CORS habilitado para: ${FRONTEND_URL}`);
  console.log(`\nEndpoints disponibles:`);
  console.log(`  GET    /api/health`);
  console.log(`  GET    /api/games`);
  console.log(`  GET    /api/games/:id`);
  console.log(`  POST   /api/games`);
  console.log(`  PUT    /api/games/:id`);
  console.log(`  DELETE /api/games/:id`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/checkout\n`);
});
