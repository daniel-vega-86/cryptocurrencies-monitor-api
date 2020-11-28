const factory = require("factory-girl").factory;

const Coin = require("../../src/models/coins");

factory.define("coin", Coin, {
  id: factory.sequence("coin.id", (n) => n),
});

const createCoin = (userId, coinId) =>
  factory.create("coin", { userId: userId, coinId: coinId });

module.exports = {
  createCoin,
};
