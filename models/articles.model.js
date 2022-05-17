const db = require("../db/connection.js");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [articleId]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article by that ID not found",
        });
      }
      return response.rows[0];
    });
};

exports.updateArticleById = (articleId, increaseVotesBy) => {
  if (!increaseVotesBy || typeof increaseVotesBy !== "number") {
    return Promise.reject({
      status: 400,
      message: "Bad request: request body of invalid format",
    });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [increaseVotesBy, articleId]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article by that ID not found",
        });
      }
      return response.rows[0];
    });
};
