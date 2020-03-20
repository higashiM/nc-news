const { fetchTopics, addTopic } = require("../models/topicsModel");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  addTopic(req.body)
    .then(topics => {
      let topic = topics[0];
      res.status(201).send({ topic });
    })
    .catch(next);
};
