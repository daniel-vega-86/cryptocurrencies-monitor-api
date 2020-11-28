const { DataTypes } = require("sequelize");
const db = require("../../config/sequelize");

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

Coin.associate = (models) => {
  Coin.belongsTo(models.User, {
    foreingKey: {
      userId,
      allowNull: false,
    },
  });
};

module.exports = Coin;
