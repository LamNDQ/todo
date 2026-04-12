import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import taskRouters from './routes/taskRouters.js';
import { connectDB } from '../config/db.js';

const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', `http://localhost:${PORT}`],
    credentials: true,
}));

app.use(express.json());

app.use('/api/tasks', taskRouters);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
