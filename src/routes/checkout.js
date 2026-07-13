import { Router } from 'express';
import { checkout, getLibrary } from '../controllers/gamesController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/checkout (requiere usuario autenticado)
router.post('/', verifyToken, checkout);

// GET /api/checkout/library (requiere usuario autenticado)
router.get('/library', verifyToken, getLibrary);

export default router;
