const faker = require("faker");
const factory = require("factory-girl").factory;

const User = require("../../models/user");

const model = "user";

factory.define(model, User, {
  id: factory.sequence("user.id", (n) => n),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: "danielvega",
  password: "contrasena",
  preferedCurrency: faker.random.arrayElement(
    Object.values(["USD", "EUR", "ARS"])
  ),
});

const buildUser = () => factory.build(model);

const createUser = () => factory.create(model);

module.exports = {
  buildUser,
  createUser,
};
