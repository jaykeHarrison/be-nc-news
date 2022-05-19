const apiDocs = require("../endpoints.json");

exports.getApiDocs = (req, res, next) => {
  res.status(200).send(apiDocs);
};
