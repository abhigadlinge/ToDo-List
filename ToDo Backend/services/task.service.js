var taskModel = require('../models/task.model');

// GET
exports.getTasks = async function() {
    try {
        console.log('Fetching all tasks');
        
        const tasks = await taskModel.find({}).lean();
        
        console.log('Tasks fetched:', tasks);
        return tasks;
    } catch (e) {
        console.error('Error while fetching tasks:', e.message);
        console.error('Stack trace:', e.stack);
        throw new Error('Error while fetching tasks.');
    }
}

// POST
exports.createTask = async function(task) {
    const newTask = new taskModel({
        assignedTo : task.assignedTo,
        status: task.status,
        date: new Date(),
        priority : task.priority,
        description: task.description,
        ticked: task.ticked
    });

    try {
        const savedTask = await newTask.save();
        return savedTask;
    } catch (e) {
        console.error('Error while creating task:', e.message);
        throw new Error('Error while creating task.');
    }
}

// PUT
exports.updateTask = async function(task) {

    console.log('updateTask api data', task );
    if (!task || !task.id) {
        console.error('Invalid task data:', task);
        throw new Error('Invalid task data.');
    }

    try {
        // Find and update the task
        const updatedTask = await taskModel.findOneAndUpdate(
            { _id: task.id },
            {
                assignedTo : task.assignedTo,
                status: task.status,
                date: new Date(task.date),
                priority : task.priority,
                description: task.description,
                ticked: task.ticked
            },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            console.log('Task not found:', task.id);
            return false;
        }

        console.log('Task updated:', updatedTask);
        return updatedTask;
    } catch (e) {
        console.error('Error while updating task:', e.message);
        throw new Error('Error while updating task.');
    }
};


// DELETE
exports.deleteTask = async function(id) {
    try {
        const result = await taskModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            console.log('No task found with the given ID:', id);
            throw new Error('Task could not be deleted.');
        }

        console.log('Task successfully deleted:', id);
        return result;
    } catch (error) {
        console.error('Error while deleting task:', error.message);
        throw new Error('Error while deleting task.');
    }
}
