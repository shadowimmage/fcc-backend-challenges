// exercise/index.js

const trackerCollection = 'exerciseTracker'

// Challenge 4v2 - Exercise Tracker - UI page
exports.uiPage = function (req, res) {
  res.render('exercise/index')
}

exports.addUser = function (req, res) {
  // lookup username; insert and return ID if not taken; otherwise return error message.
  const collection = req.app.dbConn.getDB().collection(trackerCollection)
  var lookup = collection.find({
    username: req.body.username
  }).toArray(function (err, documents) {
    if (err) {
      console.log(err)
      res.status(500).send('Unable to complete action.')
    } else {
      if (documents.length > 0) { // username was found
        res.status(400).send('Username \'' + req.params.username + '\' already taken.')
      } else {
        collection.insertOne({'username': req.body.username}, function (err, result) {
          if (err) {
            console.log(err)
            res.status(500).send('500 server error; unable to save username.')
          } else {
            res.json({
              'username': res.body.username,
              '_id': result.insertedId
            })
          }
        })
      }
    }
  })
}
