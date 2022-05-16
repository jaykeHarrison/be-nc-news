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
