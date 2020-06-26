const express = require("express");
const app = express();
const blogposts = require("./API/blogposts");
//get env port if running on external server outside of localhost.
const port = process.env.PORT || 3000;
//isTagProvided is a middleware to check if tag is provided, if not, send 400 status code.
const isTagProvided = require("./middlewares/isTagProvided");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.get("/api/ping", async (req, res) => {
  //check status code and send it
  res.statusCode
    ? 200(res.status(res.statusCode).send({ success: "true" }))
    : res.status(res.statusCode).send({ success: "false" });
});

app.get("/api/posts", isTagProvided, (req, res) => {
  //get tag query and split it to an array
  const tags = req.query.tag.split(",");
  //get sortBy query if provided
  const sortBy = req.query.sortBy || "id";
  console.log(typeof sortBy);
  //get direction if provided
  const direction = req.query.direction || "asc";
  try {
    var arr = [];

    var promises = tags.map(async (tag) => {
      console.log("fetch");
      const response = await blogposts.get("/", {
        params: {
          tag: tag,
        },
      });
      arr.concat(response.data.posts);
      return response.data.posts;
    });
    Promise.all(promises).then(async function (results) {
      var arr = [];
      results.map((result) => {
        arr = [...arr, result];
      });
      var blogposts = arr[0];
      // check soryBy is valid
      if (
        sortBy != "reads" &&
        sortBy != "likes" &&
        sortBy != "popularity" &&
        sortBy != "id"
      ) {
        res.status(400).send({ error: "sortBy parameter is invalid" });
      } else {
        //sort the array
        switch (direction) {
          case "asc":
            blogposts.sort(function (a, b) {
              return a[`${sortBy}`] - b[`${sortBy}`];
            });
            break;
          case "desc":
            blogposts.sort(function (a, b) {
              return b[`${sortBy}`] - a[`${sortBy}`];
            });
            break;
          default:
            res.status(400).send({ error: "Direction parameter is invalid" });
        }
      }
      //send sorted blogposts
      res.send({ posts: blogposts });
    });
  } catch (err) {
    res.send(err.message);
  }
});

app.listen(port, () => console.log(`Running on port ${port}`));
