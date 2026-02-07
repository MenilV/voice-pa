import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { createServer } from 'http';
import { setupTranscriptionWorker } from './workers/transcription.worker';
import { socketService } from './config/socket';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
socketService.init(httpServer);

// Initialize workers
setupTranscriptionWorker();

// Security middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Logging
app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Error handling
app.use(errorMiddleware);

// Start server
httpServer.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

export default app;
