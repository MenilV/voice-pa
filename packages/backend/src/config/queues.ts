import Queue from 'bull';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Transcription Queue
export const transcriptionQueue = new Queue('transcription', env.REDIS_URL, {
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
    },
});

transcriptionQueue.on('error', (error) => {
    logger.error('Transcription Queue Error:', error);
});

transcriptionQueue.on('failed', (job, error) => {
    logger.error(`Job ${job.id} failed:`, error);
});

logger.info('Transcription queue initialized');
