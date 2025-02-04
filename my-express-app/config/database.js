// config/database.js
const { Sequelize } = require('sequelize');

// Create a Sequelize instance and connect to PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // your database host
  username: 'your_username', // your database username
  password: 'your_password', // your database password
  database: 'your_database', // the name of your database
  logging: false, // turn off logging to keep things clean
});

module.exports = sequelize;
