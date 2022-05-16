const { getTopics } = require("./controllers/topics.controller.js");
const express = require("express");
const res = require("express/lib/response");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/*", (req, res, next) => {
  res.status(404).send({ message: "URL not recognised" });
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
