const Router = require('@koa/router');
const meetingService = require('../service/meetings');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');

const getMeetingsForMovement = async (ctx) => {
    const { movementId } = ctx.params;
    const body = await meetingService.getMeetingsForMovement(movementId);
    ctx.body = { body };
  };
  getMeetingsForMovement.validationScheme = {
    params: {
      movementId: Joi.number().required(),
    },
  };
  const createMeeting = async (ctx) => {
    const data = ctx.request.body;
    const body = await meetingService.createMeeting(data);
    ctx.status = 201;
    ctx.body = { body };
  };
  createMeeting.validationScheme = {
    body: {
      youth_movement_id: Joi.number().required(),
      date_time: Joi.date().required(),
      agenda: Joi.string().allow('').optional(),
    },
  };
  
/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/meetings',
    });
    router.get('/:movementId',
    validate(getMeetingsForMovement.validationScheme),
    requireAuthentication,
    getMeetingsForMovement
    );
    router.post('/',
    validate(createMeeting.validationScheme),
    requireAuthentication,
    createMeeting
    );
    
    app.use(router.routes())
    .use(router.allowedMethods());

};