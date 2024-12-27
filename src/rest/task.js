const Router = require('@koa/router');
const eventService = require('../service/tasks');
const validate = require('../core/validation');
const Joi = require('joi');
const { requireAuthentication } = require('../core/auth');

const getTasksForUser = async (ctx) => {
  const { userId } = ctx.params;
  const body = await taskService.getTasksForUser(userId);
  ctx.body = { body };
};
getTasksForUser.validationScheme = {
  params: {
    userId: Joi.number().required(),
  },
};

const createTask = async (ctx) => {
  const data = ctx.request.body;
  const body = await taskService.createTask(data);
  ctx.status = 201;
  ctx.body = { body };
};
createTask.validationScheme = {
  body: {
    youth_movement_id: Joi.number().required(),
    meeting_id: Joi.number().allow(null).optional(),
    assigned_user_id: Joi.number().required(),
    created_by_user_id: Joi.number().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    due_date: Joi.date().allow(null).optional(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/tasks',
    });
    router.get('/:userId',
    validate(getTasksForUser.validationScheme),
    requireAuthentication,
    getTasksForUser
    );
    router.post('/',
    validate(createTask.validationScheme),
    requireAuthentication,
    createTask
    );
    
    app.use(router.routes())
    .use(router.allowedMethods());

};