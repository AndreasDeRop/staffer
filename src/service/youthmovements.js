// File: service/youthMovementService.js
const youthMovementRepository = require('../repository/youthmovement');
const ServiceError = require('../core/serviceError');

/**
 * Retrieve all youth movements.
 */
const getAllYouthMovements = async () => {
  const movements = await youthMovementRepository.getAllYouthMovements();
  if (!movements || movements.length === 0) {
    throw ServiceError.notFound('No youth movements found.');
  }
  return movements.map(makeExposedYouthMovement);
};

/**
 * Retrieve a single youth movement by ID.
 */
const getYouthMovementById = async (id) => {
  const movement = await youthMovementRepository.getYouthMovementById(id);
  if (!movement) {
    throw ServiceError.notFound(`Youth movement with id ${id} not found.`, { id });
  }
  return makeExposedYouthMovement(movement);
};

/**
 * Create a new youth movement.
 */
const createYouthMovement = async (data) => {
  const inserted = await youthMovementRepository.createYouthMovement(data);
  if (!inserted) {
    throw ServiceError.notFound('Failed to create youth movement.');
  }
  return makeExposedYouthMovement(inserted);
};

/**
 * Update an existing youth movement.
 */
const updateYouthMovement = async (id, updates) => {
  const movement = await youthMovementRepository.updateYouthMovement(id, updates);
  if (!movement) {
    throw ServiceError.notFound(`Youth movement with id ${id} not found.`, { id });
  }
  return makeExposedYouthMovement(movement);
};

/**
 * Delete a youth movement.
 */
const deleteYouthMovement = async (id) => {
  const rowsDeleted = await youthMovementRepository.deleteYouthMovement(id);
  if (!rowsDeleted) {
    throw ServiceError.notFound(`Youth movement with id ${id} not found.`, { id });
  }
  return rowsDeleted;
};

/**
 * Shape the youth movement data for the client.
 */
const makeExposedYouthMovement = ({ id, name, description, created_at, updated_at }) => ({
  id,
  name,
  description,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getAllYouthMovements,
  getYouthMovementById,
  createYouthMovement,
  updateYouthMovement,
  deleteYouthMovement,
};
