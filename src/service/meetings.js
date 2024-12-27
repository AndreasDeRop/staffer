// File: service/meetingService.js
const meetingRepository = require('../repository/meeting');
const ServiceError = require('../core/serviceError');

/**
 * Get all meetings for a youth movement.
 */
const getMeetingsForMovement = async (movementId) => {
  const meetings = await meetingRepository.getMeetingsForMovement(movementId);
  if (!meetings || meetings.length === 0) {
    throw ServiceError.notFound(`No meetings found for movement ${movementId}`, { movementId });
  }
  return meetings.map(makeExposedMeeting);
};

/**
 * Get a single meeting by ID.
 */
const getMeetingById = async (id) => {
  const meeting = await meetingRepository.getMeetingById(id);
  if (!meeting) {
    throw ServiceError.notFound(`Meeting with id ${id} not found.`, { id });
  }
  return makeExposedMeeting(meeting);
};

/**
 * Create a new meeting.
 */
const createMeeting = async (data) => {
  const meeting = await meetingRepository.createMeeting(data);
  if (!meeting) {
    throw ServiceError.notFound('Failed to create meeting.');
  }
  return makeExposedMeeting(meeting);
};

/**
 * Expose meeting data.
 */
const makeExposedMeeting = ({
  id,
  youth_movement_id,
  date_time,
  agenda,
  created_at,
  updated_at,
}) => ({
  id,
  youthMovementId: youth_movement_id,
  dateTime: date_time,
  agenda,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getMeetingsForMovement,
  getMeetingById,
  createMeeting,
};
