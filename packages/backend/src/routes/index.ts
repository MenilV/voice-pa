import { Router } from 'express';
import authRoutes from './auth.routes';
import meetingsRoutes from './meetings.routes';
import usersRoutes from './users.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/meetings', meetingsRoutes);
router.use('/users', usersRoutes);

export default router;
