const api = require("../../config/axios");
const Cryptocurrency = require("../../models/cryptocurrency");
const { messages } = require("../../config/dictionary");

const listCryptocurrencies = (preferedCurrency) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: coins } = await api.get("/coins/markets", {
        params: { vs_currency: preferedCurrency },
      });
      const cryptocurrencies = Cryptocurrency.filterData(coins);
      resolve(cryptocurrencies);
    } catch (e) {
      reject(e);
    }
  });
};

const selectCryptocurrencies = (user, cryptocurrencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assigned = await Cryptocurrency.findOne({
        where: { userId: user.id, cryptocurrencyId },
      });
      if (assigned) {
        throw new Error(messages.assignedCryptocurrency);
      }
      const { data: coin } = await api.get("/coins/markets", {
        params: { vs_currency: user.preferedCurrency, ids: cryptocurrencyId },
      });
      if (coin.length === 0) {
        throw new Error(messages.invalidCryptocurrency);
      }
      const cryptocurrency = Cryptocurrency.filterData(coin);
      await Cryptocurrency.create({
        userId: user.id,
        cryptocurrencyId,
      });
      resolve(cryptocurrency);
    } catch (e) {
      reject(e);
    }
  });
};

const listUserCryptocurrencies = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { top = 10, order } = req.query;
      if (top > 25) {
        throw new Error("You can check a maximun of 25 crytocurrencies");
      }
      const assignedCryptocurrencies = await Cryptocurrency.findAll({
        where: { userId: req.user.id },
      });
      const cryptocurrenciesId = [];
      assignedCryptocurrencies.forEach((coin) => {
        cryptocurrenciesId.push(coin.dataValues.cryptocurrencyId);
      });
      const cryptocurrencies = await getCryptocurrency(
        req.user,
        cryptocurrenciesId.toString()
      );
      const ordered = Cryptocurrency.orderData(
        cryptocurrencies,
        order,
        req.user.preferedCurrency
      );
      resolve(ordered.slice(0, top));
    } catch (e) {
      reject(e);
    }
  });
};

const userCryptocurrency = (user, cryptocurrencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const assigned = await Cryptocurrency.findOne({
        where: { userId: user.id, cryptocurrencyId },
      });
      if (!assigned) {
        throw new Error(messages.unassignedCryptocurrency);
      }
      const cryptocurrency = await getCryptocurrency(user, cryptocurrencyId);
      resolve(cryptocurrency);
    } catch (e) {
      reject(e);
    }
  });
};

const getCryptocurrency = (user, cryptocurrencyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: prices } = await api.get("/simple/price", {
        params: {
          ids: cryptocurrencyId,
          vs_currencies: "usd,eur,ars",
        },
      });
      const { data: cryptocurrenciesData } = await api.get("/coins/markets", {
        params: {
          vs_currency: user.preferedCurrency,
          ids: cryptocurrencyId,
        },
      });
      const cryptocurrencies = await Cryptocurrency.filterCurrencies(
        prices,
        cryptocurrenciesData
      );
      resolve(cryptocurrencies);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCryptocurrency = async (userId, cryptocurrencyId) =>
  await Cryptocurrency.destroy({ where: { userId, cryptocurrencyId } });

module.exports = {
  listCryptocurrencies,
  selectCryptocurrencies,
  listUserCryptocurrencies,
  userCryptocurrency,
  deleteCryptocurrency,
};
