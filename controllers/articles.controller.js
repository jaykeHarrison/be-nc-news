const {
  fetchArticleById,
  updateArticleById,
} = require("../models/articles.model.js");

exports.getArticleById = (req, res, next) => {
  articleId = req.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  articleId = req.params.article_id;

  increaseVotesBy = req.body.inc_votes;

  updateArticleById(articleId, increaseVotesBy)
    .then((updatedArticle) => {
      res.status(201).send({ updatedArticle });
    })
    .catch(next);
};
