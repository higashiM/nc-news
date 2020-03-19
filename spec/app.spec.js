const client = require("../db/connection");
const app = require("../server/app");
const request = require("supertest");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const chai = require("chai");

chai.use(chaiSorted);

const satisfyAll = (array, key, value) => {
  //used to check key '===' value for all objects in an array
  let condition = true;
  array.forEach(items => {
    if (items[key] !== value) condition = false;
  });
  return condition;
};

describe("/api", () => {
  after(() => {
    client.destroy();
  });

  beforeEach(() => {
    return client.seed.run();
  });

  it("GET response returns a JSON object describing the paths", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(res => expect(res.body.endPoints).to.be.a("object"));
  });

  describe("/articles", () => {
    it("GET response returns array of articles with all fields default sorted by created_at desc and limited to 10", () => {
      return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.a("array");
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
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

    it("GET response returns a total count of articles ignoring limit", () => {
      return request(app)
        .get("/api/articles?limit=10&sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(10);
        });
    });
    it("GET response returns a second page of results using default limit and total count is unchanged", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(res => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(2);
        });
    });
    it("GET response returns a third page of results using customlimit and total count is unchanged", () => {
      return request(app)
        .get("/api/articles?p=3&limit=4")
        .expect(200)
        .then(res => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(4);
        });
    });
    it("GET response returns 404 if page requested exceeds limit", () => {
      return request(app)
        .get("/api/articles?p=99999")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("Invalid query value");
        });
    });

    it("GET response returns array sorted by requested field in asc order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.sortedBy("votes", {
            ascending: true
          });
        });
    });
    it("GET response returns array filtered by the author specified", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.satisfy(function(articles) {
            return satisfyAll(articles, "author", "rogersop");
          });
        });
    });
    it("GET response returns array filtered by the topic specified", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.satisfy(function(articles) {
            return satisfyAll(articles, "topic", "cats");
          });
        });
    });
    it("GET response returns a 404 when query value is not found", () => {
      return request(app)
        .get("/api/articles?author=cats")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("author 'cats' not found");
        });
    });
    it("GET response returns a 422 when query value is syntactically correct but cannot be processed", () => {
      return request(app)
        .get("/api/articles?article_topic=cats")
        .expect(422)
        .then(res => {
          expect(res.body.message).to.equal("query field can not be processed");
        });
    });
  });
  describe("/articles/article_id", () => {
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
          expect(res.body.message).to.eql("article_id 99999 not found");
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
          expect(res.body.message).to.eql("article_id 99999 not found");
        });
    });
    it("PATCH response returns a 422 when query value is syntactically correct but cannot be processed", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ add_votes: 1 })
        .expect(422)
        .then(res => {
          expect(res.body.message).to.eql("request field can not be processed");
        });
    });
  });
  describe.only("/articles/:article_id/comments", () => {
    it("POST request responds with 201 and posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "lurker", body: "soooooooo eye gougingly BORING!!" })
        .expect(201)
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
    it("POST response returns a 422 when query value is syntactically correct but cannot be processed", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          comments_username: "lurker",
          body: "soooooooo eye gougingly BORING!!"
        })
        .expect(422)
        .then(res => {
          expect(res.body.message).to.eql("request field can not be processed");
        });
    });
    it("POST response returns a 422 when required field is null", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          comments_username: "lurker",
          body: null
        })
        .expect(422)
        .then(res => {
          expect(res.body.message).to.eql("request field can not be processed");
        });
    });
    it("POST response returns a 422 when username is not found", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurkers",
          body: "soooooooo eye gougingly BORING!!"
        })
        .expect(422)
        .then(res => {
          expect(res.body.message).to.eql("request field can not be processed");
        });
    });

    it("GET request responds with 200 and array of comments defaulted tp sorted by created at desc", () => {
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
          expect(res.body.comments).to.satisfy(function(comments) {
            return satisfyAll(comments, "article_id", 1);
          });

          expect(res.body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET request responds with 200 and array of comments sorted by votes asc", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.sortedBy("votes", {
            ascending: true
          });
        });
    });
    it("GET response is 400 when query value is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=not_a_column&order=asc")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("invalid query value");
        });
    });
    it("GET response is 404 when article id not found", () => {
      return request(app)
        .get("/api/articles/999999/comments?sort_by=votes&order=asc")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("article_id 999999 not found");
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
    describe("/comments/:comment_id", () => {
      it("PATCH request increments comment votes and responds with 200 and updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 84 })
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(100);
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
      it("PATCH request responds with 400 when invalid update value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "loadsavotes" })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });
      it("PATCH request responds with 400 when invalid article_id in request", () => {
        return request(app)
          .patch("/api/comments/not_a_valid_id")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });
      it("PATCH request responds with 404 when article id does not exist", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(res => {
            expect(res.body.message).to.eql("comment_id 99999 not found");
          });
      });
      it("DELETE request responds with 204 and no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(res => {});
      });
      it("DELETE request responds with 404 when article id does not exist", () => {
        return request(app)
          .delete("/api/comments/99999")
          .expect(404)
          .then(res => {
            expect(res.body.message).to.eql("comment_id 99999 not found");
          });
      });
      it("DELETE request responds with 400 when invalid article_id in request", () => {
        return request(app)
          .delete("/api/comments/not_a_valid_id")
          .expect(400)
          .then(res => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });
      it("Non supported method request returns a 405", () => {
        const invalidMethods = ["put", "get"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/1")
            .expect(405);
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/iamateapot", () => {
    it("GET response returns a 418", () => {
      return request(app)
        .get("/api/iamateapot")
        .expect(418)
        .then(res => {
          expect(res.body.message).to.equal("we are all teapots");
        });
    });
  });

  describe("/", () => {
    it("GET response to / redirects to /api with a 302", () => {
      return request(app)
        .get("/")
        .expect(302)
        .then(res => expect(res.header.location).to.be.equal("/api"));
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
