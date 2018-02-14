// routes/

const router = require('express').Router()

const apiRouter = require('./api')
const shortener = require('./shortener')

router.use('/api/', apiRouter)
router.use('/shortener', shortener)

module.exports = router
