// routes/api/imagesearch

const imagesearchRouter = require('express').Router()

const imagesearch = require('../../../controllers/api/api_challenges/imagesearch')

imagesearchRouter.get('/', imagesearch.search)
imagesearchRouter.get('/q/', function (req, res, next) {
  if (req.params.q) {
    req.query.q = req.params.q
  }
  next()
}, imagesearch.query)
imagesearchRouter.get('/latest', imagesearch.latest)

module.exports = imagesearchRouter
