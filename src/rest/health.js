const Router = require('@koa/router');
const validate = require('../core/validation');
const Joi = require('joi');
const healthService = require('../service/health');

// Handler function
const ping = async (ctx) => {
  const result = await healthService.ping();
  ctx.body = result;
};

// Validation scheme (optional; empty in this case, but shows how you'd structure it)
ping.validationScheme = {
  params: {},
  body: {},
};

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/health',
  });

  // GET /api/health/ping
  router.get(
    '/ping',
    validate(ping.validationScheme),
    ping
  );

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
