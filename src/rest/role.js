const Router = require('@koa/router');

const roleService = require('../service/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const validate = require('../core/validation');
const { valid } = require('joi');
const Joi = require('joi');



  const getRolesForMovement = async (ctx) => {
    const { movementId } = ctx.params;
    const body = await roleService.getRolesForMovement(movementId);
    ctx.body = { body };
  };
  getRolesForMovement.validationScheme = {
    params: {
      movementId: Joi.number().required(),
    },
  };

  const createRole = async (ctx) => {
    const data = ctx.request.body;
    const body = await roleService.createRole(data);
    ctx.status = 201;
    ctx.body = { body };
  };
  createRole.validationScheme = {
    body: {
      youth_movement_id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().allow('').optional(),
    },
  };

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/roles',
    });
    router.use(requireAuthentication)

    router.get('/:movementId', 
    validate(getRolesForMovement.validationScheme),
    requireAuthentication,
    getRolesForMovement);

    router.post('/',
    validate(createRole.validationScheme),
    requireAuthentication,
    createRole);

    app.use(router.routes())
    .use(router.allowedMethods());

};