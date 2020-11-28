require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const router = require("./routers");
const openApiDoc = require("../docs");

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.use(router);

module.exports = app;
