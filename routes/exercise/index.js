// routes/exercise/

const app = require('../../app')
const exerciseRouter = require('express').Router()
const exercise_tracker = require('../../controllers/api/api_challenges/exercise')

exerciseRouter.get('/', exercise_tracker.uiPage)
exerciseRouter.post('/api/new-user', app.plaintextParser, exercise_tracker.addUser)

module.exports = exerciseRouter
