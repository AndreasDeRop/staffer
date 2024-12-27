const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Get all events for a specific youth movement.
 * @param {number} youthMovementId - The ID of the youth movement.
 * @returns {Promise<Array>} Array of events.
 */
const getEventsForMovement = async (youthMovementId) => {
  const logger = getLogger();
  logger.info(`Getting events for youth movement: ${youthMovementId}`);

  return await getKnex()(tables.Events)
    .where({ youth_movement_id: youthMovementId });
};

/**
 * Create a new event.
 * @param {Object} eventData - The event data (youth_movement_id, title, start_time, etc.).
 * @returns {Promise<number>} The newly inserted event's ID.
 */
const createEvent = async (eventData) => {
  const logger = getLogger();
  logger.info(`Creating a new event for movement: ${eventData.youth_movement_id}`);

  const [insertedId] = await getKnex()(tables.Events)
    .insert(eventData)
    .returning('id');

  return insertedId;
};

/**
 * Update an event.
 * @param {number} eventId - The ID of the event.
 * @param {Object} updates - Fields to update (title, start_time, etc.).
 * @returns {Promise<number>} Number of rows updated.
 */
const updateEvent = async (eventId, updates) => {
  const logger = getLogger();
  logger.info(`Updating event with id: ${eventId}`);

  const rowsUpdated = await getKnex()(tables.Events)
    .where({ id: eventId })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete an event by ID.
 * @param {number} eventId - The ID of the event to delete.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteEvent = async (eventId) => {
  const logger = getLogger();
  logger.info(`Deleting event with id: ${eventId}`);

  const rowsDeleted = await getKnex()(tables.Events)
    .where({ id: eventId })
    .del();

  return rowsDeleted;
};

module.exports = {
  getEventsForMovement,
  createEvent,
  updateEvent,
  deleteEvent,
};
