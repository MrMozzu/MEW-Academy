import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/auth.js';
import enrollmentRoutes from './routes/enrollment.js';
import progressRoutes from './routes/progress.js';
import certificateRoutes from './routes/certificates.js';

// Services
import { verifyEmailConnection } from './services/emailService.js';
import { getDatabase, closeDatabase } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in development and production SPA routing
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ──────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 auth attempts per 15 minutes
  message: { error: 'Too many authentication attempts. Please wait a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ─── Body Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'MEW Academy API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificates', certificateRoutes);

// ─── Serve Frontend in Production ───────────────────────────────
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Error Handling ─────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

// ─── Startup ────────────────────────────────────────────────────
async function startServer() {
  try {
    // Initialize database
    getDatabase();
    console.log('📦 SQLite database ready');

    // Verify email connection
    const emailOk = await verifyEmailConnection();
    if (!emailOk) {
      console.warn('⚠️  Email service not connected — password reset emails will fail');
    }

    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════╗');
      console.log('║     🚀 MEW Academy Backend Server           ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  API:      http://localhost:${PORT}/api        ║`);
      console.log(`║  Health:   http://localhost:${PORT}/api/health  ║`);
      console.log(`║  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}     ║`);
      console.log('╠══════════════════════════════════════════════╣');
      console.log('║  Database: SQLite (mew_academy.db)           ║');
      console.log(`║  Email:    ${emailOk ? '✅ Gmail SMTP connected' : '❌ Not connected'}       ║`);
      console.log('╚══════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ──────────────────────────────────────────
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down MEW Academy server...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down MEW Academy server...');
  closeDatabase();
  process.exit(0);
});

startServer();
