// File: service/taskService.js
const taskRepository = require('../repository/task');
const ServiceError = require('../core/serviceError');

/**
 * Get tasks assigned to a user (within a youth movement).
 */
const getTasksForUser = async (userId, movementId) => {
  const tasks = await taskRepository.getTasksForUser(userId, movementId);
  if (!tasks || tasks.length === 0) {
    throw ServiceError.notFound(`No tasks found for userId ${userId} in movement ${movementId}`, {
      userId,
      movementId,
    });
  }
  return tasks.map(makeExposedTask);
};

/**
 * Create a new task.
 */
const createTask = async (data) => {
  const task = await taskRepository.createTask(data);
  if (!task) {
    throw ServiceError.notFound('Failed to create task.');
  }
  return makeExposedTask(task);
};

/**
 * Get a single task by ID.
 */
const getTaskById = async (taskId) => {
  const task = await taskRepository.findTaskById(taskId);
  if (!task) {
    throw ServiceError.notFound(`Task with id ${taskId} not found.`, { taskId });
  }
  return makeExposedTask(task);
};

/**
 * Update a task (e.g., mark status complete).
 */
const updateTask = async (taskId, updates) => {
  const updated = await taskRepository.updateTask(taskId, updates);
  if (!updated) {
    throw ServiceError.notFound(`Task with id ${taskId} not found.`, { taskId });
  }
  return makeExposedTask(updated);
};

/**
 * Expose task data.
 */
const makeExposedTask = ({
  id,
  youth_movement_id,
  meeting_id,
  assigned_user_id,
  created_by_user_id,
  description,
  status,
  due_date,
  created_at,
  updated_at,
}) => ({
  id,
  youthMovementId: youth_movement_id,
  meetingId: meeting_id,
  assignedUserId: assigned_user_id,
  createdByUserId: created_by_user_id,
  description,
  status,
  dueDate: due_date,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getTasksForUser,
  createTask,
  getTaskById,
  updateTask,
};
