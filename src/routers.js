const express = require("express");

const validatorBySchema = require("./middleware/validation");
const auth = require("./middleware/auth");
const { createUser, access } = require("./controllers/user");
const { getCoins } = require("./controllers/coins");
const signUpSchema = require("./schemas/user-signup");

const router = new express.Router();

router.post("/users", validatorBySchema(signUpSchema), createUser);
router.post("/users/login", access);

router.use(auth);
router.get("/cryptocoins", getCoins);

module.exports = router;
