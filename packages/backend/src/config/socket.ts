import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';
import { env } from './env';

export class SocketService {
    private io: SocketServer | null = null;

    /**
     * Initialize Socket.io server
     */
    init(server: HttpServer): void {
        this.io = new SocketServer(server, {
            cors: {
                origin: env.CORS_ORIGIN,
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket) => {
            const userId = socket.handshake.query.userId as string;

            if (userId) {
                socket.join(`user:${userId}`);
                logger.info(`User ${userId} connected via WebSocket`);
            }

            socket.on('disconnect', () => {
                logger.info('Socket disconnected');
            });
        });

        logger.info('Socket.io server initialized');
    }

    /**
     * Send an event to a specific user
     */
    emitToUser(userId: string, event: string, data: any): void {
        if (!this.io) return;
        this.io.to(`user:${userId}`).emit(event, data);
    }

    /**
     * Broadcast an event to all connected clients (use sparingly)
     */
    broadcast(event: string, data: any): void {
        if (!this.io) return;
        this.io.emit(event, data);
    }
}

export const socketService = new SocketService();
