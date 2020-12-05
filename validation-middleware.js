const { ValidationError } = require('express-validation')

function handleValidationError(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(err.status).send({ status: "Bad request" });
  } else {
    next()
  }
}

module.exports = handleValidationError

