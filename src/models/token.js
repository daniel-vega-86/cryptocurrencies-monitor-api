const { DataTypes } = require("sequelize");

const db = require("../../config/sequelize");

const Token = db.define(
  "Token",
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "tokens-user",
    underscored: true,
  }
);

Token.associate = (models) => {
  Token.belognsTo(models.User, {
    foreingKey: {
      allowNull: false,
    },
  });
};

module.exports = Token;
