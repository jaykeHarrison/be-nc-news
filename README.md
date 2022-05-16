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
      topics: [
        { slug: 'mitch', description: 'The man, the Mitch, the legend' },
        { slug: 'cats', description: 'Not dogs' },
        { slug: 'paper', description: 'what books are made of' }
      ]
}
```
