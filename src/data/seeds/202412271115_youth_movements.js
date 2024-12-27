const { tables}  = require("..");
const Role = require("../../core/roles");
module.exports = {
  seed : async (knex) => {
    // 1) Clear existing data
    await knex(tables.Youth_movements).del();
  
    // 2) Insert sample youth movements
    await knex(tables.Youth_movements).insert([
      {
        id: 1,
        name: "Scouts ABC",
        description: "A youth scout movement focused on outdoor activities.",
        // created_at and updated_at will default to now() if set in migrations
      },
      {
        id: 2,
        name: "Chiro XYZ",
        description: "A local youth movement with indoor and outdoor activities.",
      },
    ]);
  }
  };