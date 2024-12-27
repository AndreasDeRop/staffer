const { tables } = require("..");

module.exports = {
  //Migratie uitvoeren
  up: async (knex) => {
    await knex.schema.createTable(tables.Users, (table) => {
      table.increments("id").primary(); //kolom id primary key
      table.integer("youth_movement_id").unsigned().references("id").inTable(tables.Youth_movements).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.integer("role_id").unsigned().references("id").inTable(tables.Roles).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable().unique();
      table.string("password_hash", 255).notNullable();
      table.dateTime("created_at").defaultTo(knex.fn.now());
      table.dateTime("updated_at").defaultTo(knex.fn.now());
    });
  },

  //Migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.Users);
  },
};