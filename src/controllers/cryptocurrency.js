const { codes } = require("../../config/dictionary");
const {
  listCryptocurrencies,
  selectCryptocurrencies,
  listUserCryptocurrencies,
  userCryptocurrency,
  deleteCryptocurrency,
} = require("../services/cryptocurrency");

const getCryptocurrencies = async (req, res) => {
  const { preferedCurrency } = req.user;
  try {
    const data = await listCryptocurrencies(preferedCurrency);
    res.status(codes.ok).send(data);
  } catch (e) {
    res.status(codes.badRequest).send(e);
    console.info(e);
  }
};

const assignCryptocurrency = async (req, res) => {
  const { user, body } = req;
  try {
    const coin = await selectCryptocurrencies(user, body.id);
    res.status(codes.ok).send(coin);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

const userCryptocurrencies = async (req, res) => {
  try {
    const data = await listUserCryptocurrencies(req);
    res.status(codes.ok).send(data);
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

const getUserCryptocurrency = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  try {
    const data = await userCryptocurrency(user, id);
    res.status(codes.ok).send(data);
  } catch (e) {
    res.status(codes.notFound).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

const deleteAssignedCurrency = async (req, res) => {
  const { id: userId } = req.user;
  const { id: cryptocurrencyId } = req.params;
  try {
    await deleteCryptocurrency(userId, cryptocurrencyId);
    res.status(codes.noContent).send();
  } catch (e) {
    res.status(codes.badRequest).send({ error: e.message });
    console.info("Error: ", e.message);
  }
};

module.exports = {
  getCryptocurrencies,
  assignCryptocurrency,
  userCryptocurrencies,
  getUserCryptocurrency,
  deleteAssignedCurrency,
};
