const { tables } = require("..");

module.exports = {
  // Migratie uitvoeren
  up: async (knex) => {
    await knex.schema.createTable(tables.Meetings, (table) => {
    table.increments("id").primary(); // Unique identifier for each meeting
    table.integer("youth_movement_id").unsigned().references("id").inTable(tables.Youth_movements).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
    table.dateTime("date_time").notNullable(); // Date and time when the meeting starts
    table.string("agenda"); // Agenda of the meeting
    table.dateTime("created_at").defaultTo(knex.fn.now()); // Date and time when the meeting was created
    table.dateTime("updated_at").defaultTo(knex.fn.now()); // Date and time when the meeting was last updated
    });
  },

  // Migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.Meetings);
  },
};

