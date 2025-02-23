require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAMETEST,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: process.env.DB_DIALECT,
  },
};
