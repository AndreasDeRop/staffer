const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Find a user by ID.
 * @param {number} userId - The user ID.
 * @returns {Promise<Object|null>} The user record or null if not found.
 */
const findUserById = async (userId) => {
  const logger = getLogger();
  logger.info(`Finding user by id: ${userId}`);

  return await getKnex()(tables.Users)
    .where({ id: userId })
    .first();
};

/**
 * Find a user by email (useful for login).
 * @param {string} email - The user email.
 * @returns {Promise<Object|null>} The user record or null if not found.
 */
const findUserByEmail = async (email) => {
  const logger = getLogger();
  logger.info(`Finding user by email: ${email}`);

  return await getKnex()(tables.Users)
    .where({ email })
    .first();
};

/**
 * Create a new user.
 * @param {Object} userData - The user data (youth_movement_id, role_id, name, email, password_hash, etc.).
 * @returns {Promise<number>} The newly inserted user's ID.
 */
const createUser = async (userData) => {
  const logger = getLogger();
  logger.info(`Creating new user with email: ${userData.email}`);

  const [insertedId] = await getKnex()(tables.Users)
    .insert(userData)
    .returning('id');

  return insertedId;
};

/**
 * Update a user (e.g., changing role or name).
 * @param {number} userId - The user ID.
 * @param {Object} updates - An object containing fields to update.
 * @returns {Promise<number>} Number of rows updated (0 if none).
 */
const updateUser = async (userId, updates) => {
  const logger = getLogger();
  logger.info(`Updating user with id: ${userId}`);

  const rowsUpdated = await getKnex()(tables.Users)
    .where({ id: userId })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete a user by ID.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteUser = async (userId) => {
  const logger = getLogger();
  logger.info(`Deleting user with id: ${userId}`);

  const rowsDeleted = await getKnex()(tables.Users)
    .where({ id: userId })
    .del();

  return rowsDeleted;
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
