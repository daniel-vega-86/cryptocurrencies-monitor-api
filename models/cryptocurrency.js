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

Cryptocurrency.filterData = (coins) => {
  const cryptocurrencies = [];
  coins.forEach((coin) => {
    cryptocurrencies.push({
      id: coin.id,
      symbol: coin.symbol,
      price: coin.current_price,
      name: coin.name,
      image: coin.image,
      lastUpdated: coin.last_updated,
    });
  });
  return cryptocurrencies;
};

Cryptocurrency.orderData = (cryptocurrencies, order, preferedCurrency) => {
  if (order === "asc") {
    cryptocurrencies.sort(
      (a, b) => a.prices[preferedCurrency] - b.prices[preferedCurrency]
    );
  } else {
    cryptocurrencies.sort(
      (a, b) => b.prices[preferedCurrency] - a.prices[preferedCurrency]
    );
  }
  return cryptocurrencies;
};

Cryptocurrency.filterCurrencies = (prices, coinsMarket) => {
  const cryptocurrencies = [];
  coinsMarket.forEach((coin) => {
    cryptocurrencies.push({
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
  return cryptocurrencies;
};

Cryptocurrency.associate = (models) => {
  Cryptocurrency.belongsTo(models.User);
};

module.exports = Cryptocurrency;
