import { transcriptionQueue } from '../config/queues';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface TranscriptionJobData {
    meetingId: string;
    audioUrl: string;
    userId: string;
}

export class TranscriptionService {
    /**
     * Add a new transcription job to the queue
     */
    async queueTranscription(data: TranscriptionJobData): Promise<void> {
        try {
            // Update meeting status to PROCESSING
            await prisma.meeting.update({
                where: { id: data.meetingId },
                data: { status: 'PROCESSING' },
            });

            // Add to queue
            await transcriptionQueue.add(data);

            logger.info(`Transcription queued for meeting: ${data.meetingId}`);
        } catch (error) {
            logger.error('Error queueing transcription:', error);
            throw error;
        }
    }

    /**
     * Manual trigger for transcription (e.g. retry)
     */
    async retryTranscription(meetingId: string): Promise<void> {
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { user: true }
        });

        if (!meeting || !meeting.audioUrl) {
            throw new Error('Meeting or audio URL not found');
        }

        await this.queueTranscription({
            meetingId: meeting.id,
            audioUrl: meeting.audioUrl,
            userId: meeting.userId,
        });
    }
}

export const transcriptionService = new TranscriptionService();
