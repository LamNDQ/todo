import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    // If Redis is not available, fail gracefully
    lazyConnect: true,
    retryStrategy: (times) => {
        if (times > 3) return null; // stop retrying
        return Math.min(times * 200, 2000);
    },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.warn('Redis unavailable:', err.message));

export default redis;
