import Task from '../models/Task.js';

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = await new Task({ title, user: req.user._id }).save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, status } = req.body;
        const update = {};
        if (title !== undefined) update.title = title;
        if (status !== undefined) {
            update.status = status;
            update.completedAt = status === 'completed' ? new Date() : null;
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            update,
            { new: true }
        );

        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
