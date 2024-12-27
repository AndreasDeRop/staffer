const config = require('config'); // 👈 2
const { initializeLogger } = require('../src/core/logging'); // 👈 2
const Role = require('../src/core/roles'); // 👈 4
const { initializeData, getKnex, tables } = require('../src/data'); // 👈 3 en 4
const { hashPassword } = require('../src/core/password'); // 👈    4
// 👇 1
module.exports = async () => {
 
  initializeLogger({
    level: config.get('log.level'),
    disabled: config.get('log.disabled'),
  });
  await initializeData(); // 👈 3

  const knex = getKnex(); // 👈 3

   await knex(tables.Companies).insert([
        {
            company_id: 1,
            logo: "https://imgur.com/XHxBRHK",
            name: "delaware",
            sector: "IT",
            country: "Belgium",
            postal_code: "2800",
            street: "Korte Nieuwstraat",
            house_nr: 12,
            email: "delaware@gmail.com",
            phone: "0487654321",
            vat_nr: "BE123456789",
            city: "Mechelen",
          },
          {
            company_id: 20,
            logo: "https://imgur.com/XHxBRHK",
            name: "ringsbydre",
            sector: "Jewelry",
            country: "Belgium",
            postal_code: "4000",
            street: "Horlogeriestraat",
            house_nr: 212,
            email: "ringsbydre@gmail.com",
            phone: "0487654340",
            vat_nr: "BE147258369",
            city: "Liège",
          },
    ]);
        
   
  await knex(tables.Customers).insert(
    {
        customer_id: 1,
        company_id: 1,
        username: "delawareC",
          password_hash: hashPassword("anyname"),
        role: JSON.stringify([Role.CUSTOMER]),
        is_active: true,
      },

  );
    await knex(tables.Suppliers).insert(
        {
            supplier_id: 1,
            company_id: 1,
            username: "delawareS",
            password_hash:
            '$argon2i$v=19$m=16,t=2,p=1$NjgwY21OR2NyUThRSlh1cQ$PvZESI0N11VcDsZOVHMpAbWt9sZb/v7aZzq70hRmSMA',
            role: JSON.stringify([Role.SUPPLIER]),
            is_active: true,
        },
        {
            supplier_id: 20,
            company_id: 20,
            username: "ringsbydreS",
              password_hash:
              '$argon2i$v=19$m=16,t=2,p=1$NjgwY21OR2NyUThRSlh1cQ$PvZESI0N11VcDsZOVHMpAbWt9sZb/v7aZzq70hRmSMA',
            role: JSON.stringify([Role.SUPPLIER]),
            is_active: true,
          },
    );

    

};
