const { signUp, login } = require("../services/user");
const { codes, messages } = require("../../config/dictionary");

const createUser = async (req, res) => {
  try {
    const user = await signUp(req.body);
    res.status(codes.created).send(user);
    console.info("Username: ", user.username);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e });
    console.info("Error: ", e.message);
  }
};

const access = async (req, res) => {
  try {
    const user = await login(req.body);
    res.status(codes.ok).send(user);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

module.exports = {
  createUser,
  access,
};
