import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
    try {
        const task = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(task);
    } catch (error) {
        console.error("Error getAllTasks:", error);
        res.status(500).json({ message: "Error fetching tasks", error });
    }
}

// export const getAllTasks = async (req, res) => {
//     try {
//         let {
//             page = 1,
//             limit = 5,
//             sort = 'createdAt',
//             order = 'desc',
//             status,
//         } = req.query;

//         page = parseInt(page);
//         limit = parseInt(limit);

//         const skip = (page - 1) * limit;

//         //Filter
//         const filter = {};
//         if (status) {
//             filter.status = status;
//         }

//         // Sort
//         const sortOptions = {
//             [sort]: order === 'asc' ? 1 : -1
//         };

//         const tasks = await Task.find(filter)
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(limit);

//         const total = await Task.countDocuments(filter);

//         res.json({
//             total,
//             page,
//             totalPages: Math.ceil(total / limit),
//             data: tasks,
//         });
//     } catch (error) {
//         console.error("Error getAllTasks:", error);
//         res.status(500).json({ message: "Error fetching tasks", error });
//     }
// }

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch (error) {
        console.error("Error createTask:", error);
        res.status(500).json({ message: "Error creating task", error });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, status, completeAt } = req.body;
        const updatedtask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completeAt
            },
            { new: true }
        );

        if (!updatedtask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(updatedtask);
    } catch (error) {
        console.error("Error updateTask:", error);
        res.status(500).json({ message: "Error updating task", error });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully!" });
    } catch (error) {
        console.error("Error deleteTask:", error);
        res.status(500).json({ message: "Error deleting task", error });
    }
}