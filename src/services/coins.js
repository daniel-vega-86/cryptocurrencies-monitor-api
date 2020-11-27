const api = require("../../config/axios");
const Coin = require("../models/coins");
const { messages } = require("../../config/dictionary");
const { resolve } = require("path");

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
      const { top = 2 } = req.query;
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
      const cryptoCoins = [];
      coinsMarket.forEach((coin) => {
        cryptoCoins.push({
          id: coin.id,
          symbol: coin.symbol,
          priceARS: prices[coin.id].ars,
          priceUSD: prices[coin.id].usd,
          priceEUR: prices[coin.id].eur,
          name: coin.name,
          image: coin.image,
          lastUpdated: coin.last_updated,
        });
      });
      resolve(cryptoCoins.slice(0, top));
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { listCoins, selectCoins, listUserCoins };
