const defaults = require("superagent-defaults");
const app = require("../server/app");
const request = defaults(require("supertest")(app));
const client = require("../db/connection");
const { expect } = require("chai");
const chaiSorted = require("chai-sorted");
const chai = require("chai");

chai.use(chaiSorted);

const satisfyAll = (array, key, value) => {
  //used to check key '===' value for all objects in an array
  let condition = true;
  array.forEach((items) => {
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
    return request
      .get("/api")
      .expect(200)
      .then((res) => expect(res.body.endPoints).to.be.a("object"));
  });

  describe("/login", () => {
    it("POST response for valid user and password return a 200", () => {
      return request
        .post("/api/login")
        .set("authorization", ``)
        .send({ username: "rogersop", password: "password" })
        .expect(200)
        .then((res) => {
          expect(res.body.token);
        });
    });
    it("POST response for invalid password return a 401", () => {
      return request
        .post("/api/login")
        .set("authorization", ``)
        .send({ username: "rogersop", password: "not_a_password" })
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal("invalid username or password");
        });
    });
    it("POST response for invalid userreturn a 401", () => {
      return request
        .post("/api/login")
        .set("authorization", ``)
        .send({ username: "rogersops", password: "not_a_password" })
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal("invalid username or password");
        });
    });
  });
  describe("/secure", () => {
    beforeEach(() => {
      return request
        .post("/api/login")
        .expect(200)
        .send({ username: "rogersop", password: "password" })
        .then(({ body: { token } }) => {
          request.set("authorization", `BEARER ${token}`);
        });
    });

    it("Get request with authorization returns a welcome meesage", () => {
      return request
        .get("/api/secure")
        .expect(200)
        .then((res) => {
          expect(res.body.message).to.equal("welcome to the secure area");
        });
    });

    it("Get request with authorization returns an unauthorised message", () => {
      return request
        .set("authorization", ``)
        .get("/api/secure")
        .expect(401)
        .then((res) => {
          expect(res.body.message).to.equal(
            "UNAUTHORIZED this is a secure area!! Please login"
          );
        });
    });
  });

  describe("/articles", () => {
    it("GET response returns array of articles with all fields default sorted by created_at desc and limited to 10", () => {
      return request
        .get("/api/articles/")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.be.a("array");
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true,
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
      return request
        .get("/api/articles?limit=10&sort_by=votes&order=asc")
        .expect(200)
        .then((res) => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(10);
        });
    });
    it("GET response returns a second page of results using default limit and total count is unchanged", () => {
      return request
        .get("/api/articles?p=2")
        .expect(200)
        .then((res) => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(2);
        });
    });
    it("GET response returns a third page of results using customlimit and total count is unchanged", () => {
      return request
        .get("/api/articles?p=3&limit=4")
        .expect(200)
        .then((res) => {
          expect(Number(res.body.total_count)).to.equal(12);
          expect(res.body.articles.length).to.equal(4);
        });
    });
    it("GET response returns 404 if page requested exceeds limit", () => {
      return request
        .get("/api/articles?p=99999")
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal("Invalid query value");
        });
    });

    it("GET response returns array sorted by requested field in asc order", () => {
      return request
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.be.sortedBy("votes", {
            ascending: true,
          });
        });
    });
    it("GET response returns array filtered by the author specified", () => {
      return request
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.satisfy(function (articles) {
            return satisfyAll(articles, "author", "rogersop");
          });
        });
    });
    it("GET response returns array filtered by the topic specified", () => {
      return request
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.satisfy(function (articles) {
            return satisfyAll(articles, "topic", "cats");
          });
        });
    });
    it("GET response returns a 404 when query value is not found", () => {
      return request
        .get("/api/articles?author=cats")
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.equal("author 'cats' not found");
        });
    });
    it("GET response returns a 400 when query value is using unknown parameters", () => {
      return request
        .get("/api/articles?article_topic=cats")
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal("required fields not provided");
        });
    });
    it("POST response returns a 201 with the newly created article", () => {
      return request
        .post("/api/articles")
        .send({
          author: "rogersop",
          title: "eating catfood to stay alive",
          body: "the last tins left on the asda shelf....",
          topic: "cats",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("POST response returns a 400 if the required article fields are not in the correct format", () => {
      return request
        .post("/api/articles")
        .send({
          author_name: "rogersop",
          title: "eating catfood to stay alive",
          body: "the last tins left on the asda shelf....",
          topic: "cats",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal("required fields not provided");
        });
    });

    describe("/articles/article_id", () => {
      it("GET response with article ID returns one article object", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(res.body.article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("GET response is 404 when article_id not found", () => {
        return request
          .get("/api/articles/99999")
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql("article_id 99999 not found");
          });
      });
      it("GET response is 400 when article_id invalid", () => {
        return request
          .get("/api/articles/not_a_valid_id")
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });

      it("PATCH response is 200 and returns updated article with positive votes incremented", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then((res) => {
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
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: -50 })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).to.equal(50);
          });
      });
      it("PATCH request responds with 400 when invalid update value", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "loadsavotes" })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });
      it("PATCH request responds with 400 when invalid article_id in request", () => {
        return request
          .patch("/api/articles/not_a_valid_id")
          .send({ inc_votes: 1 })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("invalid user input");
          });
      });
      it("PATCH request responds with 404 when article id does not exist", () => {
        return request
          .patch("/api/articles/99999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql("article_id 99999 not found");
          });
      });
      it("PATCH response returns a 400 when query parameter is incorrect", () => {
        return request
          .patch("/api/articles/1")
          .send({ add_votes: 1 })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("required fields not provided");
          });
      });
      it("DELETE  request returns a 204 and deletes the article and linked comments returning a 404 when a get is attempted", () => {
        return request
          .delete("/api/articles/1")
          .expect(204)
          .then((res) => {
            return request
              .get("/api/articles/1")
              .expect(404)
              .then((res) => {
                expect(res.body.message).to.eql("article_id 1 not found");
              });
          });
      });
      it("DELETE request responds with 404 when article id does not exist", () => {
        return request
          .delete("/api/articles/99999")
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.eql("article_id 99999 not found");
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("POST request responds with 201 and posted comment", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "lurker",
            body: "soooooooo eye gougingly BORING!!",
          })
          .expect(201)
          .then((res) => {
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
      it("POST response returns a 400 when field is not correctly named", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            comments_username: "lurker",
            body: "soooooooo eye gougingly BORING!!",
          })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("required fields not provided");
          });
      });
      it("POST response returns a 400 when required field is null", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            comments_username: "lurker",
            body: null,
          })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("required fields not provided");
          });
      });
      it("POST response returns a 422 when username is not found", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "lurkers",
            body: "soooooooo eye gougingly BORING!!",
          })
          .expect(422)
          .then((res) => {
            expect(res.body.message).to.eql(
              "request field can not be processed"
            );
          });
      });

      it("GET request responds with 200 and array of comments defaulted tp sorted by created at desc", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0]).to.contain.keys(
              "comment_id",
              "author",
              "article_id",
              "created_at",
              "body",
              "votes"
            );
            expect(res.body.comments).to.satisfy(function (comments) {
              return satisfyAll(comments, "article_id", 1);
            });

            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("GET request responds with 200 and array of comments sorted by votes asc", () => {
        return request
          .get("/api/articles/1/comments?sort_by=votes&order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).to.be.sortedBy("votes", {
              ascending: true,
            });
          });
      });
      it("GET response is 400 when query value is invalid", () => {
        return request
          .get("/api/articles/1/comments?sort_by=not_a_column&order=asc")
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.equal("invalid query value");
          });
      });
      it("GET response is 404 when article id not found", () => {
        return request
          .get("/api/articles/999999/comments?sort_by=votes&order=asc")
          .expect(404)
          .then((res) => {
            expect(res.body.message).to.equal("article_id 999999 not found");
          });
      });
    });

    describe("/topics", () => {
      it("GET response - an array of topic objects with slug, description ", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body).to.contain.keys("topics");
            expect(res.body.topics).to.be.a("array");
            expect(res.body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("Non supported method request returns a 405", () => {
        const invalidMethods = ["put", "patch"];
        const methodPromises = invalidMethods.map((method) => {
          return request[method]("/api/topics").expect(405);
        });
        return Promise.all(methodPromises);
      });
      it("POST request returns a 201 and the new topic", () => {
        return request
          .post("/api/topics")
          .send({ slug: "slug", description: "description" })
          .expect(201)
          .then((res) => {
            expect(res.body.topic).to.eql({
              slug: "slug",
              description: "description",
            });
          });
      });
      it("POST request with null fields returns a 400", () => {
        return request
          .post("/api/topics")
          .send({ slug: "slug" })
          .expect(400)
          .then((res) => {
            expect(res.body.message).to.eql("required fields not provided");
          });
      });
    });
    describe("/comments", () => {
      describe("/comments/:comment_id", () => {
        it("PATCH request increments comment votes and responds with 200 and updated comment", () => {
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: 84 })
            .expect(200)
            .then((res) => {
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
          return request
            .patch("/api/comments/1")
            .send({ inc_votes: "loadsavotes" })
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql("invalid user input");
            });
        });
        it("PATCH request responds with 400 when invalid article_id in request", () => {
          return request
            .patch("/api/comments/not_a_valid_id")
            .send({ inc_votes: 1 })
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql("invalid user input");
            });
        });
        it("PATCH request responds with 404 when article id does not exist", () => {
          return request
            .patch("/api/comments/99999")
            .send({ inc_votes: 1 })
            .expect(404)
            .then((res) => {
              expect(res.body.message).to.eql("comment_id 99999 not found");
            });
        });
        it("DELETE request responds with 204 and no content", () => {
          return request
            .delete("/api/comments/1")
            .expect(204)
            .then((res) => {});
        });
        it("DELETE request responds with 404 when article id does not exist", () => {
          return request
            .delete("/api/comments/99999")
            .expect(404)
            .then((res) => {
              expect(res.body.message).to.eql("comment_id 99999 not found");
            });
        });
        it("DELETE request responds with 400 when invalid article_id in request", () => {
          return request
            .delete("/api/comments/not_a_valid_id")
            .expect(400)
            .then((res) => {
              expect(res.body.message).to.eql("invalid user input");
            });
        });
        it("Non supported method request returns a 405", () => {
          const invalidMethods = ["put", "get"];
          const methodPromises = invalidMethods.map((method) => {
            return request[method]("/api/comments/1").expect(405);
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/iamateapot", () => {
      it("GET response returns a 418", () => {
        return request
          .get("/api/iamateapot")
          .expect(418)
          .then((res) => {
            expect(res.body.message).to.equal("we are all teapots");
          });
      });
    });

    describe("/", () => {
      it("GET response to / redirects to /api with a 302", () => {
        return request
          .get("/")
          .expect(302)
          .then((res) => expect(res.header.location).to.be.equal("/api"));
      });
    });
  });

  describe("/users", () => {
    it("GET response for users return an array of users with username, avatar url and name ", () => {
      return request
        .get("/api/users/")
        .expect(200)
        .then((res) => {
          expect(res.body.users[0]).to.contain.keys(
            "username",
            "avatar_url",
            "name",
            "password"
          );
        });
    });
    it("POST request for user returns 201 with newly created user", () => {
      return request
        .post("/api/users/")
        .send({
          username: "username",
          avatar_url: "avatar_url",
          name: "name",
          password: "password",
        })
        .expect(201)
        .then((res) => {
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name",
            "password"
          );
        });
    });
    it("POST request for user returns 400 if required fields are missing", () => {
      return request
        .post("/api/users/")
        .send({
          username: "username",
          avatar_url: "avatar_url",
          password: "password",
        })
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.eql("invalid user input");
        });
    });
    it("POST request for user returns 422 if username is already in use", () => {
      return request
        .post("/api/users/")
        .send({
          username: "rogersop",
          avatar_url: "avatar_url",
          name: "roger sop",
          password: "password",
        })
        .expect(422)
        .then((res) => {
          expect(res.body.message).to.eql("request field can not be processed");
        });
    });

    it("GET response for a user ID returns an object with username, avatar url and name ", () => {
      return request
        .get("/api/users/lurker")
        .expect(200)
        .then((res) => {
          expect(res.body.user).to.contain.keys(
            "username",
            "avatar_url",
            "name",
            "password"
          );
          expect(res.body.user.username).to.equal("lurker");
        });
    });
    it("GET response is 404 when username not found", () => {
      return request
        .get("/api/users/not_a_real_user")
        .expect(404)
        .then((res) => {
          expect(res.body.message).to.eql("username not found");
        });
    });
    it("Non supported method request returns a 405", () => {
      const invalidMethods = ["put", "patch"];
      const methodPromises = invalidMethods.map((method) => {
        return request[method]("/api/users/lurker").expect(405);
      });
      return Promise.all(methodPromises);
    });
  });

  describe("/votes", () => {
    describe("/votes/:username/articlevotes", () => {
      it("Returns an array of article votes for a given user", () => {
        return request
          .get("/api/votes/lurker/articlevotes")
          .expect(200)
          .then((res) => {
            expect(res.body.votes).to.be.a("array");
            console.log(res.body.votes);
            expect(res.body.votes[0]).to.contain.keys(
              "username",
              "article_id",
              "votevalue"
            );
          });
      });
      it("Returns an empty array for any user with no votes", () => {
        return request
          .get("/api/votes/unknown/articlevotes")
          .expect(200)
          .then((res) => {
            expect(res.body.votes).to.eql([]);
          });
      });
    });
    describe("/votes/:username/commentvotes", () => {
      it("Returns an array of comment votes for a given user", () => {
        return request
          .get("/api/votes/lurker/commentvotes")
          .expect(200)
          .then((res) => {
            expect(res.body.votes).to.be.a("array");
            expect(res.body.votes[0]).to.contain.keys(
              "username",
              "comment_id",
              "votevalue"
            );
          });
      });
      it("Returns an empty array for any user with no votes", () => {
        return request
          .get("/api/votes/unknown/commentvotes")
          .expect(200)
          .then((res) => {
            expect(res.body.votes).to.eql([]);
          });
      });
    });
    describe("/votes/comment/:comment_id", () => {
      it("Add a vote for a user and comment ID and returns the vote", () => {
        return request
          .post("/api/votes/comment/1")
          .send({ username: "rogersop", votevalue: -1 })
          .expect(200)
          .then((res) => {
            console.log(res.body);
            expect(res.body.vote).to.contain.keys(
              "username",
              "comment_id",
              "votevalue"
            );
          });
      });
      it("GET response is 404 when username not found", () => {
        return request
          .post("/api/votes/comment/1")
          .send({ username: "not_a_real_user", votevalue: -1 })
          .expect(422)
          .then((res) => {
            expect(res.body.message).to.eql(
              "request field can not be processed"
            );
          });
      });
    });
    describe("/votes/article/:article_id", () => {
      it("Add a vote for a user and article ID and returns the vote", () => {
        return request
          .post("/api/votes/article/1")
          .send({ username: "rogersop", votevalue: -1 })
          .expect(200)
          .then((res) => {
            expect(res.body.vote).to.contain.keys(
              "username",
              "article_id",
              "votevalue"
            );
          });
      });
      it("GET response is 404 when username not found", () => {
        return request
          .post("/api/votes/article/1")
          .send({ username: "not_a_real_user", votevalue: -1 })
          .expect(422)
          .then((res) => {
            expect(res.body.message).to.eql(
              "request field can not be processed"
            );
          });
      });
    });
  });
});
