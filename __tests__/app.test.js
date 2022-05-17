const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article).toEqual({
          article_id: 1,
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          title: "Living in the shadow of a great man",
          topic: "mitch",
          votes: 100,
        });
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
  describe("400: responds with 'Bad request'", () => {
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
          expect(message).toBe("Bad request");
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
          expect(message).toBe("Bad request");
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
