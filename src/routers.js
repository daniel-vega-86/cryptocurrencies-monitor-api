const express = require("express");

const validatorBySchema = require("./middleware/validation");
const auth = require("./middleware/auth");
const {
  createUser,
  access,
  closeSession,
  closeAllSessions,
} = require("./controllers/user");
const {
  getCryptocurrencies,
  assignCryptocurrency,
  userCryptocurrencies,
  getUserCryptocurrency,
} = require("./controllers/cryptocurrency");
const signUpSchema = require("./schemas/user-signup");
const assignSchema = require("./schemas/cryptocurrency-assign");

const router = new express.Router();

router.post("/users", validatorBySchema(signUpSchema), createUser);
router.post("/users/login", access);

router.use(auth);

router.get("/cryptocurrencies", getCryptocurrencies);
router.post(
  "/cryptocurrencies/assign",
  validatorBySchema(assignSchema),
  assignCryptocurrency
);
router.get("/cryptocurrencies/list", userCryptocurrencies);
router.get("/cryptocurrencies/list/:id", getUserCryptocurrency);

router.post("/users/logout", closeSession);
router.post("/users/logoutAll", closeAllSessions);

module.exports = router;
