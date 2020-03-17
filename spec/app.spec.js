const client = require("../db/connection");
const app = require("../server/app");
const request = require("supertest");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const chai = require("chai");

chai.use(chaiSorted);

describe("/api", () => {
  after(() => {
    client.destroy();
  });

  beforeEach(() => {
    return client.seed.run();
  });

  describe("/articles", () => {
    it("GET response returns array of articles with all field s ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(articles.body).to;
        });
    });
  });
  describe("/topics", () => {
    it("GET response - an array of topic objects with slug, description ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body).to.contain.keys("topics");
          expect(res.body.topics).to.be.a("array");
          expect(res.body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("Non supported method request returns a 405", () => {
      const invalidMethods = ["put", "patch"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/comments", () => {
    it("GET response ", () => {
      return request(app)
        .get("/api/comments")
        .expect(200)
        .then(res => {});
    });
  });
  describe.only("/users", () => {
    it("GET response for a user ID returns an object with username, avatar url and name ", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(res => {
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name"
          );
          expect(res.body.user.username).to.equal("lurker");
        });
    });
    it("GET response is 404 when username not found", () => {
      return request(app)
        .get("/api/users/not_a_real_user")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.eql("username not found");
        });
    });
    it("Non supported method request returns a 405", () => {
      const invalidMethods = ["put", "patch"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/lurker")
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
  });
});
