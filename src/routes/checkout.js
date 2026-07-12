import { Router } from 'express';
import { checkout } from '../controllers/gamesController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/checkout (requiere usuario autenticado)
router.post('/', verifyToken, checkout);

export default router;
