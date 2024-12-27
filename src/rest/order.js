const Router = require('@koa/router');

const orderService = require('../service/orders');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');
const validate = require('../core/validation');
const { valid } = require('joi');
const Joi = require('joi');

const requireSupplier = makeRequireRole(Role.SUPPLIER);
const requireCustomer = makeRequireRole(Role.CUSTOMER);




const checkUserId = (ctx, next) => {
    const { userid, roles } = ctx.state.session;
    const { id , role} = ctx.params;
    if ( role === 'customer' && roles !== 'customer' ) {
      return ctx.throw(
        403,
        'You are not allowed to view this user\'s information',
        {
          code: 'FORBIDDEN',
        },
      );
    }
    else if ( role === 'supplier' && roles !== 'supplier' ) {
      return ctx.throw(
        403,
        'You are not allowed to view this user\'s information',
        {
          code: 'FORBIDDEN',
        },
      );
    }
    if (id !== userid && roles !== 'admin' ) {
      return ctx.throw(
        403,
        'You are not allowed to view this user\'s information',
        {
          code: 'FORBIDDEN',
        },
      );
    }
    return next();
  };

const getOrdersForSupplierOrCustomer = async (ctx) => {

    const { userid, roles } = ctx.state.session;
    const filters = ctx.request.query;
    const body = await orderService.getOrdersForSupplierOrCustomer(userid, roles, filters );
    return ctx.body = { body };
    };
    getOrdersForSupplierOrCustomer.validationScheme = {
    params: {
        id: Joi.number().required(),
        role: Joi.string().valid('customer', 'supplier').required(),
    },
    };
    const getOrder = async (ctx) => {
    const { userid, roles } = ctx.state.session;
    const order_id = ctx.params.order_id;
    const body = await orderService.getOrder(userid,order_id,roles);
    return ctx.body = { body };
    }
    getOrder.validationScheme = {
        params: {
            id: Joi.number().required(),
            order_id: Joi.number().required(),
            role: Joi.string().valid('customer', 'supplier').required(),
        },
        };
    const adjustStatus = async (ctx) => {
    const orderId = ctx.params.order_id;
    const statusType = ctx.request.body.type;
    const status = ctx.request.body.status;
    const body = await orderService.adjustStatus(orderId, statusType, status);
    return ctx.body = { body };
    };
    adjustStatus.validationScheme = {   
        body: {
            type: Joi.string().required(),
            status: Joi.string().required(),
        },
        params: {
            id: Joi.number().required(),
            role: Joi.string().valid('customer', 'supplier').required(),
            order_id: Joi.number().required(),
        },
    };



/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
    const router = new Router({
      prefix: '/orders',
    });
    router.use(requireAuthentication)
    router.get('/:id/:role',
    validate(getOrdersForSupplierOrCustomer.validationScheme), 
    checkUserId, 
    getOrdersForSupplierOrCustomer, );
    router.get('/:id/:role/:order_id',
    validate(getOrder.validationScheme), 
    checkUserId,
    getOrder);
    router.put('/:id/:role/:order_id',
    validate(adjustStatus.validationScheme),
    checkUserId
    , adjustStatus);
    app.use(router.routes())
    .use(router.allowedMethods());


};