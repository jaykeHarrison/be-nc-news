const db = require("../db/connection.js");

exports.fetchArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
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
