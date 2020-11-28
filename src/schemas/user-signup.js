const { messages } = require("../../config/dictionary");
const User = require("../models/user");

const signUpSchema = {
  firstName: {
    notEmpty: {
      errorMessage: messages.emptyField("First name"),
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: messages.emptyField("Last name"),
    },
  },
  username: {
    notEmpty: {
      errorMessage: messages.emptyField("Username"),
    },
    custom: {
      options: async (value) => {
        const user = await User.findOne({ where: { username: value } });
        if (user) {
          throw new Error(messages.usernameInUse);
        }
      },
    },
    trim: true,
    toLowerCase: true,
  },
  password: {
    notEmpty: {
      errorMessage: messages.emptyField("Password"),
    },
    isAlphanumeric: {
      errorMessage: messages.alphaPass,
    },
    isLength: {
      errorMessage: messages.lenPass,
      options: { min: 8 },
    },
  },
  preferedCurrency: {
    in: ["body"],
    toUpperCase: true,
    matches: {
      options: [/\b(?:USD|EUR|ARS)\b/],
      errorMessage: messages.invalidCurrency,
    },
    notEmpty: {
      errorMessage: messages.emptyField("Prefered currency"),
    },
  },
};

module.exports = signUpSchema;
