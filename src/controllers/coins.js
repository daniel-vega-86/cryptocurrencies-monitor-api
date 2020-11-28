const { codes } = require("../../config/dictionary");
const { listCoins, selectCoins } = require("../services/coins");

const getCoins = async (req, res) => {
  const { preferedCurrency } = req.user;
  try {
    const data = await listCoins(preferedCurrency);
    res.status(codes.ok).send(data);
  } catch (e) {
    res.status(codes.badRequest).send(e);
    console.info(e);
  }
};

const assignCoins = async (req, res) => {
  const { user, body } = req;
  try {
    const coin = await selectCoins(user, body.id);
    res.status(codes.ok).send(coin);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

module.exports = { getCoins, assignCoins };
