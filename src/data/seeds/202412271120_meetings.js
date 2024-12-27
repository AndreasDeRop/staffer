const { tables } = require('..');


module.exports = {
        seed: async (knex) => { 
                // 1) Clear existing data
        await knex(tables.Meetings).del();

        // 2) Insert sample meetings
        // Here we assume meeting is for Scouts (id=1)
        await knex(tables.Meetings).insert([
            {
            id: 1,
            youth_movement_id: 1, // Scouts ABC
            date_time: new Date("2025-02-15T10:00:00Z"),
            agenda: "Planning the upcoming summer camp",
            },
            {
            id: 2,
            youth_movement_id: 2, // Chiro XYZ
            date_time: new Date("2025-03-01T14:00:00Z"),
            agenda: "Discuss the spring break schedule",
            },
        ]);
    },
};