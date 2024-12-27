const { tables } = require("..");

module.exports = {
  //Migratie uitvoeren
  up: async (knex) => {
    await knex.schema.createTable(tables.Tasks, (table) => {
        table.increments("id").primary();
        table.integer("youth_movement_id").unsigned().references("id").inTable(tables.Youth_movements).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
        table.integer("meeting_id").unsigned().references("id").inTable(tables.Meetings).onDelete("CASCADE").onUpdate("CASCADE");
        table.integer("assigned_user_id").unsigned().references("id").inTable(tables.Users).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
        table.integer("created_by_user_id").unsigned().references("id").inTable(tables.Users).onDelete("CASCADE").onUpdate("CASCADE").notNullable();
        table.string("description").notNullable();
        table.string("status", 50).notNullable();
        table.dateTime("due_date").notNullable();
        table.dateTime("created_at").defaultTo(knex.fn.now());
        table.dateTime("updated_at").defaultTo(knex.fn.now());
    });
},


  //Migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.Tasks);
  },
};