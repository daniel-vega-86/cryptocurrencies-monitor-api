const express = require("express");

const validatorBySchema = require("./middleware/validation");
const { createUser, access } = require("./controllers/user");
const signUpSchema = require("./schemas/user-signup");

const router = new express.Router();

router.post("/users", validatorBySchema(signUpSchema), createUser);
router.post("/users/login", access);

module.exports = router;
