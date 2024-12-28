const { tables } = require("..");
const Role = require("../../core/roles");

module.exports = {
  seed: async (knex) => {
     // 1) Clear existing data
  await knex(tables.Users).del();

  // 2) Insert sample users
  await knex(tables.Users).insert([
    {
      id: 1,
      youth_movement_id: 1, // Scouts ABC
      role_id: 1,           // 'Leader' for Scouts
      name: "Andre",
      email: "andreasderop@hotmail.com",
      password_hash: "$argon2i$v=19$m=17,t=2,p=1$Tjk5dmVNRlJsSmh6VWE3eA$8PFxAz8Sex1gClOCpFmkUrluEGQGaWISZsRNw5mUOuA",
    },
    {
      id: 2,
      youth_movement_id: 1, // Scouts ABC
      role_id: 2,           // 'Penning' for Scouts
      name: "Bob",
      email: "bob@scoutsabc.com",
      password_hash: "$argon2i$v=19$m=17,t=2,p=1$Tjk5dmVNRlJsSmh6VWE3eA$8PFxAz8Sex1gClOCpFmkUrluEGQGaWISZsRNw5mUOuA",
    },
    {
      id: 3,
      youth_movement_id: 2, // Chiro XYZ
      role_id: 3,           // 'Leader' for Chiro
      name: "Charlie",
      email: "charlie@chiroxyz.com",
      password_hash: "$argon2i$v=19$m=17,t=2,p=1$Tjk5dmVNRlJsSmh6VWE3eA$8PFxAz8Sex1gClOCpFmkUrluEGQGaWISZsRNw5mUOuA",
    },
  ]);
}
};
