import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('Local Database', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});
