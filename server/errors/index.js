exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  const psqlCodes = {
    "42703": { status: 400, message: "invalid query value" },
    "23503": {
      status: 422,
      message: "request field can not be processed"
    },
    "22P02": { status: 400, message: "invalid user input" }
  };

  console.log(err.code);
  if (psqlCodes[err.code]) {
    const { status, message } = psqlCodes[err.code];
    res.status(status).send({ message });
  } else {
    next(err);
  }
};

exports.otherErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500);
};
