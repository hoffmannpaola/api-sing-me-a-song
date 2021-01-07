const { Sequelize } = require('sequelize');
require('pg').defaults.parseInt8 = true;

const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, { dialect: 'postgres' });

module.exports = sequelize;