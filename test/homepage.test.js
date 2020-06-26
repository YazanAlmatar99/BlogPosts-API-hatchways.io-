const request = require("supertest");
const app = require("../index");

describe("homepage", function () {
  it("fetches blog posts", function (done) {
    request(app).get("/api/ping").expect(200);
  });
});
