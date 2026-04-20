import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load .env from the backend root explicitly — prevents any override
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env'), override: true });

import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRouters from './routes/taskRouters.js';
import adminRoutes from './routes/adminRoutes.js';

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://todo-git-main-lam-nguyns-projects.vercel.app/', // thêm domain Vercel của bạn
        /\.vercel\.app$/,  // hoặc allow tất cả vercel.app subdomains
    ],
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRouters);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
