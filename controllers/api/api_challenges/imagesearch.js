// imagesearch.js

const https = require('https')
const imgSearchCollection = 'imgSearches'

// Challenge 4 - Image Search Abstraction Layer (search) - also first time using async/await
exports.query = function (req, res) {
  const resultsPerQuery = 10
  var localData = {
    searchTerm: '',
    pagination: 1,
  }
  if (!req.params.q) {
    res.json({'error': 'search query required'})
  } else {
    if (req.query.offset) {
      var offset_tmp = Number(req.query.offset)
      if (!isNaN(offset_tmp)) {
        localData.pagination = offset_tmp
      }
    }
    localData.searchTerm = req.params.q
    var options = {
      host: 'www.googleapis.com',
      port: 443,
      path: '/customsearch/v1?',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    options.path += 'searchType=image'
    options.path += '&safe=medium'
    options.path += '&fields=kind,items(title,link,snippet,image/contextLink,image/thumbnailLink)'
    options.path += '&key=' + process.env.G_SEARCH_API_KEY
    options.path += '&cx=' + process.env.G_CSE_ID
    options.path += '&q=' + localData.searchTerm
    options.path += '&start=' + Math.max(localData.pagination * resultsPerQuery, 1)

    const imgReq = https.request(options, function(imgRes) {
      var output = ''
      imgRes.setEncoding('utf8')

      imgRes.on('data', function (chunk) {
        output += chunk
      })

      imgRes.on('end', function () {
        localData.imgJSON = JSON.parse(output)

        var collection = req.app.dbConn.getDB().collection(imgSearchCollection)
        var lastDoc = collection.find().sort({ index: -1 }).limit(1)
        lastDoc.project({_id: 0, index: 1}).toArray(function (err, documents) {
          if (err) console.error(err)

          var insertIndex = 1
          if (documents.length > 0) {
            insertIndex += documents[0].index
          }

          collection.insertOne({
            index: insertIndex,
            query: localData.searchTerm
          }, function(err, r) {
            if (err) console.error(err)
            res.json(localData)
          })
        })
      })
    })

    imgReq.on('error', function (err) {
      res.send('error: ' + err.message) 
    })

    imgReq.end()
  }
}

// Challenge 4 - Image Search Abstraction Layer (recent searches)
exports.latest = function (req, res) {
  var collection = req.app.dbConn.getDB().collection(imgSearchCollection)
  var lastSearches = collection.find().sort({ index: -1 }).limit(10)
  lastSearches.project({ _id: 0, query: 1 }).toArray(function (err, documents) {
    if (err) console.error(err.message)
    res.json(documents)
  })
}