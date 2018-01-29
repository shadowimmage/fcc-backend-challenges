# FreeCodeCamp Backend API Services Challenges

Deployed to Heroku here: https://fcc-challenges.herokuapp.com/

These APIs/Pages have been modified to be slightly different than the FreeCodeCamp challenges so that they can all live within the same app and be a bit more useful and cohesive.

## Challenge 1 - Timestamp Microservice

Example input:

- `https://fcc-challenges.herokuapp.com/api/timestamp/December%2015,%202015`
- `https://fcc-challenges.herokuapp.com/api/timestamp/1450137600`

Example output:

```json
{
  "unix": 1450137600,
  "natural": "December 15, 2015"
}
```

### User Stories

- User Story: I can pass a string as a parameter, and it will check to see whether that string contains either a unix timestamp or a natural language date (example: January 1, 2016).
- User Story: If it does, it returns both the Unix timestamp and the natural language form of that date.
- User Story: If it does not contain a date or Unix timestamp, it returns null for those properties.

## Challenge 2 - Request Header Parser Microservice

Example input:

- `https://fcc-challenges.herokuapp.com/api/whoami`

Example output:

```json
{
  "ipaddress":"73.83.118.90",
  "language":"en-US",
  "software":"Windows NT 10.0; Win64; x64; rv:57.0"
}
```

### User Stories

- User Story: I can get the IP address, language and operating system for my browser.

## Challenge 3 - URL Shortener Microservice

Example creation input:

- `https://fcc-challenges.herokuapp.com/shortener/new/https://www.google.com`
- `https://fcc-challenges.herokuapp.com/shortener/new/http://foo.com:80`

Example creation output:

```json
{
  "original_url":"http://foo.com:80",
  "short_url":"https://fcc-challenges.herokuapp.com/shortener/8170"
}
```

Usage:

- `https://fcc-challenges.herokuapp.com/shortener/2871`

Will redirect to:

- `https://www.google.com/`

### User Stories

- User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
- User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
- User Story: When I visit that shortened URL, it will redirect me to my original link.