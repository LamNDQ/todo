import jwt from 'jsonwebtoken';
import User from '../models/User';

export const athenticate = async (req, res) => {
    try {
        const authHeader = req.header.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password -refreshToken');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next(error);
    }
};

// Only allow specific roles
export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            message: `Access denied. Required role: ${roles.join(' or ')}`,
        });
    }
    next();
};