import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './env';
import { logger } from '../utils/logger';

const s3Client = new S3Client({
    endpoint: env.STORAGE_ENDPOINT,
    region: env.STORAGE_REGION,
    credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY,
        secretAccessKey: env.STORAGE_SECRET_KEY,
    },
    forcePathStyle: true,
});

export class StorageService {
    private bucket = env.STORAGE_BUCKET;

    /**
     * Upload audio data to S3
     */
    async uploadAudio(fileName: string, data: Buffer, contentType = 'audio/wav'): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: `audio/${fileName}`,
                Body: data,
                ContentType: contentType,
            });

            await s3Client.send(command);

            return `audio/${fileName}`;
        } catch (error) {
            logger.error('S3 Upload Error:', error);
            throw error;
        }
    }

    /**
     * Generate a signed URL for playback
     */
    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            return await getSignedUrl(s3Client, command, { expiresIn });
        } catch (error) {
            logger.error('S3 Signed URL Error:', error);
            throw error;
        }
    }

    /**
     * Delete object from S3
     */
    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });

            await s3Client.send(command);
        } catch (error) {
            logger.error('S3 Delete Error:', error);
            throw error;
        }
    }
}

export const storageService = new StorageService();
