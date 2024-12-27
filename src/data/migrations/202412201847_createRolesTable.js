const { tables } = require("..");

module.exports = {
  //Migratie uitvoeren
  up: async (knex) => {
    await knex.schema.createTable(tables.Roles, (table) => {
      table.increments("id").primary();
      table.integer("youth_movement_id").unsigned().references("id").inTable(tables.Youth_movements).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
      table.string("name", 255).notNullable();
      table.string("description");
      table.dateTime("created_at").defaultTo(knex.fn.now());
      table.dateTime("updated_at").defaultTo(knex.fn.now());
    });
  },

  //Migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.Roles);
  },
};