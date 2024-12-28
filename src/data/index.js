const knex = require('knex'); 
const { getLogger } = require('../core/logging'); 
const { join } = require('path'); 

const config = require('config');
const { generatePrimeSync } = require('crypto');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');


let knexInstance; 


async function initializeData() {
  const logger = getLogger(); 
  logger.info('Initializing connection to the database'); 

  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      // database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,  
    }, 
    debug: isDevelopment,
    migrations: {
      tableName: 'knex_meta',
      directory: join('src', 'data', 'migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    },
  };

  knexInstance = knex(knexOptions); // 👈 7

  // check the connection, create the database if it does not exist and reconnect to it
  try {
    await knexInstance.raw("SELECT 1+1 AS result");
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

    // We need to update the Knex configuration and reconnect to use the created database by default
    // USE ... would not work because a pool of connections is used
    await knexInstance.destroy();

    knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw("SELECT 1+1 AS result");
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error("Could not initialize the data layer");
  }
  // run the migrations
  try {
    await knexInstance.migrate.latest();
    logger.info('Database migration successful');
  } catch (error) {
    logger.error('Error while migrating the database', { error });
    throw new Error('Migrations failed, check the logs');
  }

  const userCount = await knexInstance('Users').count('youth_movement_id').first();
  
  // if (isDevelopment) {
    logger.info('Attempting to seed the database');
    try {
      await knexInstance.raw('SET FOREIGN_KEY_CHECKS = 0');
      await knexInstance.seed.run();
      await knexInstance.raw('SET FOREIGN_KEY_CHECKS = 1');
      logger.info('Successfully seeded the database');
    } catch (error) {
      logger.error('Error while seeding the database', { error });
    }
  // } 

  logger.info('Successfully connected to the database');
  return knexInstance;
}

function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance'   
    );
  return knexInstance;
}

async function shutdownData(){
  const logger = getLogger();

  logger.info('Shutting down databse connection');

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Databse connection closed');
}

// 👇 12
const tables = Object.freeze({
  Youth_movements: 'Youth_movements',
  Roles: 'Roles',
  Users: 'Users',
  Meetings: 'Meetings',
  Events: 'Events',
  Tasks: 'Tasks',
  Games: 'Games',
});

module.exports = {
  initializeData,
  shutdownData,
  getKnex, 
  tables, 
};