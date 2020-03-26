const jwt = require("jsonwebtoken");
const { loginUser } = require("../models/loginModel");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");

exports.postUser = (req, res, next) => {
  const { username, password } = req.body;

  loginUser(username)
    .then(user => {
      if (user === undefined) {
        return Promise.reject({
          status: 401,
          message: "invalid username or password"
        });
      } else {
        return Promise.all([user, bcrypt.compare(password, user.password)]);
      }
    })
    .then(([user, passwordIsValid]) => {
      if (!passwordIsValid) {
        return Promise.reject({
          status: 401,
          message: "invalid username or password"
        });
      } else {
        const token = jwt.sign(
          {
            username: user.username,
            iat: Date.now()
          },
          JWT_SECRET
        );
        res.status(200).send({ token });
      }
    })

    .catch(next);
};

exports.validateUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return Promise.reject({
      status: 401,
      message: "UNAUTHORIZED this is a secure area!! Please login"
    }).catch(next);
  } else {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        next({ status: 401, message: "UNAUTHORIZED!!" });
      } else {
        req.user = payload;
        next();
      }
    });
  }
};
