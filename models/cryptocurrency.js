const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");

const Cryptocurrency = db.define(
  "Cryptocurrency",
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
    cryptocurrencyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "cryptocurrencies-user",
    underscored: true,
  }
);

Cryptocurrency.cleanData = (coins) =>
  coins.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    price: coin.current_price,
    name: coin.name,
    image: coin.image,
    lastUpdated: coin.last_updated,
  }));

Cryptocurrency.orderData = (cryptocurrencies, order, preferedCurrency) => {
  return cryptocurrencies.sort((a, b) => {
    if (order === "asc")
      return a.prices[preferedCurrency] - b.prices[preferedCurrency];
    return b.prices[preferedCurrency] - a.prices[preferedCurrency];
  });
};

Cryptocurrency.cleanCurrencies = (prices, coinsMarket) =>
  coinsMarket.map((coin) => ({
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
  }));

Cryptocurrency.associate = (models) => {
  Cryptocurrency.belongsTo(models.User);
};

module.exports = Cryptocurrency;
