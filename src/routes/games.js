import { Router } from 'express';
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/gamesController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.get('/', getAllGames);
router.get('/:id', getGameById);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, isAdmin, createGame);
router.put('/:id', verifyToken, isAdmin, updateGame);
router.delete('/:id', verifyToken, isAdmin, deleteGame);

export default router;
