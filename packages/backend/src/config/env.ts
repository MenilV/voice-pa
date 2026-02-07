import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

export const env = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    HOST: process.env.HOST || '0.0.0.0',

    // Database
    DATABASE_URL: process.env.DATABASE_URL!,

    // Redis
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,

    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,

    // Storage
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT!,
    STORAGE_REGION: process.env.STORAGE_REGION || 'us-east-1',
    STORAGE_BUCKET: process.env.STORAGE_BUCKET || 'voice-pa-recordings',
    STORAGE_ACCESS_KEY: process.env.STORAGE_ACCESS_KEY!,
    STORAGE_SECRET_KEY: process.env.STORAGE_SECRET_KEY!,

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
} as const;

// Validate required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
    'OPENAI_API_KEY',
    'STORAGE_ENDPOINT',
    'STORAGE_ACCESS_KEY',
    'STORAGE_SECRET_KEY',
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
