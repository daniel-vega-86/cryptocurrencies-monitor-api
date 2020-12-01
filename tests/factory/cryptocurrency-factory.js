const factory = require("factory-girl").factory;

const Cryptocurrency = require("../../models/cryptocurrency");

const model = "cryptocurrency";

factory.define(model, Cryptocurrency, {
  id: factory.sequence("cryptocurrency.id", (n) => n),
});

const createCryptocurrency = (userId, cryptocurrencyId) =>
  factory.create(model, {
    userId: userId,
    cryptocurrencyId: cryptocurrencyId,
  });

module.exports = {
  createCryptocurrency,
};
