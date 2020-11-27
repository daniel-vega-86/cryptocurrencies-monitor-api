const express = require("express");

const validatorBySchema = require("./middleware/validation");
const auth = require("./middleware/auth");
const {
  createUser,
  access,
  closeSession,
  closeAllSessions,
} = require("./controllers/user");
const { getCoins, assignCoins, userCoins } = require("./controllers/coins");
const signUpSchema = require("./schemas/user-signup");
const assignSchema = require("./schemas/coin-assign");

const router = new express.Router();

router.post("/users", validatorBySchema(signUpSchema), createUser);
router.post("/users/login", access);

router.use(auth);

router.get("/cryptocoins", getCoins);
router.post(
  "/cryptocoins/assign",
  validatorBySchema(assignSchema),
  assignCoins
);
router.get("/cryptocoins/list", userCoins);

router.post("/users/logout", closeSession);
router.post("/users/logoutAll", closeAllSessions);

module.exports = router;
