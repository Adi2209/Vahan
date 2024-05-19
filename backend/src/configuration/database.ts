import { Sequelize } from 'sequelize';

/**
 * Sequelize database connection instance.
 */
export const sequelize = new Sequelize('Vahan', 'postgres', 'Testing1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  port: 5432
});

/**
 * Test the database connection.
 * @returns {Promise<void>} A Promise that resolves when the connection is successfully established.
 */
export async function testConnection() {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync all defined models with the database
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

  } catch (error) {
    // Handle connection errors
    console.error('Unable to connect to the database:', error);
  }
}
