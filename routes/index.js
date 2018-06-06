// routes/

const router = require('express').Router()

const apiRouter = require('./api')
const shortener = require('./shortener')
const exercise = require('./exercise')
const homepage = require('../controllers/homepage')

router.use('/api/', apiRouter)
router.use('/shortener', shortener)
router.use('/exerciseTracker', exercise)

router.get('/', homepage.home)

module.exports = router
