import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}

export class AuthService {
    /**
     * Sign up a new user with Supabase
     */
    async signUp(email: string, password: string, name?: string): Promise<AuthUser> {
        try {
            // Create user in Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            if (!data.user) throw new Error('Failed to create user');

            // Create user in our database
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    supabaseId: data.user.id,
                    subscription: 'FREE',
                },
            });

            logger.info(`User created: ${user.id}`);

            return {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
            };
        } catch (error) {
            logger.error('Sign up error:', error);
            throw error;
        }
    }

    /**
     * Sign in a user with Supabase
     */
    async signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            if (!data.user) throw new Error('Invalid credentials');

            // Get user from our database
            const user = await prisma.user.findUnique({
                where: { supabaseId: data.user.id },
            });

            if (!user) throw new Error('User not found');

            // Generate JWT token
            const token = this.generateToken(user.id);

            logger.info(`User signed in: ${user.id}`);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name || undefined,
                },
                token,
            };
        } catch (error) {
            logger.error('Sign in error:', error);
            throw error;
        }
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): { userId: string } {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(userId: string): string {
        return jwt.sign({ userId }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        });
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<AuthUser | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
        };
    }

    /**
     * Sign out (invalidate token on client side)
     */
    async signOut(userId: string): Promise<void> {
        logger.info(`User signed out: ${userId}`);
        // In a production app, you might want to blacklist the token
    }
}

export const authService = new AuthService();
