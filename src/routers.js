const express = require("express");

const { createUser } = require("./controllers/user");
const router = new express.Router();

router.post("/users", createUser);

module.exports = router;
