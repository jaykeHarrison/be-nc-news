const {
  fetchArticleById,
  updateArticleById,
} = require("../models/articles.model.js");

exports.getArticleById = (req, res, next) => {
  ({ article_id } = req.params);

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  ({ article_id } = req.params);

  ({ inc_votes } = req.body);

  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
