// routes/api/imagesearch

const imagesearchRouter = require('express').Router()

const imagesearch = require('../../../controllers/api/api_challenges/imagesearch')

imagesearchRouter.get('/q/:q?', imagesearch.query)
imagesearchRouter.get('/latest', imagesearch.latest)

module.exports = imagesearchRouter
