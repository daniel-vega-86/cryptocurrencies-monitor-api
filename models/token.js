const { DataTypes } = require("sequelize");

const db = require("../config/sequelize");
const User = require("./user");

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
  Token.belongsTo(models.User);
};

module.exports = Token;
