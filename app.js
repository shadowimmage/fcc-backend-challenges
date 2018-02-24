// app.js

const express = require('express')
const mongoConnection = require('./utils/db/db')
const mongoURL = process.env.MONGODB_URI

const app = express()

app.set('view engine', 'pug')

// http://expressjs.com/en/starter/basic-routing.html
const routes = require('./routes')
app.use('/', routes)

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// Error Handling Routes
/* eslint-disable no-console */ // used for Logging to Heroku host logs.
app.use(function (err, req, res, next) {
  console.error(err.stack)
  next(err)
})
app.use(function (err, req, res, next) { // eslint-disable-line
  res.status(500)
  res.render('error', {'error': err})
})

// 404
app.use(function (req, res, next) { // eslint-disable-line
  res.status(404).send('404 -- Resource not found.')
})

// set up db and begin app once connection is up

mongoConnection.connect(mongoURL, function (err) {
  if (err) {
    console.log('Unable to connect to MongoDB.')
    process.exit(1)
  } else {
    console.log('MongoDB connected.')
    // Store the DB connection in app, so that it can be accessed through
    // req.app.dbConn within controllers. (from https://stackoverflow.com/questions/44556821/node-js-making-db-variable-available-in-controller-files)
    app.dbConn = mongoConnection
    var listener = app.listen(process.env.PORT, function () {
      console.log('Your app is listening on port ' + listener.address().port)
    })
  }
})

// Handle shutdown command from host container/system
//   Terminates connection to Mongo before completing shutdown.
process.on('SIGTERM', function () {
  console.log('App shutdown...')
  mongoConnection.close(function (err) {
    if (err) {
      console.error(err.message)
    } else {
      console.log('MongoDB closed.')
    }
  })  
})

/**
 * Export the Express app so that it can be used by Chai
 */
module.exports = app
