import { Sequelize } from 'sequelize';

// Create Sequelize instance
export const sequelize = new Sequelize('Vahan', 'postgres', 'Testing1234', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

// Function to test the database connection
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
