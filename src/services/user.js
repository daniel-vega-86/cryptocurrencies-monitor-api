const jwt = require("jsonwebtoken");

const User = require("../models/user");

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
  const time = 20;
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByCredential(username, password);
      const token = jwt.sign(
        { id: user.id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: time }
      );
      resolve({
        user,
        token,
        message: `Session expires in ${time} seconds`,
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
