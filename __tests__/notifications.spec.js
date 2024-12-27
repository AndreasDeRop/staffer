const supertest = require('supertest'); 
const { tables, getKnex } = require('../src/data'); 
const users = require('../src/rest/user');
const { withServer, login } = require('./supertest.setup');
const { testAuthHeader } = require('./common/auth');
const test = require('../config/test');
const Role = require('../src/core/roles');
const { not } = require('joi');

const testData = {
    notifications: [
        {
            notification_id: 1,
            type: 'payment_reminder',
            recipient_role: JSON.stringify([Role.CUSTOMER]),
            recipient_id: 1,
            sender_id: 1,
            created_at: '2024-03-07',
            read: 0,
            order_id: 1,
        },
    ],
};


const notificationsToDelete = [1];

describe('Notifications', () => {
      
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
      
     const url = '/api/notifications'; 
    
     describe('GET /api/notifications', () => {
    
          beforeAll(async () => {
                await knex(tables.Notifications).insert(testData.notifications);
          });
          afterAll(async () => {
                await knex(tables.Notifications)
                  .whereIn('notification_id', notificationsToDelete)
                  .delete();
          });
        
          it('should return all notifications', async () => {
             const response = await request.get(url).set('Authorization', authHeader);
             expect(response.status).toBe(403);
          });

          it('should return notifications for user', async () => {
            const response = await request.get(`${url}/1/supplier`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
          });

          it('should return specific notification for user', async () => {
            const response = await request.get(`${url}/1/supplier/1`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
          });
        });
});
