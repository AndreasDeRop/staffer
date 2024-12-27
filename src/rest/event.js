const Router = require('@koa/router');
const eventService = require('../service/events');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');

const getEventsForMovement = async (ctx) => {
  const { movementId } = ctx.params;
  const body = await eventService.getEventsForMovement(movementId);
  ctx.body = { body };
};
getEventsForMovement.validationScheme = {
  params: {
    movementId: Joi.number().required(),
  },
};

const createEvent = async (ctx) => {
  const data = ctx.request.body;
  const body = await eventService.createEvent(data);
  ctx.status = 201;
  ctx.body = { body };
};
createEvent.validationScheme = {
  body: {
    youth_movement_id: Joi.number().required(),
    title: Joi.string().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    location: Joi.string().optional(),
  },
};
/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/events',
    });
    router.get('/:movementId',
    validate(getEventsForMovement.validationScheme),
    requireAuthentication,
    getEventsForMovement
    );
    router.post('/',
    validate(createEvent.validationScheme),
    requireAuthentication,
    createEvent
    );
    
    app.use(router.routes())
    .use(router.allowedMethods());

};