const factory = require("factory-girl").factory;

const Coin = require("../../src/models/coins");

factory.define("coin", Coin, {
  id: factory.sequence("coin.id", (n) => n),
  coinId: "bitcoin",
});

const buildCoin = () => factory.build("coin");

const createCoin = (userId) => factory.create("coin", { userId: userId });

module.exports = {
  buildCoin,
  createCoin,
};
