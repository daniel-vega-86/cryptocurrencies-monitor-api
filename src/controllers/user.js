const { signUp } = require("../services/user");
const { codes, messages } = require("../../config/dictionary");

const createUser = async (req, res) => {
  try {
    const user = await signUp(req.body);
    res.status(codes.created).send(user);
    console.info("User name: ", user.username);
  } catch (e) {
    res.status(codes.badRequest).send(e);
    console.error("Error: ", e.message);
  }
};

module.exports = {
  createUser,
};
