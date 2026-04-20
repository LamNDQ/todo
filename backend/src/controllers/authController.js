import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redis from '../config/redis.js';

const generateTokens = (userId, role) => {
    const accessToken = jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    const refreshToken = jwt.sign(
        { userId, role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(409).json({ message: `This ${field} is already in use` });
        }

        const user = new User({ username, email, password, role });
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// POST /api/auth/refresh
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        // Check blacklist
        const isBlacklisted = await redis.get(`blacklist:${refreshToken}`).catch(() => null);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user._id, user.role);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(200).json(tokens);
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        res.status(500).json({ message: 'Error refreshing token' });
    }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = req.user;

        // Blacklist refresh token in Redis (TTL = 7 days)
        if (refreshToken) {
            await redis.set(`blacklist:${refreshToken}`, '1', 'EX', 7 * 24 * 60 * 60).catch(() => { });
        }

        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' });
    }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
    res.status(200).json({ user: req.user });
};
