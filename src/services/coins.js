const api = require("../../config/axios");
const Coin = require("../models/coins");
const { messages } = require("../../config/dictionary");

const listCoins = async (preferedCurrency) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: coins } = await api.get("/coins/markets", {
        params: { vs_currency: preferedCurrency },
      });
      const cryptoCoins = Coin.filterData(coins);
      resolve(cryptoCoins);
    } catch (e) {
      reject(e);
    }
  });
};

const selectCoins = async (user, coinId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assigned = await Coin.findOne({
        where: { userId: user.id, coinId },
      });
      if (assigned) {
        throw new Error(messages.assignedCoin);
      }
      const { data: coin } = await api.get("/coins/markets", {
        params: { vs_currency: user.preferedCurrency, ids: coinId },
      });
      if (coin.length === 0) {
        throw new Error(messages.invalidCoin);
      }
      const cryptoCoin = Coin.filterData(coin);
      await Coin.create({
        userId: user.id,
        coinId,
      });
      resolve(cryptoCoin);
    } catch (e) {
      reject(e);
    }
  });
};

const listUserCoins = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { top = 10, order } = req.query;
      if (top > 25) {
        throw new Error("You can check a maximun of 25 crytocurrencies");
      }
      const assignedCoins = await Coin.findAll({
        where: { userId: req.user.id },
      });
      const coinsId = [];
      assignedCoins.forEach((coin) => {
        coinsId.push(coin.dataValues.coinId);
      });
      const { data: prices } = await api.get("/simple/price", {
        params: {
          ids: coinsId.toString(),
          vs_currencies: "usd,eur,ars",
        },
      });
      const { data: coinsMarket } = await api.get("/coins/markets", {
        params: {
          vs_currency: req.user.preferedCurrency,
          ids: coinsId.toString(),
        },
      });
      const cryptoCoins = await Coin.filterTopCoins(prices, coinsMarket);
      const orderedCoins = Coin.orderData(
        cryptoCoins,
        order,
        req.user.preferedCurrency
      );
      resolve(orderedCoins.slice(0, top));
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { listCoins, selectCoins, listUserCoins };
