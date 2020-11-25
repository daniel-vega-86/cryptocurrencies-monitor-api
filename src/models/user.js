const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const db = require("../../config/sequelize");
const { messages } = require("../../config/dictionary");

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: messages.emptyField("First name"),
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: messages.emptyField("Last name"),
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: messages.usernameInUse,
      },
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: messages.emptyField("Username"),
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: messages.emptyField("Password"),
        },
        isAlphanumeric: {
          args: true,
          msg: messages.alphaPass,
        },
        len: {
          args: [8],
          msg: messages.lenPass,
        },
      },
    },
    preferedCurrency: {
      type: DataTypes.ENUM({
        values: ["USD", "EUR", "ARS"],
      }),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: messages.emptyField("Prefered currency"),
        },
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "users",
    underscored: true,
  }
);

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, +process.env.SALT);
  user.password = hashedPassword;
});

module.exports = User;
