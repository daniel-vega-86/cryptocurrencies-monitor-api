const api = require("../../config/axios");

const listCoins = async (preferedCurrency) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: coins } = await api.get("/coins/markets", {
        params: { vs_currency: preferedCurrency },
      });
      const cryptoCoins = [];
      coins.forEach((coin) => {
        cryptoCoins.push({
          id: coin.id,
          symbol: coin.symbol,
          price: coin.current_price,
          name: coin.name,
          image: coin.image,
          lastUpdated: coin.last_updated,
        });
      });
      resolve(cryptoCoins);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { listCoins };
