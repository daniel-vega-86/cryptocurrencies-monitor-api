const express = require("express");

const validatorBySchema = require("./middleware/validation");
const auth = require("./middleware/auth");
const {
  createUser,
  access,
  closeSession,
  closeAllSessions,
  readProfile,
  modifyProfile,
  deleteProfile,
} = require("./controllers/user");
const {
  getCryptocurrencies,
  assignCryptocurrency,
  userCryptocurrencies,
  getUserCryptocurrency,
  deleteAssignedCurrency,
} = require("./controllers/cryptocurrency");
const signUpSchema = require("./schemas/user-signup");
const assignSchema = require("./schemas/cryptocurrency-assign");
const modifyUserSchema = require("./schemas/modify-user");

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
router.delete("/cryptocurrencies/assign/:id", deleteAssignedCurrency);
router.get("/cryptocurrencies/list", userCryptocurrencies);
router.get("/cryptocurrencies/list/:id", getUserCryptocurrency);

router.delete("/users/logout", closeSession);
router.delete("/users/logoutAll", closeAllSessions);
router.get("/users/me", readProfile);
router.patch("/users/me", validatorBySchema(modifyUserSchema), modifyProfile);
router.delete("/users/me", deleteProfile);

module.exports = router;
