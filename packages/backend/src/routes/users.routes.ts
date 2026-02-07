import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            include: {
                settings: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch('/me', async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user!.id },
            data: {
                ...(name && { name }),
            },
        });

        res.json({ user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/users/me/settings
 * Get user settings
 */
router.get('/me/settings', async (req: AuthRequest, res: Response) => {
    try {
        let settings = await prisma.userSettings.findUnique({
            where: { userId: req.user!.id },
        });

        // Create default settings if they don't exist
        if (!settings) {
            settings = await prisma.userSettings.create({
                data: {
                    userId: req.user!.id,
                },
            });
        }

        res.json({ settings });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/users/me/settings
 * Update user settings
 */
router.patch('/me/settings', async (req: AuthRequest, res: Response) => {
    try {
        const { defaultLanguage, autoSync, notifications } = req.body;

        const settings = await prisma.userSettings.upsert({
            where: { userId: req.user!.id },
            update: {
                ...(defaultLanguage && { defaultLanguage }),
                ...(autoSync !== undefined && { autoSync }),
                ...(notifications !== undefined && { notifications }),
            },
            create: {
                userId: req.user!.id,
                ...(defaultLanguage && { defaultLanguage }),
                ...(autoSync !== undefined && { autoSync }),
                ...(notifications !== undefined && { notifications }),
            },
        });

        res.json({ settings });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
