# Northcoders News API

## Add .env\* files

You will need to create two .env files to determine when we are using the development or test databases. You can use the following commands in the root directory:

```
echo 'PGDATABASE=nc_news' >> .env.development
echo 'PGDATABASE=nc_news_test' >> .env.test
```

These will automatically be ignored in the .gitignore file.

# REST APIs

## Index

1. [GET /api/topics](#1-get-apitopics)
2. [GET /api/articles](#2-get-apiarticles)
3. [GET /api/articles/:article_id](#3-get-apiarticlesarticleid)
4. [GET /api/articles/:article_id/comments](#4-get-apiarticlesarticleidcomments)
5. [PATCH /api/articles/:article_id](#5-patch-apiarticlesarticleid)
6. [POST /api/articles/:article_id/comments](#6-post-apiarticlesarticleidcomments)
7. [GET /api/users](#7-get-apiusers)

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
