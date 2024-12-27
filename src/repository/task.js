const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Get all tasks for a specific user (within a youth movement).
 * @param {number} userId - ID of the user.
 * @param {number} youthMovementId - ID of the youth movement.
 * @returns {Promise<Array>} Array of tasks.
 */
const getTasksForUser = async (userId, youthMovementId) => {
  const logger = getLogger();
  logger.info(`Getting tasks for user: ${userId} in movement: ${youthMovementId}`);

  return await getKnex()(tables.Tasks)
    .where({ assigned_user_id: userId, youth_movement_id: youthMovementId });
};

/**
 * Create a new task.
 * @param {Object} taskData - The task data (youth_movement_id, meeting_id, assigned_user_id, description, etc.).
 * @returns {Promise<number>} The newly created task ID.
 */
const createTask = async (taskData) => {
  const logger = getLogger();
  logger.info(`Creating a task: ${taskData.description}`);

  const [taskId] = await getKnex()(tables.Tasks)
    .insert(taskData)
    .returning('id');

  return taskId;
};

/**
 * Update an existing task.
 * @param {number} taskId - The task ID.
 * @param {Object} updates - Fields to update (status, due_date, description, etc.).
 * @returns {Promise<number>} Number of rows updated.
 */
const updateTask = async (taskId, updates) => {
  const logger = getLogger();
  logger.info(`Updating task with id: ${taskId}`);

  const rowsUpdated = await getKnex()(tables.Tasks)
    .where({ id: taskId })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete a task by ID.
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<number>} Number of rows deleted.
 */
const deleteTask = async (taskId) => {
  const logger = getLogger();
  logger.info(`Deleting task with id: ${taskId}`);

  const rowsDeleted = await getKnex()(tables.Tasks)
    .where({ id: taskId })
    .del();

  return rowsDeleted;
};

/**
 * Find a task by ID.
 * @param {number} taskId - The task ID.
 * @returns {Promise<Object|null>} The task record or null if not found.
 */
const findTaskById = async (taskId) => {
  const logger = getLogger();
  logger.info(`Finding task by id: ${taskId}`);

  return await getKnex()(tables.Tasks)
    .where({ id: taskId })
    .first();
};

module.exports = {
  getTasksForUser,
  createTask,
  updateTask,
  deleteTask,
  findTaskById,
};
