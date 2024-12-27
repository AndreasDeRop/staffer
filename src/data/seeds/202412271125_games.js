const { tables}  = require("..");
module.exports = {
    seed: async (knex) => {
        await knex(tables.Games).del();

        // 2) Insert sample games
        await knex(tables.Games).insert([
          {
            id: 1,
            youth_movement_id: 1, // Scouts ABC
            title: "Capture the Flag",
            description:
              "A fun outdoor game where two teams try to capture each other's flag.",
            required_materials: "Flags, boundary markers",
            age_range: "8-14",
          },
          {
            id: 2,
            youth_movement_id: 2, // Chiro XYZ
            title: "Musical Chairs",
            description: "A classic indoor game that tests quick reactions.",
            required_materials: "Chairs, music player",
            age_range: "6-12",
          },
        ]);
    },
  };