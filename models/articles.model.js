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
