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
2. [GET /api/articles/:article_id](#2-get-apiarticlesarticleid)
3. [PATCH /api/articles/:article_id](#3-patch-apiarticlesarticleid)
4. [GET /api/users](#4-get-apiusers)

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

## 2. GET /api/articles/:article_id

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
    "votes": 100
  }
}
```

## 3. PATCH /api/articles/:article_id

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

## 4. GET /api/users

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
