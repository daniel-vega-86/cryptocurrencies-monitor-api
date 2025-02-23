const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../config/sequelize");
const { messages } = require("../config/dictionary");
const Token = require("./token");
// const Cryptocurrency = require("./cryptocurrency");

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

User.associate = (models) => {
  User.hasMany(models.Token, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Cryptocurrency, {
    foreignKey: "userId",
    onDelete: "cascade",
  });
};

User.findByCredential = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error(messages.invalidUser);
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error(messages.invalidPass);
  }
  return user;
};

User.findByToken = async (token) => {
  const activeToken = await Token.findOne({
    where: { token },
  });
  if (!activeToken) {
    return undefined;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    where: { id: decoded.id },
  });
  return user;
};

const encryptPasswordIfChanged = async (user, options) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, +process.env.SALT);
  }
};

User.beforeCreate(encryptPasswordIfChanged);
User.beforeUpdate(encryptPasswordIfChanged);

module.exports = User;
