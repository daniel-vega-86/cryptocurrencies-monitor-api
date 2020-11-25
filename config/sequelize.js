require("dotenv").config();
const Sequelize = require("sequelize");
const configDb = require("./config");
const environment = process.env.NODE_ENV;

let sequelize;
if (configDb[environment].use_env_variable) {
  sequelize = new Sequelize(
    process.env[configDb[environment].use_env_variable],
    {
      dialect: process.env.DB_DIALECT,
    }
  );
} else {
  sequelize = new Sequelize(
    configDb[environment].database,
    configDb[environment].username,
    configDb[environment].password,
    {
      dialect: process.env.DB_DIALECT,
      port: "5432",
    }
  );
}

module.exports = sequelize;
