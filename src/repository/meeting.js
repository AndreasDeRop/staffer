const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Get all meetings for a specific youth movement.
 * @param {number} youthMovementId - The ID of the youth movement.
 * @returns {Promise<Array>} List of meetings.
 */
const getMeetingsForMovement = async (youthMovementId) => {
  const logger = getLogger();
  logger.info(`Getting meetings for youth movement: ${youthMovementId}`);

  return await getKnex()(tables.Meetings)
    .where({ youth_movement_id: youthMovementId });
};

/**
 * Find a meeting by ID.
 * @param {number} meetingId - The meeting ID.
 * @returns {Promise<Object|null>} Meeting record or null if not found.
 */
const findMeetingById = async (meetingId) => {
  const logger = getLogger();
  logger.info(`Finding meeting by id: ${meetingId}`);

  return await getKnex()(tables.Meetings)
    .where({ id: meetingId })
    .first();
};

/**
 * Create a new meeting.
 * @param {Object} meetingData - The meeting data (youth_movement_id, date_time, agenda, etc.).
 * @returns {Promise<number>} The newly created meeting's ID.
 */
const createMeeting = async (meetingData) => {
  const logger = getLogger();
  logger.info(`Creating a new meeting for movement: ${meetingData.youth_movement_id}`);

  const [insertedId] = await getKnex()(tables.Meetings)
    .insert(meetingData)
    .returning('id');

  return insertedId;
};

/**
 * Update a meeting.
 * @param {number} meetingId - The meeting ID.
 * @param {Object} updates - Fields to update (date_time, agenda, etc.).
 * @returns {Promise<number>} Number of rows updated (0 if none).
 */
const updateMeeting = async (meetingId, updates) => {
  const logger = getLogger();
  logger.info(`Updating meeting with id: ${meetingId}`);

  const rowsUpdated = await getKnex()(tables.Meetings)
    .where({ id: meetingId })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete a meeting.
 * @param {number} meetingId - The ID of the meeting to delete.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteMeeting = async (meetingId) => {
  const logger = getLogger();
  logger.info(`Deleting meeting with id: ${meetingId}`);

  const rowsDeleted = await getKnex()(tables.Meetings)
    .where({ id: meetingId })
    .del();

  return rowsDeleted;
};

module.exports = {
  getMeetingsForMovement,
  findMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};
