const { codes, messages } = require("../../config/dictionary");
const { listCoins } = require("../services/coins");

const getCoins = async (req, res) => {
  const { preferedCurrency } = req.user;
  try {
    const data = await listCoins(preferedCurrency);
    res.status(codes.ok).send(data);
  } catch (e) {
    res.status(codes.badRequest).send(e);
    console.log(e);
  }
};

module.exports = { getCoins };
