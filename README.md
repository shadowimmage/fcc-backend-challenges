# FreeCodeCamp Backend API Services Challenges

Deployed to Heroku here: <https://fcc-challenges.herokuapp.com/>

These APIs/Pages have been modified to be slightly different than the FreeCodeCamp challenges so that they can all live within the same app and be a bit more useful and cohesive.

## Change Note May 2018

A major change to FreeCodeCamp's curriculum may have broken some of these microservices. In addition, the ordering and naming convention may have changed.

## Contents

---------

- APIs
  - [Challenge 1: Timestamp](./fcc-backend-challenges#challenge-1---timestamp-microservice)
  - [Challenge 2: Request Header Parser](./fcc-backend-challenges#challenge-2---request-header-parser-microservice)
  - [Challenge 3: URL Shortener](./fcc-backend-challenges#challenge-3---url-shortener-microservice)
  - [Challenge 4: Image Search](./fcc-backend-challenges#challenge-4---image-search-abstraction-layer)
  - [Challenge 4(v2): Exercise Tracker]
  - [Challenge 5: File Metadata](./fcc-backend-challenges#challenge-5---file-metadata-microservice)

---------

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

### C1 User Stories

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

### C2 User Stories

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

### C3 User Stories

- User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
- User Story: If I pass an invalid URL that doesn't follow the valid `http://www.example.com` format, the JSON response will contain an error instead.
- User Story: When I visit that shortened URL, it will redirect me to my original link.

## Challenge 4 - Image Search Abstraction Layer

Usage:

Search for images by replacing `{query}` with your query, and paginate through results with `{page}`.

- `https://fcc-challenges.herokuapp.com/api/imagesearch/q/{query}?offset={page}`

Show recent queries at the endpoint:

- `https://fcc-challenges.herokuapp.com/api/imagesearch/latest`

### C4 User Stories

- User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
- User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.
- User Story: I can get a list of the most recently submitted search strings.

## Challenge 4(v2) - Exercise Tracker

```NOTE: This challenge replaced the image search API microservice challenge as of May 2018 with the update to the Free Code Camp curriculum.```

Full-stack app that creates an exercise tracker, with the ability to create a new user and then add exercise logs to that user.

Usage:

Going to `https://fcc-challenges.herokuapp.com/exercise` will take you to the UI frontend.

API backend:

- `POST: /api/exercise/new-user` with username to create a new user
- `POST: /api/exercise/add` with valid userID, activity, duration, and optionally the date
- `GET: /api/exercise/log?` with at least userID to get user activity for that user

## Challenge 5 - File Metadata Microservice

Full-stack (really basic frontend in Pug/HTML) that takes a FormData object from a file upload form and returns the file size in bytes as part of a JSON response.

Usage:

- `https://fcc-challenges.herokuapp.com/api/filesize/upload`

Will output:

```json
{
  "filename": "some_file.ext",
  "size": 12345
}
```

### C5 User Stories

- User Story: I can submit a FormData object that includes a file upload.
- User Story: When I submit something, I will receive the file size in bytes within the JSON response
