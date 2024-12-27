const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Find a youth movement by its ID.
 * @param {number} id - The ID of the youth movement.
 * @returns {Promise<Object|null>} The youth movement record or null if not found.
 */
const findYouthMovementById = async (id) => {
  const logger = getLogger();
  logger.info(`Finding youth movement by id: ${id}`);

  return await getKnex()(tables.Youth_movements)
    .where({ id })
    .first();
};

/**
 * Create a new youth movement.
 * @param {Object} youthMovementData - The data for the new movement (name, description, etc.).
 * @returns {Promise<number>} The newly created movement's ID.
 */
const createYouthMovement = async (youthMovementData) => {
  const logger = getLogger();
  logger.info(`Creating a new youth movement: ${youthMovementData.name}`);

  const [insertedId] = await getKnex()(tables.Youth_movements)
    .insert(youthMovementData)
    .returning('id');

  return insertedId;
};

/**
 * Update a youth movement.
 * @param {number} id - The ID of the youth movement.
 * @param {Object} updates - The fields to update (name, description, etc.).
 * @returns {Promise<number>} Number of rows updated (0 if none).
 */
const updateYouthMovement = async (id, updates) => {
  const logger = getLogger();
  logger.info(`Updating youth movement with id: ${id}`);

  const rowsUpdated = await getKnex()(tables.Youth_movements)
    .where({ id })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete a youth movement.
 * @param {number} id - The ID of the youth movement to delete.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteYouthMovement = async (id) => {
  const logger = getLogger();
  logger.info(`Deleting youth movement with id: ${id}`);

  const rowsDeleted = await getKnex()(tables.Youth_movements)
    .where({ id })
    .del();

  return rowsDeleted;
};

module.exports = {
  findYouthMovementById,
  createYouthMovement,
  updateYouthMovement,
  deleteYouthMovement,
};
