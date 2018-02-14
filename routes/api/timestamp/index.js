// routes/api/timestamp

const timestampRouter = require('express').Router()

const timestamp = require('../../../controllers/api/api_challenges/timestamp')

timestampRouter.get('/:timestamp?', timestamp.convert)

module.exports = timestampRouter
