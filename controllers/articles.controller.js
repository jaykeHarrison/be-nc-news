const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/articles.model.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [
    fetchCommentsByArticleId(article_id),
    fetchArticleById(article_id),
  ];

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const promises = [
    fetchArticleById(article_id),
    insertCommentByArticleId(article_id, username, body),
  ];

  Promise.all(promises)
    .then(([article_id, addedComment]) => {
      res.status(201).send({ addedComment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        next({ status: 404, message: "User by that username not found" });
      } else {
        next(err);
      }
    });
};
