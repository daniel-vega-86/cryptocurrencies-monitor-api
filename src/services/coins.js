const api = require("../../config/axios");
const Coin = require("../models/coins");

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
        throw new Error("You had already assigned this cryptocurrency.");
      }
      const { data: coin } = await api.get("/coins/markets", {
        params: { vs_currency: user.preferedCurrency, ids: coinId },
      });
      if (coin.length === 0) {
        throw new Error("Cryptocurrencie not found.");
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

module.exports = { listCoins, selectCoins };
