require('dotenv').config()
const Sequelize = require('sequelize')

module.exports = {
  host: 'mysql',
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dialect: 'mysql',
  migrationStorageTableName: 'z_sequelize_migrations',
  seederStorageTableName: 'z_sequelize_seeders',
  operatorsAliases: Sequelize.Op,
  logging: false,
  define: {
    timestamps: true,
    freezeTableName: true
  }
}