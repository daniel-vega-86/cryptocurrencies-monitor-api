const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});

module.exports = api;
