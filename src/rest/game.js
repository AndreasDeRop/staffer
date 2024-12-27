const Router = require('@koa/router');
const gameService = require('../service/games');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');

const getGamesForMovement = async (ctx) => {
  const { movementId } = ctx.params;
  const body = await gameService.getGamesForMovement(movementId);
  ctx.body = { body };
};
getGamesForMovement.validationScheme = {
  params: {
    movementId: Joi.number().required(),
  },
};

const createGame = async (ctx) => {
  const data = ctx.request.body;
  const body = await gameService.createGame(data);
  ctx.status = 201;
  ctx.body = { body };
};
createGame.validationScheme = {
  body: {
    youth_movement_id: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    required_materials: Joi.string().allow('').optional(),
    age_range: Joi.string().allow('').optional(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/games',
    });
    router.get('/movementId',
    validate(getGamesForMovement.validationScheme),
    requireAuthentication,
    getGamesForMovement
    );
    router.post('/',
    validate(createGame.validationScheme),
    requireAuthentication,
    createGame
    );
    
    app.use(router.routes())
    .use(router.allowedMethods());

};