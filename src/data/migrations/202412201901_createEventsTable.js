const { tables } = require("..");

module.exports = {
  // Migratie uitvoeren
  up: async (knex) => {
    await knex.schema.createTable(tables.Events, (table) => {
        table.increments("id").primary(); // Unique identifier for each event
        table.integer("youth_movement_id").unsigned().references("id").inTable(tables.Youth_movements).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
        table.string("title", 255).notNullable(); // Name of the event
        table.string("description"); // Description of the event
        table.dateTime("start_time").notNullable(); // Date and time when the event starts
        table.dateTime("end_time").notNullable(); // Date and time when the event ends
        table.string("location", 255); // Location of the event
        table.dateTime("created_at").defaultTo(knex.fn.now()); // Date and time when the event was created
        table.dateTime("updated_at").defaultTo(knex.fn.now()); // Date and time when the event was last updated
    });
  },

  // Migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.Events);
  },
};