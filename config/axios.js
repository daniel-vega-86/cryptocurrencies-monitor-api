const axios = require("axios");

const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});

module.exports = api;
