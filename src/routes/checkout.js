import { Router } from 'express';
import { checkout } from '../controllers/gamesController.js';

const router = Router();

// POST /api/checkout
router.post('/', checkout);

export default router;
