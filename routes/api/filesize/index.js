// routes/api/filesize

const filesizeRouter = require('express').Router()

const filesize = require('../../../controllers/api/api_challenges/filesize')

const multer = require('multer')

var storage = multer.memoryStorage()
var upload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 5000000
  }
})

filesizeRouter.get('/upload', filesize.upload)
filesizeRouter.post('/', upload.single('file'), filesize.result)

module.exports = filesizeRouter
