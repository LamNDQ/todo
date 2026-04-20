import Redis from 'ioredis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env'), override: true });

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
