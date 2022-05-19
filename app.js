const { getTopics } = require("./controllers/topics.controller.js");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controller.js");
const { getUsers } = require("./controllers/users.controller.js");
const { deleteCommentById } = require("./controllers/comments.controller.js");
const { getApiDocs } = require("./controllers/api.controller.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api", getApiDocs);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.get("/api/*", (req, res, next) => {
  res.status(404).send({ message: "URL not recognised" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  const { status, message } = err;
  if (status === 404 || status === 400) {
    res.status(status).send({ message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
