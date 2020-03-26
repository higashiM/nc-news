exports.secureArea = (req, res, next) => {
  res.status(200).send({ message: "welcome to the secure area" });
};
