const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');

/**
 * Get all games for a youth movement.
 * @param {number} youthMovementId - The ID of the youth movement.
 * @returns {Promise<Array>} Array of games.
 */
const getGamesForMovement = async (youthMovementId) => {
  const logger = getLogger();
  logger.info(`Getting games for youth movement: ${youthMovementId}`);

  return await getKnex()(tables.Games)
    .where({ youth_movement_id: youthMovementId });
};

/**
 * Create a new game.
 * @param {Object} gameData - The game data (youth_movement_id, title, description, etc.).
 * @returns {Promise<number>} The newly created game ID.
 */
const createGame = async (gameData) => {
  const logger = getLogger();
  logger.info(`Creating a new game: ${gameData.title}`);

  const [gameId] = await getKnex()(tables.Games)
    .insert(gameData)
    .returning('id');

  return gameId;
};

/**
 * Update an existing game.
 * @param {number} gameId - The game ID.
 * @param {Object} updates - Fields to update (title, description, etc.).
 * @returns {Promise<number>} Number of rows updated.
 */
const updateGame = async (gameId, updates) => {
  const logger = getLogger();
  logger.info(`Updating game with id: ${gameId}`);

  const rowsUpdated = await getKnex()(tables.Games)
    .where({ id: gameId })
    .update(updates);

  return rowsUpdated;
};

/**
 * Delete a game by ID.
 * @param {number} gameId - The ID of the game to delete.
 * @returns {Promise<number>} Number of rows deleted (0 if none).
 */
const deleteGame = async (gameId) => {
  const logger = getLogger();
  logger.info(`Deleting game with id: ${gameId}`);

  const rowsDeleted = await getKnex()(tables.Games)
    .where({ id: gameId })
    .del();

  return rowsDeleted;
};

module.exports = {
  getGamesForMovement,
  createGame,
  updateGame,
  deleteGame,
};
