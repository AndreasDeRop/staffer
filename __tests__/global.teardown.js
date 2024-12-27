const { shutdownData, getKnex, tables } = require('../src/data'); // 👈 2 en 3

// 👇 1
module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.Customers).delete(); // 👈 2
  await getKnex()(tables.Orders).delete(); // 👈 2
    await getKnex()(tables.OrderItems).delete(); // 👈 
    await getKnex()(tables.Products).delete(); // 👈 
    await getKnex()(tables.ProductPrices).delete(); // 
    await getKnex()(tables.ProductDescriptions).delete(); 
    await getKnex()(tables.Suppliers).delete();
    await getKnex()(tables.Messages).delete();
    await getKnex()(tables.Notifications).delete();
    await getKnex()(tables.Companies).delete();

  // Close database connection
  await shutdownData(); // 👈 3
};
