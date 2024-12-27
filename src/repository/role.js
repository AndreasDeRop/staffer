const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Get all roles for a given youth movement.
 * @param {number} youthMovementId - The ID of the youth movement.
 * @returns {Promise<Array>} Array of roles for that movement.
 */
const getRolesForMovement = async (youthMovementId) => {
  const logger = getLogger();
  logger.info(`Getting roles for youth movement: ${youthMovementId}`);

  return await getKnex()(tables.Roles)
    .where({ youth_movement_id: youthMovementId });
};

/**
 * Create a new role for a given youth movement.
 * @param {Object} roleData - The role data (youth_movement_id, name, description).
 * @returns {Promise<number>} The newly created role ID.
 */
const createRole = async (roleData) => {
  const logger = getLogger();
  logger.info(`Creating new role: ${roleData.name} for movement: ${roleData.youth_movement_id}`);

  const [insertedId] = await getKnex()(tables.Roles)
    .insert(roleData)
    .returning('id');

  return insertedId;
};

/**
 * Find a role by its ID.
 * @param {number} id - The ID of the role.
 * @returns {Promise<Object|null>} The role record or null if not found.
 */
const findRoleById = async (id) => {
  const logger = getLogger();
  logger.info(`Finding role by id: ${id}`);

  return await getKnex()(tables.Roles)
    .where({ id })
    .first();
};

/**
 * Delete a role by its ID.
 * @param {number} id - The role ID.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteRole = async (id) => {
  const logger = getLogger();
  logger.info(`Deleting role by id: ${id}`);

  const rowsDeleted = await getKnex()(tables.Roles)
    .where({ id })
    .del();

  return rowsDeleted;
};

module.exports = {
  getRolesForMovement,
  createRole,
  findRoleById,
  deleteRole,
};
