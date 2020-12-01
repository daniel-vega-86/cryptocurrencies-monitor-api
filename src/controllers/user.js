const {
  signUp,
  login,
  logout,
  logoutAll,
  modifyUser,
  deleteUser,
} = require("../services/user");
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

const closeSession = async (req, res) => {
  const { token } = req;
  try {
    await logout(token);
    res.status(codes.noContent).send();
  } catch (e) {
    res.send(codes.badRequest).send(e);
  }
};

const closeAllSessions = async (req, res) => {
  const { id } = req.user;
  try {
    await logoutAll(id);
    res.status(codes.noContent).send();
  } catch (e) {
    res.status(codes.badRequest).send(e);
  }
};

const readProfile = (req, res) => res.status(codes.ok).send(req.user);

const modifyProfile = async (req, res) => {
  try {
    const user = await modifyUser(req);
    res.status(codes.ok).send(user);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

const deleteProfile = async (req, res) => {
  try {
    await deleteUser(req);
    res.status(codes.noContent).send();
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

module.exports = {
  createUser,
  access,
  closeSession,
  closeAllSessions,
  readProfile,
  modifyProfile,
  deleteProfile,
};
