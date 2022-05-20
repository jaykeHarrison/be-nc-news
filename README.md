# Northcoders News API

## Project Overview

A news API built user `Node.js`, `Express.js` and `PostgreSQL` for the relational database.

All available endpoints can be found in the `endpoints.json` file, by following the link to the hosted version, and at the bottom of this readme.

This will be used as the backend for an upcoming front-end application.

## Hosted Version

You can see a live version of this app, hosted with `Heroku`:

https://jaykeharrison-nc-news.herokuapp.com/api

## Setup Instructions

### Installation Requirements

- **Node.js**: v17.8.0 or later
- **PostgreSQL**: v 12.10 or later

### Cloning the repository:

Create a directory to clone the repository to. In your terminal:

```
$ mkdir <new directory name>
```

Change directory to the one you just created:

```
$ cd <new directory name>
```

Then clone the repository:

```
$ git clone https://github.com/jaykeHarrison/be-nc-news.git
```

### Install Dependencies

To install the both app and developer dependencies, in the root directory put the following command in your terminal:

```
$ npm install
```

### Setup Dev & Test Environments

You will need to create two .env files to determine when we are using the development or test databases. You can use the following commands in the root directory:

```
$ echo 'PGDATABASE=nc_news' >> .env.development
$ echo 'PGDATABASE=nc_news_test' >> .env.test
```

These will automatically be ignored in the .gitignore file.

### Database setup and seeding

Run the following scripts in the root directory to setup both your development and test databases

Setup:

```
$ npm run setup-dbs
```

Seeding:

```
$ npm run seed
```

## Testing

To test this application, the `jest` framework is used. The tests can be run with the following script:

```
$ npm test
```

## Dependencies

These are all the dependencies required for this web app.

### Application Dependencies

| Dependency | Version         | Description                    | Docs                                                              |
| ---------- | --------------- | ------------------------------ | ----------------------------------------------------------------- |
| npm        | 17.8.0 or later | Node.js / Node Package Manager | https://docs.npmjs.com/downloading-and-installing-node-js-and-npm |
| dotenv     | 16.0.1 or later | Loads environment variables    | https://www.npmjs.com/package/dotenv                              |
| pg         | 8.7.3 or later  | PostgreSQL client for Node.js  | https://www.npmjs.com/package/pg                                  |
| express    | 4.18.1 or later | Web application framework      | https://www.npmjs.com/package/express                             |

### Developer-only Dependencies

| Dependency  | Version          | Description                                        | Docs                                           |
| ----------- | ---------------- | -------------------------------------------------- | ---------------------------------------------- |
| jest        | v27.5.1 or later | JavaScript testing framework                       | https://jestjs.io/docs/getting-started         |
| jest-sorted | v1.0.14 or later | Test sort and order of arrays & objects            | https://github.com/P-Copley/jest-sorted#readme |
| supertest   | v6.2.3 or later  | Node.js library for testing HTTP requests          | https://www.npmjs.com/package/supertest        |
| pg-format   | v1.0.4 or later  | Formats PSQL queries to protect form SQL injection | https://www.npmjs.com/package/pg-format        |

# REST APIs

## Index

1. [GET /api/topics](#1-get-apitopics)
2. [GET /api/articles](#2-get-apiarticles)
3. [GET /api/articles/:article_id](#3-get-apiarticlesarticleid)
4. [GET /api/articles/:article_id/comments](#4-get-apiarticlesarticleidcomments)
5. [PATCH /api/articles/:article_id](#5-patch-apiarticlesarticleid)
6. [POST /api/articles/:article_id/comments](#6-post-apiarticlesarticleidcomments)
7. [GET /api/users](#7-get-apiusers)
8. [DELETE /api/comments/:comment_id](#8-delete-apicommentscommentid)

## 1. GET /api/topics

### Description

Responds with an array of topic objects with slug and description properties

### Status

200 - OK

### Response body

Responds with JSON-encoded object with with property **_topics_**, whose value is an array of topic objects. Example:

```
{
  "topics": [
    { "slug": "mitch", "description": "The man, the Mitch, the legend" },
    { "slug": "cats", "description": "Not dogs" },
    { "slug": "paper", "description": "what books are made of" }
  ]
}
```

## 2. GET /api/articles

### Description

Responds with an array of article objects, default sorted by created_at in descending order.

### Status

200 - OK

### Query Params

- **_sort_by_** - String - sorts the array of article objects by a valid property

- **order** - String - [ASC / DESC] - orders the article objects in either ascending or descending order

- **_topic_** - String - filters the article objects by a valid topic

### Response body

Responds with JSON-encoded object with with property **_*articles*_**, whose value is the requested articles objects. Example:

```
{
  "articles": [
    {
      "article_id": 3,
      "title": "Eight pug gifs that remind me of mitch",
      "topic": "mitch",
      "author": "icellusedkars",
      "body": "some gifs",
      "created_at": "2020-11-03T09:12:00.000Z",
      "votes": 0,
      "comment_count": 2
    },
    // more user objects
  ]
}
```

## 3. GET /api/articles/:article_id

### Description

Responds with a JSON article object with author, title, article_id, body, topic, created_at, and votes details.

### Status

200 - OK

### Parameters

**:article_id** _Integer_: ID of the required article

### Response body

Responds with JSON-encoded object with with property **_*article*_**, whose value is the requested article object. Example:

```
{
  "article": {
    "article_id": 1,
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "votes": 100,
    "comment_count": 11
  }
}
```

## 4. GET /api/articles/:article_id/comments

### Desccription

Responds with an array of comment objects for the specified article.

_note:_ if an article has no comments, the array will be empty

### Status

200 - OK

### Parameters

**:article_id** _Integer_: ID of the required article

### Response body

Responds with JSON-encoded object with with property **_comments_**, whose value is an array of comment objects for the specified article. Example:

```
{
  "comments": [
    {
      "comment_id": 10,
      "body": "git push origin master",
      "article_id": 3,
      "author": "icellusedkars",
      "votes": 0,
      "created_at": "2020-06-20T07:24:00.000Z"
    },
    {
      "comment_id": 11,
      "body": "Ambidextrous marsupial",
      "article_id": 3,
      "author": "icellusedkars",
      "votes": 0,
      "created_at": "2020-09-19T23:10:00.000Z"
    }
  ]
}

```

## 5. PATCH /api/articles/:article_id

### Description

Updates the specified article's votes by an incremenent passed in the request body. The updated article object is returned.

### Status

200 - OK

### Parameters

**:article_id** _Integer_: ID of the required article

### Request body

The request body should be a JSON object with a key **_inc_votes_** and value of an **integer** to increment. To decrement the votes, use a negative number.

Example:

```
{
  "inc_votes": 50
}
```

### Response body

Responds with JSON-encoded object with with property **_updatedArticle_**, whose value is the updated article object. Example:

```
{
  "updatedArticle": {
    "article_id": 1,
    "author": "butter_bridge",
    "body": "I find this existence challenging",
    "created_at": "2020-07-09T20:11:00.000Z",
    "title": "Living in the shadow of a great man",
    "topic": "mitch",
    "votes": 150
  }
}
```

## 6. POST /api/articles/:article_id/comments

### Description

Adds comment to specified article. Will respond with the newly created comment object.

### Status

201 - Created

### Parameters

**:article_id** _Integer_: ID of the required article

### Request body

The request body should be a JSON object with a keys **_username_** and **_body_** and values of an existing username and the body of the comment, respectively.

Example:

```
{
  "username": "rogersop",
  "body": "what a wonderful test"
}
```

### Response body

Responds with JSON-encoded object with with property **_addedComment_**, whose value is the newly created comment object.

Example:

```
{
  "addedComment": {
    "comment_id": 19,
    "body": "what a wonderful test",
    "article_id": 2,
    "author": "rogersop",
    "votes": 0,
    "created_at": "2022-05-18T11:46:52.339Z"
  }
}
```

## 7. GET /api/users

### Description

Responds with an array of username objects

### Status

200 - OK

### Response body

Responds with JSON-encoded object with with property **_users_**, whose value is an array of username objects. Example:

```
{
  "users": [
    { "username": "butter_bridge" },
    { "username": "icellusedkars" },
    { "username": "rogersop" },
    { "username": "lurker" }
  ]
}
```

## 8. DELETE /api/comments/:comment_id

### Description

Deletes the comment by specified comment id

### Status

204 - No content

### Parameters

**comment_id** - _integer_ - the id number of the comment to be deleted
