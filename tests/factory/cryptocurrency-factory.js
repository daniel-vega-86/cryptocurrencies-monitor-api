const factory = require("factory-girl").factory;

const Cryptocurrency = require("../../src/models/cryptocurrency");

factory.define("cryptocurrency", Cryptocurrency, {
  id: factory.sequence("cryptocurrency.id", (n) => n),
});

const createCryptocurrency = (userId, cryptocurrencyId) =>
  factory.create("cryptocurrency", {
    userId: userId,
    cryptocurrencyId: cryptocurrencyId,
  });

module.exports = {
  createCryptocurrency,
};
