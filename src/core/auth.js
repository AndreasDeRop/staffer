const usersService = require('../service/users');

// 👇 1
const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers; // 👈 3

  // 👇 4
  const { authToken, ...session } = await usersService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session; // 👈 5
  ctx.state.authToken = authToken; // 👈 6

  return next(); // 👈 7
};

// 👇 2
const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session; // 👈 8
  console.log('roles:', roles); 
  usersService.checkRole(role, roles); // 👈 9
  return next(); // 👈 10
};

module.exports = {
  requireAuthentication, // 👈 1
  makeRequireRole, // 👈 2
}; 
