const { checkSchema, validationResult } = require("express-validator");
const { codes } = require("../../config/dictionary");

const verifySchema = (schema) => checkSchema(schema);

const validateSchema = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(codes.conflict).send(err.mapped());
  } else {
    next();
  }
};

const validatorBySchema = (schema) => [verifySchema(schema), validateSchema];

module.exports = validatorBySchema;
