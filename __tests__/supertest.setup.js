const supertest = require('supertest'); // 👈 1

const createServer = require('../src/createServer'); // 👈 3
const { getKnex } = require('../src/data'); // 👈 4


const login = async (supertest) => {
  // 👇 7
  const response = await supertest.post('/api/users/login').send({
    username: 'delawareS',
    password: 'anyname',
  });

  // 👇 8
  if (response.status !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`; 
};

// 👇 1
const withServer = (setter) => { 
  let server; // 👈 2

  beforeAll(async () => {
    server = await createServer(); 

    // 👇 4
    setter({
      knex: getKnex(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

module.exports = {
  login,
  withServer,
}; // 👈 1 en 6
