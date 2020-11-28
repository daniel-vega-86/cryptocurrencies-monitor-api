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
};

module.exports = {
  codes,
  messages,
};
