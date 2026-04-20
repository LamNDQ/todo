import Redis from 'ioredis';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Fix __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    lazyConnect: true,
    retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
    },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.warn('Redis unavailable:', err.message));

export default redis;