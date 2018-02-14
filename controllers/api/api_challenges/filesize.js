// filesize.js

// Challenge 5 - File Metadata Microservice - upload page
exports.upload = function (req, res) {
  res.render('filesize/upload')
}

// Challenge 5 - File Metadata Microservice - file upload result
exports.result =  function (req, res) {
  res.json({
    'filename': req.file.originalname,
    'size': req.file.size
  })
}