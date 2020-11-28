const { DataTypes } = require("sequelize");
const db = require("../../config/sequelize");
const api = require("../../config/axios");

const Coin = db.define(
  "Coin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coinId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "coins-user",
    underscored: true,
  }
);

Coin.filterData = (coins) => {
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
  return cryptoCoins;
};

Coin.orderData = (cryptoCoins, order, preferedCurrency) => {
  if (order === "asc") {
    cryptoCoins.sort(
      (a, b) => a.prices[preferedCurrency] - b.prices[preferedCurrency]
    );
  } else {
    cryptoCoins.sort(
      (a, b) => b.prices[preferedCurrency] - a.prices[preferedCurrency]
    );
  }
  return cryptoCoins;
};

Coin.filterTopCoins = (prices, coinsMarket) => {
  const cryptoCoins = [];
  coinsMarket.forEach((coin) => {
    cryptoCoins.push({
      id: coin.id,
      symbol: coin.symbol,
      prices: {
        ARS: prices[coin.id].ars,
        USD: prices[coin.id].usd,
        EUR: prices[coin.id].eur,
      },
      name: coin.name,
      image: coin.image,
      lastUpdated: coin.last_updated,
    });
  });
  return cryptoCoins;
};

Coin.associate = (models) => {
  Coin.belongsTo(models.User, {
    foreingKey: {
      userId,
      allowNull: false,
    },
  });
};

module.exports = Coin;
