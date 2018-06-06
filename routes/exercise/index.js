// routes/exercise/

const bodyParser = require('body-parser')
const exerciseRouter = require('express').Router()
const exerciseTracker = require('../../controllers/api/api_challenges/exercise')

var urlencodedParser = bodyParser.urlencoded({ extended: true }) // support encoded bodies

exerciseRouter.get('/', exerciseTracker.uiPage)
exerciseRouter.post('/api/new-user', urlencodedParser, exerciseTracker.addUser)
exerciseRouter.post('/api/add', urlencodedParser, exerciseTracker.addActivity)
exerciseRouter.get('/api/log', exerciseTracker.getUserLog)

module.exports = exerciseRouter
