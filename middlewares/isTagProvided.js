//check if tag is provided. if not, send 400 status code.
module.exports = (req, res, next) => {
  if (req.query.tag) next();
  else res.status(400).send({ error: "Tags parameters is required" });
};
