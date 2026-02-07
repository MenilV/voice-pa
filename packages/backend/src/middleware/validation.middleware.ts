import { body, ValidationChain } from 'express-validator';

export const signUpValidation: ValidationChain[] = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
];

export const signInValidation: ValidationChain[] = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const createMeetingValidation: ValidationChain[] = [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('platform').isIn(['MOBILE', 'MEET', 'ZOOM']).withMessage('Invalid platform'),
];
