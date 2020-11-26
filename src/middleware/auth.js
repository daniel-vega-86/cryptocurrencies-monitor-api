const User = require("../models/user");
const { codes, messages } = require("../../config/dictionary");

const auth = async (req, res, next) => {
  try {
    const user = await User.findByToken(req);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(codes.unauthorized).send({ error: messages.unauthorized });
    console.info("Error: ", messages.unauthorized);
  }
};

module.exports = auth;
