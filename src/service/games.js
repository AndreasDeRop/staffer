// File: service/gameService.js
const gameRepository = require('../repository/game');
const ServiceError = require('../core/serviceError');

/**
 * Get all games for a youth movement.
 */
const getGamesForMovement = async (movementId) => {
  const games = await gameRepository.getGamesForMovement(movementId);
  if (!games || games.length === 0) {
    throw ServiceError.notFound(`No games found for movement ${movementId}.`, { movementId });
  }
  return games.map(makeExposedGame);
};

/**
 * Create a new game.
 */
const createGame = async (data) => {
  const game = await gameRepository.createGame(data);
  if (!game) {
    throw ServiceError.notFound('Failed to create game.');
  }
  return makeExposedGame(game);
};

/**
 * Expose game data.
 */
const makeExposedGame = ({
  id,
  youth_movement_id,
  title,
  description,
  required_materials,
  age_range,
  created_at,
  updated_at,
}) => ({
  id,
  youthMovementId: youth_movement_id,
  title,
  description,
  requiredMaterials: required_materials,
  ageRange: age_range,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  getGamesForMovement,
  createGame,
};
