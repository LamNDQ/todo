import User from '../models/User';
import Task from '../models/Task';

//Get /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

//GET /api/admin/users/:id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

//PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role must be "user" or "admin"' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password -refreshToken');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Role updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

// PATCH /api/admin/users/:id/status
export const toggleUserStatus = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot deactivate your own account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status', error: error.message });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete all tasks of this user
        await Task.deleteMany({ user: req.params.id });

        res.status(200).json({ message: 'User and their tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalTasks, activeTasks, completedTasks, adminCount] =
            await Promise.all([
                User.countDocuments(),
                Task.countDocuments(),
                Task.countDocuments({ status: 'active' }),
                Task.countDocuments({ status: 'completed' }),
                User.countDocuments({ role: 'admin' }),
            ]);

        res.status(200).json({
            totalUsers,
            adminCount,
            totalTasks,
            activeTasks,
            completedTasks,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
