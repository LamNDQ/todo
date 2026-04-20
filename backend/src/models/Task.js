import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    completedAt: {
        type: Date,
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
