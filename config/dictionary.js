const codes = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbiden: 403,
  notFound: 404,
  conflict: 409,
};

const messages = {
  emptyField: (field) => `${field} cannot be empty`,
  usernameInUse: "Username is already registered.",
  lenPass: "Password must have at least 8 characters.",
  alphaPass: "Password must be alphanumeric.",
  unauthorized: "Please login to access this module.",
  forbiden: "You have no access to this module.",
  invalidCurrency:
    "Invalid currency, please select one between USD, EUR and ARS.",
  invalidUser: "User not found.",
  invalidPass: "Unable to login.",
  assignedCoin: "You had already assigned this cryptocurrency.",
  invalidCoin: "Cryptocurrency not found.",
};

module.exports = {
  codes,
  messages,
};
