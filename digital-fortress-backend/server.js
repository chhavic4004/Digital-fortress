import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load env vars
dotenv.config();

// Import database connection
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import wifiRoutes from './routes/wifiRoutes.js';
import fraudRoutes from './routes/fraudRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import urlScanRoutes from './routes/urlScanRoutes.js';
import scamRoutes from './routes/scamRoutes.js';
import extensionRoutes from './routes/extensionRoutes.js';
import seniorRoutes from './routes/seniorRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import deceptionRoutes from './routes/deceptionRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// ES6 module directory handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to database
connectDB();

// Initialize express
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or Chrome extensions)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:8080',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:8085', // Added port 8085 for current frontend
      'http://127.0.0.1:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8085', // Added port 8085 for current frontend
      'https://digital-fortress-q6jn.vercel.app',
    ];
    
    // Allow Chrome extensions
    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for development, restrict in production
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Disposition'], // Needed for file downloads
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', wifiRoutes);
app.use('/api', fraudRoutes);
app.use('/api', chatbotRoutes);
app.use('/api', urlScanRoutes);
app.use('/api', scamRoutes);
app.use('/api/extension', extensionRoutes);
app.use('/api/senior', seniorRoutes);
app.use('/api', statsRoutes);
app.use('/api/deceptions', deceptionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Digital Fortress API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Digital Fortress API',
    version: '1.0.0',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

