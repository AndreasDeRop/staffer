const config = require('config'); // 👈 1
const jwt = require('jsonwebtoken'); // 👈 2

const JWT_AUDIENCE = config.get('auth.jwt.audience'); // 👈 1
const JWT_SECRET = config.get('auth.jwt.secret'); // 👈 1
const JWT_ISSUER = config.get('auth.jwt.issuer'); // 👈 1
const JWT_EXPIRATION_INTERVAL = config.get('auth.jwt.expirationInterval'); // 👈 1

// 👇 3
const generateJWT = (user) => {
  // 👇 4
  const tokenData = {
    userid: user.customer_id || user.supplier_id,
    roles: user.role,
  };
 


  // 👇 5
  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: 'auth',
  };

  // 👇 6
  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        console.log('Error while signing new token:', err.message);
        return reject(err);
      }
      return resolve(token);
    });
  });
};

const verifyJWT = (authToken) => {
    // 👇 1
    const verifyOptions = {
      audience: JWT_AUDIENCE,
      issuer: JWT_ISSUER,
      subject: 'auth',
    };
  
    // 👇 2
    return new Promise((resolve, reject) => {
      jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
        if (err || !decodedToken) {
          console.log('Error while verifying token:', err.message);
          return reject(err || new Error('Token could not be parsed'));
        }
        return resolve(decodedToken);
      });
    });
  };


module.exports = { // 👈 3
  generateJWT,
  verifyJWT,
};