// File: service/roleService.js
const roleRepository = require('../repository/role');
const ServiceError = require('../core/serviceError');

/**
 * Get all roles for a given youth movement.
 */
const getRolesForMovement = async (movementId) => {
  const roles = await roleRepository.getRolesForMovement(movementId);
  if (!roles || roles.length === 0) {
    throw ServiceError.notFound(`No roles found for movement ${movementId}`, { movementId });
  }
  return roles.map(makeExposedRole);
};

/**
 * Create a new role.
 */
const createRole = async (data) => {
  const role = await roleRepository.createRole(data);
  if (!role) {
    throw ServiceError.notFound('Failed to create role.');
  }
  return makeExposedRole(role);
};

/**
 * Delete a role.
 */
const deleteRole = async (roleId) => {
  const rowsDeleted = await roleRepository.deleteRole(roleId);
  if (!rowsDeleted) {
    throw ServiceError.notFound(`Role with id ${roleId} not found.`, { roleId });
  }
  return rowsDeleted;
};

/**
 * Expose role data.
 */
const makeExposedRole = ({ id, youth_movement_id, name, description, created_at, updated_at }) => ({
  id,
  youthMovementId: youth_movement_id,
  name,
  description,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getRolesForMovement,
  createRole,
  deleteRole,
};
