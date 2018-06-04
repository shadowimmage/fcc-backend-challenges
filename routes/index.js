// routes/

const router = require('express').Router()

const apiRouter = require('./api')
const shortener = require('./shortener')
const exercise = require('./exercise')

router.use('/api/', apiRouter)
router.use('/shortener', shortener)
router.use('/exerciseTracker', exercise)

module.exports = router
