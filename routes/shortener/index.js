// routes/shortener/

const shortenerRouter = require('express').Router()
const shortener = require('../../controllers/shortener')

shortenerRouter.get('/new/*', shortener.new)
shortenerRouter.get('/:id?', shortener.getId)

module.exports = shortenerRouter
