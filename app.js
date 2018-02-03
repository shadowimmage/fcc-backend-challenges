// app.js

const express = require('express')
const mongoConnection = require('./db')
const mongoURL = process.env.MONGODB_URI
// const mdbName = process.env.MDBNAME
const validUrl = require('valid-url')
const shortUrlCollection = 'shortUrls'
const imgSearchCollection = 'imgSearches'
const https = require('https')
var app = express()


// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html

// Challenge 1 - Timestamp conversion UNIX <--> Standard
app.get('/api/timestamp/:timestamp?', function (req, res) {
  var timestamp = req.params.timestamp
  var resData = {
    unix: null,
    natural: null
  };
  if (!timestamp) {
    res.json(resData)
  } else {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    if (isNaN(parseInt(timestamp))) {
      // is a string
      var date = new Date(timestamp)
      resData.natural = months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
      resData.unix = Math.floor(date.getTime() / 1000)
    } else {
      // is a number (expect unix time)
      var date = new Date(timestamp * 1000)
      resData.natural = months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
      resData.unix = timestamp
    }
    res.json(resData)
  }
});

// Challenge 2 - Get requesting client IP Address
app.get("/api/whoami/", function (req, res) {
  var resData = {
    ipaddress: null,
    language: null,
    software: null
  }
  resData.ipaddress = req.ip
  resData.language = req.header('accept-language').split(',')[0]
  var userAgent = req.header('user-agent')
  var lParenIndex = userAgent.indexOf("(")
  var rParenIndex = userAgent.indexOf(")")
  if (lParenIndex > -1 && rParenIndex > -1) {
    resData.software = userAgent.substr(lParenIndex+1, rParenIndex-lParenIndex)
  }
  res.json(resData)
})


// Challenge 3 - URL Shortener (part1) - Short URL Creator
app.get("/shortener/new/*", function (req, res) {
  var resData = {
    original_url: "invalid URL",
    short_url: null
  }
  resData.short_url = req.hostname + '/shortener/'

  var url = req.url.slice(15)

  if (validUrl.isUri(url)) {
    resData.original_url = url
    var collection = mongoConnection.getDB().collection(shortUrlCollection)
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
})

// Challenge 3 - URL Shortener (part 2) - Short URL resolver/redirector
app.get('/shortener/:id?', function (req, res) {
  if (req.params.id) {
    var collection = mongoConnection.getDB().collection(shortUrlCollection)
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
})

// Challenge 4 - Image Search Abstraction Layer (search) - also first time using async/await
app.get('/api/imagesearch/:q?', function (req, res) {
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

        var collection = mongoConnection.getDB().collection(imgSearchCollection)
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
})

// Challenge 4 - Image Search Abstraction Layer (recent searches)
app.get('/api/latest/imagesearch', function (req, res) {
  var collection = mongoConnection.getDB().collection(imgSearchCollection)
  var lastSearches = collection.find().sort({ index: -1 }).limit(10)
  lastSearches.project({ _id: 0, query: 1 }).toArray(function (err, documents) {
    if (err) console.error(err.message)
    res.json(documents)
  })
})

// set up db and begin app once connection is up
mongoConnection.connect(mongoURL, function (err) {
  if (err) {
    console.log('Unable to connect to MongoDB.')
    process.exit(1)
  } else {
    console.log('MongoDB connected.')
    var listener = app.listen(process.env.PORT, function () {
      console.log('Your app is listening on port ' + listener.address().port)
    })
  }
})

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
