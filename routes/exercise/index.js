// routes/exercise/

const exerciseRouter = require('express').Router()
const exercise_tracker = require('../../controllers/exercise')

exerciseRouter.get('/', exercise_tracker.uiPage)

module.exports = exerciseRouter
