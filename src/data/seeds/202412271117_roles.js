const { tables}  = require("..");
const Role = require("../../core/roles");
module.exports = {
    seed: async (knex) => {
      // 1) Clear existing data
  await knex(tables.Roles).del();

  // 2) Insert sample roles for each youth movement
  await knex(tables.Roles).insert([
    {
      id: 1,
      youth_movement_id: 1, // Scouts ABC
      name: "Leader",
      description: "Responsible for planning & overall management (Scouts).",
    },
    {
      id: 2,
      youth_movement_id: 1, // Scouts ABC
      name: "Penning",
      description: "Handles finances and budgeting (Scouts).",
    },
    {
      id: 3,
      youth_movement_id: 2, // Chiro XYZ
      name: "Leader",
      description: "Leader role for Chiro XYZ.",
    },
  ])
  }
};