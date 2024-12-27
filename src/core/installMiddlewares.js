

// const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
// const winston = require('winston');
const config = require('config');

const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const koaCors = require('@koa/cors');
const emoji = require('node-emoji');
const koaHelmet = require('koa-helmet');

const { getLogger } = require('./logging');
const ServiceError = require('./serviceError');

const NODE_ENV = config.get('env');


module.exports = function installMiddlewares(app){

    
    app.use(
        koaCors({
          origin: (ctx) => { // 👈 4
            if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
              return ctx.request.header.origin;
            }
            // Not a valid domain at this point, let's return the first valid as we should return a string
            return CORS_ORIGINS[0];
          },
          allowHeaders: ['Accept', 'Content-Type', 'Authorization'], // 👈 5
          maxAge: CORS_MAX_AGE, // 👈 6
        })
      );

      app.use(async (ctx, next) => {
        getLogger().info(`${emoji.get('fast_forward')} ${ctx.method} ${ctx.url}`); // 👈 3
      
        // 👇 4
        const getStatusEmoji = () => {
          if (ctx.status >= 500) return emoji.get('skull');
          if (ctx.status >= 400) return emoji.get('x');
          if (ctx.status >= 300) return emoji.get('rocket');
          if (ctx.status >= 200) return emoji.get('white_check_mark');
          return emoji.get('rewind');
        };
      
        // 👇 6
        try {
          await next(); // 👈 5
      
          getLogger().info(
            `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`
          ); // 👈 5
        } catch (error) {
          getLogger().error(
            `${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`,
            {
              error,
            }
          );
      
          throw error;
        }
      });
      app.use(async (ctx, next) => {
        try {
          await next(); // 👈 4
        } catch (error) {
          getLogger().error('Error occured while handling a request', { error }); // 👈 5
          let statusCode = error.status || 500; // 👈 6
          let errorBody = { // 👈 6
            code: error.code || 'INTERNAL_SERVER_ERROR',
            message: error.message,
            details: error.details || {},
            stack: NODE_ENV !== 'production' ? error.stack : undefined,
          };
      
          // 👇 7
          if (error instanceof ServiceError) {
            if (error.isNotFound) {
              statusCode = 404;
            }
      
            if (error.isValidationFailed) {
              statusCode = 400;
            }

            if (error.isUnauthorized) {
              statusCode = 401;
            }
          
            if (error.isForbidden) {
              statusCode = 403;
            }

          }
      
          ctx.status = statusCode; // 👈 8
          ctx.body = errorBody; // 👈 8
        }
      });
      
      // 👇 9
      // Handle 404 not found with uniform response
      app.use(async (ctx, next) => {
        await next();
      
        if (ctx.status === 404) {
          ctx.status = 404;
          ctx.body = {
            code: 'NOT_FOUND',
            message: `Unknown resource: ${ctx.url}`,
          };
        }
      });
      
      app.use(bodyParser());
      app.use(koaHelmet());
};