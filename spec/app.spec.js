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
    it("GET response returns array of articles with all fields ", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.a("array");
          expect(res.body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET response with article ID returns one article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(res => {
          expect(res.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET response is 404 when article_id not found", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.eql("article_id not found");
        });
    });
    it("GET response is 400 when article_id invalid", () => {
      return request(app)
        .get("/api/articles/not_a_valid_id")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.eql("invalid user input");
        });
    });
    it("PATCH response is 200 and returns updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(res => {
          expect(res.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(res.body.article.votes).to.equal(101);
        });
    });
    it("PATCH response is 200 and returns updated article with positive votes incremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(res => {
          expect(res.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(res.body.article.votes).to.equal(101);
        });
    });
    it("PATCH response is 200 and returns updated article with negative votes decremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(50);
        });
    });
    it("PATCH request responds with 400 when invalid update value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "loadsavotes" })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.eql("invalid user input");
        });
    });
    it("PATCH request responds with 400 when invalid article_id in request", () => {
      return request(app)
        .patch("/api/articles/not_a_valid_id")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.eql("invalid user input");
        });
    });
    it("PATCH request responds with 404 when article id does not exist", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(res => {
          expect(res.body.message).to.eql("article_id not found");
        });
    });
  });

  describe.only("/articles/:article_id/comments", () => {
    it("POST request responds with 200 and posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "lurker", body: "soooooooo eye gougingly BORING!!" })
        .expect(200)
        .then(res => {
          expect(res.body.comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "created_at",
            "body",
            "votes"
          );
        });
    });
    it("GET request responds with 200 and array of comments", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments[0]).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "created_at",
            "body",
            "votes"
          );
          expect(res.body.comments[0].article_id).to.equal(1);
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
  describe("/users", () => {
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
