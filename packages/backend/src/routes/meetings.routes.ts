import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';
import { createMeetingValidation } from '../middleware/validation.middleware';
import { validationResult } from 'express-validator';
import { transcriptionService } from '../services/transcription.service';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/meetings
 * Get all meetings for the authenticated user
 */
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const meetings = await prisma.meeting.findMany({
            where: { userId: req.user!.id },
            include: {
                transcript: {
                    include: {
                        speakers: true,
                    },
                },
                participants: true,
            },
            orderBy: { date: 'desc' },
        });

        res.json({ meetings });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/meetings/:id
 * Get a specific meeting
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const meeting = await prisma.meeting.findFirst({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
            include: {
                transcript: {
                    include: {
                        segments: {
                            include: {
                                speaker: true,
                            },
                            orderBy: { startTime: 'asc' },
                        },
                        speakers: true,
                    },
                },
                participants: true,
            },
        });

        if (!meeting) {
            res.status(404).json({ error: 'Meeting not found' });
            return;
        }

        res.json({ meeting });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/meetings
 * Create a new meeting
 */
router.post('/', createMeetingValidation, async (req: AuthRequest, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { title, date, platform } = req.body;

        const meeting = await prisma.meeting.create({
            data: {
                userId: req.user!.id,
                title,
                date: date ? new Date(date) : new Date(),
                platform,
                duration: 0,
                status: 'RECORDING',
            },
        });

        res.status(201).json({ meeting });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/meetings/:id
 * Update a meeting
 */
router.patch('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { title, duration, status, audioUrl } = req.body;

        const meeting = await prisma.meeting.updateMany({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
            data: {
                ...(title && { title }),
                ...(duration !== undefined && { duration }),
                ...(status && { status }),
                ...(audioUrl && { audioUrl }),
            },
        });

        if (meeting.count === 0) {
            res.status(404).json({ error: 'Meeting not found' });
            return;
        }

        const updated = await prisma.meeting.findUnique({
            where: { id: req.params.id },
        });

        if (updated && status === 'PROCESSING' && updated.audioUrl) {
            await transcriptionService.queueTranscription({
                meetingId: updated.id,
                audioUrl: updated.audioUrl,
                userId: updated.userId,
            });
        }

        res.json({ meeting: updated });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/meetings/:id
 * Delete a meeting
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const deleted = await prisma.meeting.deleteMany({
            where: {
                id: req.params.id,
                userId: req.user!.id,
            },
        });

        if (deleted.count === 0) {
            res.status(404).json({ error: 'Meeting not found' });
            return;
        }

        res.json({ message: 'Meeting deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
