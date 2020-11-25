const express = require("express");

const validatorBySchema = require("./middleware/validation");
const { createUser } = require("./controllers/user");
const signUpSchema = require("./schemas/user-signup");

const router = new express.Router();

router.post("/users", validatorBySchema(signUpSchema), createUser);

module.exports = router;
