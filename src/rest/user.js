const Router = require('@koa/router');

const userService = require('../service/users');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const validate = require('../core/validation');
const { valid } = require('joi');
const Joi = require('joi');



  const login = async (ctx) => {
    const { email, password } = ctx.request.body;
    const body = await userService.login(email, password);
    ctx.status = 200;
    ctx.body = { body };
  };
  login.validationScheme = {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  };
    const getUserById = async (ctx) => {
      const { id } = ctx.params;
      const body = await userService.getUserById(Number(id));
      ctx.body = { body };
    };
    getUserById.validationScheme = {
      params: {
        id: Joi.number().required(),
      },
    };
/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/users',
    });
    router.post('/login',
    validate(login.validationScheme), login);

    router.get('/:id',requireAuthentication, 
    validate(getUserById.validationScheme),
    getUserById);

    app.use(router.routes())
    .use(router.allowedMethods());
};