const faker = require("faker");
const factory = require("factory-girl").factory;

const User = require("../../src/models/user");

factory.define("user", User, {
  id: factory.sequence("user.id", (n) => n),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: "danielvega",
  password: "contrasena",
  preferedCurrency: faker.random.arrayElement(
    Object.values(["USD", "EUR", "ARS"])
  ),
});

const buildUser = () => factory.build("user");

const createUser = () => factory.create("user");

module.exports = {
  buildUser,
  createUser,
};
