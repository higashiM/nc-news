const {
  fetchAllArticles,
  fetchOneArticle,
  patchOneArticle,
  addCommentToArticle,
  fetchCommentsFromArticle
} = require("../models/articlesModel");

exports.getArticles = () => {
  fetchAllArticles();
  console.log("reached the articles controller!");
};

exports.getArticle_id = () => {
  fetchOneArticle();
  console.log("reached the articles controller!");
};
exports.patchArticle_id = () => {
  patchOneArticle();
  console.log("reached the articles controller!");
};

exports.postArticleComments = () => {
  addCommentToArticle();
  console.log("reached the articles controller!");
};

exports.getArticleComments = () => {
  fetchCommentsFromArticle();
  console.log("reached the articles controller!");
};
