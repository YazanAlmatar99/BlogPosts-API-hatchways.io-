const axios = require("axios");
module.exports = axios.create({
  baseURL: "https://hatchways.io/api/assessment/blog/posts",
});
