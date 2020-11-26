const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Token = require("../models/token");

const signUp = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.create(body);
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

const login = ({ username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByCredential(username, password);
      const time = process.env.EXPIRATION_TIME || "30 second";
      const token = jwt.sign(
        { id: user.id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: time }
      );
      await Token.create({ userId: user.id, token: token });
      resolve({
        user,
        token,
        message: `Session expires in ${time}`,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  signUp,
  login,
};
