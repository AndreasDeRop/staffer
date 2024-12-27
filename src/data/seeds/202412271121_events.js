const { tables}  = require("..");
module.exports = {
        seed: async (knex) => {
        // 1) Clear existing data
    await knex(tables.Events).del();

    // 2) Insert sample events
    await knex(tables.Events).insert([
        {
        id: 1,
        youth_movement_id: 1, // Scouts ABC
        title: "Weekend Hike",
        description: "A two-day hike in the nearby forest.",
        start_time: new Date("2025-03-01T09:00:00Z"),
        end_time: new Date("2025-03-02T18:00:00Z"),
        location: "Greenwood Forest",
        },
        {
        id: 2,
        youth_movement_id: 2, // Chiro XYZ
        title: "Indoor Games Day",
        description: "A fun day of games and activities.",
        start_time: new Date("2025-04-10T10:00:00Z"),
        end_time: new Date("2025-04-10T16:00:00Z"),
        location: "Chiro Hall",
        },
    ]);
    },
  };