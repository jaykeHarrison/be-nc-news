const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topicsArr = response.body.topics;

        expect(topicsArr).toHaveLength(3);
        topicsArr.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("404: responds with message 'URL not recognised' when request made to invalid URL", () => {
    return request(app)
      .get("/api/thetopics")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("URL not recognised");
      });
  });
});

describe("GET /api/articles", () => {
  describe("200:", () => {
    test("responds with array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("comment_count is correct for all", () => {
      const actualCommentCount = [11, 0, 2, 0, 2, 1, 0, 0, 2, 0, 0, 0];

      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            const articleId = article.article_id;

            expect(article.comment_count).toBe(
              actualCommentCount[articleId - 1]
            );
          });
        });
    });
    test("articles objects are ordered by date in decending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: responds with article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100,
          })
        );
      });
  });
  test("200: responds with article object with comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
      });
  });
  test("404: response with 'Article by that ID not found'", () => {
    return request(app)
      .get("/api/articles/1239121239")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article by that ID not found");
      });
  });
  test("400: responds with 'Bad request'", () => {
    return request(app)
      .get("/api/articles/number1")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with array of comment objects", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: responds with empty array when article_id is existing article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: responds with 'Bad request' when passed invalid article_id param", () => {
    return request(app)
      .get("/api/articles/three/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("404: responds with 'Article by that ID not found' when passed ID of valid format but doesn't exist", () => {
    return request(app)
      .get("/api/articles/12931923/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article by that ID not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article object", () => {
    const requestBody = {
      inc_votes: 50,
    };

    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 150,
        });
      });
  });
  describe("400: responds with 'Bad request: request body of invalid format'", () => {
    test("when given parameters of wrong format", () => {
      const requestBody = {
        inc_votes: 50,
      };

      return request(app)
        .patch("/api/articles/numberone")
        .send(requestBody)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("when request body is empty", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request: request body of invalid format");
        });
    });
    test("when request body is of wrong format", () => {
      const requestBody = {
        inc_votes: "apple",
      };

      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request: request body of invalid format");
        });
    });
  });
  test("404: responds with 'Article by that ID not found", () => {
    const requestBody = {
      inc_votes: 50,
    };

    return request(app)
      .patch("/api/articles/2342394")
      .send(requestBody)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article by that ID not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  const commentObject = {
    username: "rogersop",
    body: "what a wonderful test",
  };

  test("201: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentObject)
      .expect(201)
      .then(({ body: { addedComment } }) => {
        expect(addedComment).toEqual(
          expect.objectContaining({
            body: "what a wonderful test",
            votes: 0,
            author: "rogersop",
            article_id: 2,
            created_at: expect.any(String),
          })
        );
      });
  });
  describe("400: responds with a 'Bad request' message", () => {
    test("when passed article_id of invalid format", () => {
      return request(app)
        .post("/api/articles/two/comments")
        .send(commentObject)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request");
        });
    });
    test("when passed object with missing properties", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({})
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request: request body invalid");
        });
    });
    test("when passed object is not of valid format", () => {
      const wrongTypesCommentObj = {
        username: 12,
        body: true,
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(wrongTypesCommentObj)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Bad request: request body invalid");
        });
    });
  });
  describe("404:", () => {
    test("responds with 'Article by that ID not found'", () => {
      return request(app)
        .post("/api/articles/22131/comments")
        .send(commentObject)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Article by that ID not found");
        });
    });
    test("responds with 'User by that username not found'", () => {
      const wrongUserCommentObject = {
        username: "banana",
        body: "this user doesn't exist",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(wrongUserCommentObject)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("User by that username not found");
        });
    });
  });
});
describe("GET /api/users", () => {
  test("200: responds with an array of user objects with property username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});
