exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  const psqlCodes = {
    /*     "42703": { status: 400, message: err.message },
    "23502": { status: 400, message: err.message },
    "23503": { status: 404, message: err.message },
    "22P02": { status: 400, message: err.message } */
  };
  if (psqlCodes[err.code]) {
    const { status, message } = psqlCodes[err.code];
    res.status(status).send({ message });
  } else {
    next(err);
  }
};
