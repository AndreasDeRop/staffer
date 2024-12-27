const { tables}  = require("..");
module.exports = {
    seed: async (knex) => {
            // 1) Clear existing data
        await knex(tables.Tasks).del();

        // 2) Insert sample tasks
        // Example: Task assigned to Bob (user_id=2) by Alice (user_id=1), referencing meeting_id=1 (Scouts meeting)
        await knex(tables.Tasks).insert([
            {
            id: 1,
            youth_movement_id: 1,  // Scouts ABC
            meeting_id: 1,         // Meeting #1 (Scouts)
            assigned_user_id: 2,   // Bob
            created_by_user_id: 1, // Alice
            description: "Prepare the budget for the summer camp",
            status: "pending",
            due_date: new Date("2025-02-28"),
            },
            {
            id: 2,
            youth_movement_id: 2,  // Chiro XYZ
            meeting_id: 2,         // Meeting #2 (Chiro)
            assigned_user_id: 3,   // Charlie
            created_by_user_id: 3, // Charlie (self-assigned, for example)
            description: "Buy snacks for the Indoor Games Day",
            status: "in_progress",
            due_date: new Date("2025-03-31"),
            },
        ]);
    },
  };