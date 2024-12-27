const { withServer, login } = require('./supertest.setup'); // 👈 5
const {testAuthHeader} = require('./common/auth'); // 👈 6
const {tables} = require('../src/data');
const Role = require('../src/core/roles');

const data = {
    Orders: [{
        order_id: 1,
        sync_id: "1",
        customer_id: 1,
        supplier_id: 1,
        order_reference: "1",
        order_date: "2024-03-07",
        delivery_country: "Belgium",
        delivery_city: "Mechelen",
        delivery_pc: 2800,
        delivery_street: "Korte Nieuwstraat",
        delivery_house_nr: 12,
        order_status: "placed",
        payment_status: "unprocessed",
        card_nr: "123456789",
        card_holder: "John Doe",
        net_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        currency_id: "EUR",
        payment_info: "credit card",
      },],
    };

  const dataToDelete = {
    orders: [1],
    orderItems: [1, 2, 3, 4],
    products: [1, 2, 3, 4],
    productPrices: [1, 2, 3, 4],
    productDescriptions: [1, 2, 3, 4],
    
  };
// 👇 2
describe('Orders', () => {
  // 👇 3
 
  let request, knex, authHeader;

  withServer(({
    supertest,
    knex: k,
  }) => {
    request = supertest;
    knex = k;
  });

  // 👇 4
  beforeAll(async () => {
    authHeader = await login(request); // 👈 5
  });
  const url = '/api/orders'; // 👈 9

  describe ('GET /api/orders', () => {
    beforeAll(async () => {
        await knex(tables.Orders).insert(data.Orders);
      });
      afterAll(async () => {
        await knex(tables.Orders)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
        
        await knex(tables.Orders).insert(data.Orders);
    
        await knex(tables.Orders)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
          await knex(tables.Companies)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
          await knex(tables.Customers)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
          await knex(tables.Orders)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
          await knex(tables.Orders)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
          await knex(tables.Orders)
          .whereIn('order_id', dataToDelete.orders)
          .delete();
      });

    it('should return all orders', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(403);
    });
    testAuthHeader(() => request.get(url));
  });


    describe ('GET /api/orders/:id', () => {
  it('should return the requested order', async () => {
    const response = await request.get(`${url}/1`)
    .set('Authorization', authHeader); 
    expect(response.statusCode).toBe(200); 
  });

  testAuthHeader(() => request.get(url));
});
});