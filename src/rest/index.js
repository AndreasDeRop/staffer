// File: routes/index.js
const Router = require('@koa/router');

// Import the sub-routers
const installYouthMovementRouter = require('./youthmovement');
const installRoleRouter = require('./role');
const installUserRouter = require('./user');
const installMeetingRouter = require('./meeting');
const installEventRouter = require('./event');
const installTaskRouter = require('./task');
const installGameRouter = require('./game');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  
  const router = new Router({
    prefix: '/api',
  });

  // Install each feature router
  installYouthMovementRouter(router);
  installRoleRouter(router);
  installUserRouter(router);
  installMeetingRouter(router);
  installEventRouter(router);
  installTaskRouter(router);
  installGameRouter(router);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
