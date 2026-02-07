import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { signUpValidation, signInValidation } from '../middleware/validation.middleware';
import { validationResult } from 'express-validator';

const router = Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', signUpValidation, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, name } = req.body;
        const user = await authService.signUp(email, password, name);

        res.status(201).json({ user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * POST /api/auth/signin
 * Sign in a user
 */
router.post('/signin', signInValidation, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;
        const result = await authService.signIn(email, password);

        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

/**
 * POST /api/auth/signout
 * Sign out a user
 */
router.post('/signout', async (req: Request, res: Response) => {
    res.json({ message: 'Signed out successfully' });
});

export default router;
