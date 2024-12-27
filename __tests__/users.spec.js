const supertest = require('supertest'); 
const { tables, getKnex } = require('../src/data'); 
const users = require('../src/rest/user');
const { withServer, login } = require('./supertest.setup');
const { testAuthHeader } = require('./common/auth');
const test = require('../config/test');
const Role = require('../src/core/roles');

const testData = {
    Users: [
        {
        customer_id: 3,
        company_id: 1,
        username: 'delawareC',
        password_hash: '$argon2i$v=19$m=16,t=2,p=1$NjgwY21OR2NyUThRSlh1cQ$PvZESI0N11VcDsZOVHMpAbWt9sZb/v7aZzq70hRmSMA',
        role: JSON.stringify([Role.CUSTOMER]),
        is_active: true,
        },
    ],
    };

    const usersToDelete = [3];

    describe('Users', () => {
  
        let request;
        let knex;
        let authHeader;
      
        withServer(({
          supertest, 
          knex: k,
        }) => {
          request = supertest;
          knex = k;
        });
      
        
        beforeAll(async () => {
          authHeader = await login(request);
          
        });
      
        const url = '/api/users'; 

        describe('GET /api/users', () => {

            beforeAll(async () => {
                await knex(tables.Customers).insert(testData.Users);
            });
            afterAll(async () => {
                await knex(tables.Customers)
                  .whereIn('customer_id', usersToDelete)
                  .delete();
            });
          
            it('should return all users', async () => {
              const response = await request.get(url).set('Authorization', authHeader);
              expect(response.status).toBe(404);
            });

            it('should return user with customer_id 1', async () => {
                const response = await request.get(`${url}/1/customer`);
                expect(response.status).toBe(200);
              });
          });

    });