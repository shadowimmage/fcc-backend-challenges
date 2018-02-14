// url shortener

const validUrl = require('valid-url')
const shortUrlCollection = 'shortUrls'

// Challenge 3 - URL Shortener (part1) - Short URL Creator
exports.new = function (req, res) {
  var resData = {
    original_url: 'invalid URL',
    short_url: null
  }
  resData.short_url = req.hostname + '/shortener/'
  // console.log(req.url)
  var url = req.url.slice(5)
  // console.log(req.url.slice(5))
  if (validUrl.isUri(url)) {

    resData.original_url = url
    var collection = req.app.dbConn.getDB().collection(shortUrlCollection)
    var lastDoc = collection.find().sort({ index: -1 }).limit(1)
    lastDoc.project({_id: 0, index: 1}).toArray(function (err, documents) {
      if (err) console.error(err)
      var insertIndex = 1
      if (documents.length > 0) {
        // console.log(documents[0].index);
        insertIndex += documents[0].index
      }
      collection.insertOne({
        index: insertIndex,
        url: resData.original_url
      }, function(err, r) {
        if (err) console.error(err)
        resData.short_url += insertIndex
        res.json(resData)
      })
    })
  } else { //end valid url section
    res.json(resData)
  }
}

// Challenge 3 - URL Shortener (part 2) - Short URL resolver/redirector
exports.getId = function (req, res) {
  if (req.params.id) {
    var collection = req.app.dbConn.getDB().collection(shortUrlCollection)
    var shortDestDoc = collection.find({
      index: parseInt(req.params.id)
    }).project({
      _id: 0,
      url: 1
    }).toArray(function (err, documents) {
      if (err) console.error(err)

      if (documents.length > 0) {
        res.redirect(documents[0].url)
      } else {
        res.end('Invalid short URL id.')
      }
    })
  } else {
    res.end(JSON.stringify({'error':'invalid URL'}))
  }
}
