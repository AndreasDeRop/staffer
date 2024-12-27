const Router = require('@koa/router');

const youthmovementService = require('../service/youthmovements');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const validate = require('../core/validation');
const { valid } = require('joi');
const Joi = require('joi');

const requireAdmin = makeRequireRole(Role.ADMIN);


const getAllYouthMovements = async (ctx) => {
  // Example: no query or params needed
  const body = await youthmovementService.getAllYouthMovements();
  ctx.body = { body };
};
getAllYouthMovements.validationScheme = null;

const getYouthMovementById = async (ctx) => {
  const { id } = ctx.params;
  const body = await youthmovementService.findYouthMovementById(id);
  ctx.body = { body };
};
getYouthMovementById.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
};

const createYouthMovement = async (ctx) => {
  const data = ctx.request.body;
  const body = await youthmovementService.createYouthMovement(data);
  ctx.status = 201; // Created
  ctx.body = { body };
};
createYouthMovement.validationScheme = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
  },
};

const updateYouthMovement = async (ctx) => {
  const { id } = ctx.params;
  const updates = ctx.request.body;
  const body = await youthmovementService.updateYouthMovement(id, updates);
  ctx.body = { body };
};
updateYouthMovement.validationScheme = {
  params: {
    id: Joi.number().required(),
  },
  body: {
    name: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
  },
};

const deleteYouthMovement = async (ctx) => {
  const { id } = ctx.params;
  const body = await youthmovementService.deleteYouthMovement(id);
  ctx.body = { body };
};
deleteYouthMovement.validationScheme = {
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
      prefix: '/youthmovements',
    });
    router.get('/',requireAuthentication,
    validate(getAllYouthMovements.validationScheme), getAllYouthMovements);
    router.get('/:id',requireAuthentication,
    validate(getYouthMovementById.validationScheme), getYouthMovementById);
    router.post('/',requireAuthentication,requireAdmin,
    validate(getYouthMovementById.validationScheme), getYouthMovementById);
    router.put('/:id',requireAuthentication,requireAdmin,
    validate(updateYouthMovement.validationScheme), updateYouthMovement);
    router.delete('/:id',requireAuthentication,requireAdmin,
    validate(deleteYouthMovement.validationScheme), deleteYouthMovement);
    app.use(router.routes())
    .use(router.allowedMethods());
};