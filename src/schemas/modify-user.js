const { messages } = require("../../config/dictionary");
const User = require("../../models/user");

const signUpSchema = {
  firstName: {
    notEmpty: {
      errorMessage: messages.emptyField("First name"),
    },
    optional: { options: { nullable: true, checkFalsy: true } },
  },
  lastName: {
    notEmpty: {
      errorMessage: messages.emptyField("Last name"),
    },
    optional: { options: { nullable: true, checkFalsy: true } },
  },
  username: {
    notEmpty: {
      errorMessage: messages.emptyField("Username"),
    },
    optional: { options: { nullable: true, checkFalsy: true } },
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
    optional: { options: { nullable: true, checkFalsy: true } },
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
    optional: { options: { nullable: true, checkFalsy: true } },
  },
};

module.exports = signUpSchema;
