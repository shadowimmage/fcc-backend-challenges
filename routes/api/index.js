// routes/api

const apiRouter = require('express').Router()

const timestamp = require('./timestamp')
const whoami = require('./whoami')
const imagesearch = require('./imagesearch')
const filesize = require('./filesize')

apiRouter.use('/timestamp', timestamp)
apiRouter.use('/whoami', whoami)
apiRouter.use('/imagesearch', imagesearch)
apiRouter.use('/filesize', filesize)

module.exports = apiRouter