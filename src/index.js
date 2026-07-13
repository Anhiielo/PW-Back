import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { sequelize } from './models/index.js';
import gamesRouter from './routes/games.js';
import authRouter from './routes/auth.js';
import checkoutRouter from './routes/checkout.js';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim());

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: allowedOrigins,
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

// ─── Conexión a DB e Inicio ─────────────────────────────────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');

    // sync() crea las tablas si no existen (alter: true actualiza cambios)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`\n🚀 PeKeys API corriendo en http://localhost:${PORT}`);
      console.log(`🌐 CORS habilitado para: ${FRONTEND_URL}`);
      console.log(`\nEndpoints disponibles:`);
      console.log(`  GET    /api/health`);
      console.log(`  GET    /api/games`);
      console.log(`  GET    /api/games/:id`);
      console.log(`  POST   /api/games          (admin)`);
      console.log(`  PUT    /api/games/:id       (admin)`);
      console.log(`  DELETE /api/games/:id       (admin)`);
      console.log(`  POST   /api/auth/login`);
      console.log(`  POST   /api/auth/register`);
      console.log(`  POST   /api/checkout        (auth)\n`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

start();
