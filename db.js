// db.js
// simple db controller for maintaining a constant connection to the database.

var MongoClient = require('mongodb').MongoClient
const mdbName = process.env.MDBNAME

var state = {
  client: null,
  db: null
}

exports.connect = function(url, done) {
  if (state.db) {
    return done()
  }

  MongoClient.connect(url, function (err, client) {
    if (err) {
      return done(err)
    }

    state.client = client
    state.db = client.db(mdbName)
    done()
  })
}

exports.getDB = function() {
  return state.db
}

exports.close = function(done) {
  if (state.client) {
    state.client.close(function (err, result) {
      state.client = null
      state.db = null
      done(err)
    })
  }
}