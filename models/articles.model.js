const db = require("../db/connection.js");
const { fetchTopics } = require("./topics.model.js");

exports.fetchArticles = (topic, sortBy = "created_at", order = "DESC") => {
  const sortByGreenList = ["title", "topic", "author", "created_at", "votes"];
  const orderGreenList = ["ASC", "DESC"];
  const topicGreenList = fetchTopics();

  order = order.toUpperCase();

  let queryString = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  return Promise.all([topicGreenList]).then(([fetchedTopics]) => {
    const validTopics = fetchedTopics.map((topic) => topic.slug);

    if (topic === undefined) {
      queryString += ` GROUP BY articles.article_id`;
    } else if (validTopics.includes(topic)) {
      queryString += ` WHERE articles.topic = '${topic}'
      GROUP BY articles.article_id`;
    } else {
      return Promise.reject({
        status: 400,
        message: "Bad request: invalid topic",
      });
    }
    if (sortByGreenList.includes(sortBy)) {
      queryString += ` ORDER BY ${sortBy}`;
    } else {
      return Promise.reject({
        status: 400,
        message: "Bad request: invalid sort_by",
      });
    }

    if (orderGreenList.includes(order)) {
      queryString += ` ${order}`;
    } else {
      return Promise.reject({
        status: 400,
        message: "Bad request: invalid order",
      });
    }

    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
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

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      return rows;
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

exports.insertCommentByArticleId = (articleId, username, body) => {
  if (
    username === undefined ||
    body === undefined ||
    typeof body !== "string" ||
    typeof username !== "string"
  ) {
    return Promise.reject({
      status: 400,
      message: "Bad request: request body invalid",
    });
  }

  return db
    .query(
      `
      INSERT INTO comments (body, votes, author, article_id)
      VALUES ($1, 0, $2, $3)
      RETURNING *;`,
      [body, username, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
