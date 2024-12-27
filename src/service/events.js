// File: service/eventService.js
const eventRepository = require('../repository/event');
const ServiceError = require('../core/serviceError');

/**
 * Get all events for a youth movement.
 */
const getEventsForMovement = async (movementId) => {
  const events = await eventRepository.getEventsForMovement(movementId);
  if (!events || events.length === 0) {
    throw ServiceError.notFound(`No events found for movement ${movementId}`, { movementId });
  }
  return events.map(makeExposedEvent);
};

/**
 * Create a new event.
 */
const createEvent = async (data) => {
  const event = await eventRepository.createEvent(data);
  if (!event) {
    throw ServiceError.notFound('Failed to create event.');
  }
  return makeExposedEvent(event);
};

/**
 * Expose event data.
 */
const makeExposedEvent = ({
  id,
  youth_movement_id,
  title,
  description,
  start_time,
  end_time,
  location,
  created_at,
  updated_at,
}) => ({
  id,
  youthMovementId: youth_movement_id,
  title,
  description,
  startTime: start_time,
  endTime: end_time,
  location,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getEventsForMovement,
  createEvent,
};
