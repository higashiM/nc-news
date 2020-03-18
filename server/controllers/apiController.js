const { fetchEndPoints } = require("../models/apiModel");
exports.getEndPoints = (req, res, next) => {
  fetchEndPoints().then(endPoints => res.send({ endPoints }));
};
