const { messages } = require("../../config/dictionary");

const assignSchema = {
  id: {
    notEmpty: {
      errorMessage: messages.emptyField("id"),
    },
    toLowerCase: true,
    trim: true,
  },
};

module.exports = assignSchema;
