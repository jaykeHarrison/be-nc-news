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

## 1. GET /api/topics

### Description

Responds with an array of topic objects with slug and description properties

### Status

200 - OK

### Response

Responds with JSON-encoded object with with property topics. Example:

```
{
  "topics": [
    { "slug": "mitch", "description": "The man, the Mitch, the legend" },
    { "slug": "cats", "description": "Not dogs" },
    { "slug": "paper", "description": "what books are made of" }
  ]
}
```

## 2. Get /api/articles/:article_id

### Description

Responds with a JSON article object with author, title, article_id, body, topic, created_at, and votes details.

### Status

200 - OK

### Parameters

**:article_id** _Integer_: ID of the required article

### Response

Responds with JSON-encoded object with with property article whose value is the requested article object. Example:

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
