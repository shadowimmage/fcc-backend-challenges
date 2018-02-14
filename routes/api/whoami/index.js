// routes/api/whoami

const whoamiRouter = require('express').Router()

const whoami = require('../../../controllers/api/api_challenges/whoami')

whoamiRouter.get('/', whoami.who)

module.exports = whoamiRouter
