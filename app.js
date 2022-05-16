const { getTopics } = require("./controllers/topics.controller.js");
const { getArticleById } = require("./controllers/articles.controller.js");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

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
  console.log(err.code);
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
