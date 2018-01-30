// app.js

const express = require('express');
const mongo = require('mongodb').MongoClient;
const mongoURL = process.env.MONGODB_URI;
const mdbName = process.env.MDBNAME;
const validUrl = require('valid-url');
const shortUrlCollection = 'shortUrls';
var app = express();


// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/api/timestamp/:timestamp?", function (req, res) {
  var timestamp = req.params.timestamp
  var resData = {
    unix: null,
    natural: null
  };
  if (!timestamp) {
    res.json(resData);
  } else {
    const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (isNaN(parseInt(timestamp))) {
      // is a string
      var date = new Date(timestamp);
      resData.natural = months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
      resData.unix = Math.floor(date.getTime() / 1000);
    } else {
      // is a number (expect unix time)
      var date = new Date(timestamp * 1000);
      resData.natural = months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
      resData.unix = timestamp;
    }
    res.json(resData);
  }
});

app.get("/api/whoami/", function (req, res) {
  var resData = {
    ipaddress: null,
    language: null,
    software: null
  };
  resData.ipaddress = req.ip;
  resData.language = req.header('accept-language').split(',')[0];
  var userAgent = req.header('user-agent');
  var lParenIndex = userAgent.indexOf("(");
  var rParenIndex = userAgent.indexOf(")");
  if (lParenIndex > -1 && rParenIndex > -1) {
    resData.software = userAgent.substr(lParenIndex+1, rParenIndex-lParenIndex);
  }
  res.json(resData);
});

app.get("/shortener/new/*", function (req, res) {
  var resData = {
    original_url: "invalid URL",
    short_url: null
  };
  resData.short_url = req.hostname + "/shortener/";

  var url = req.url.slice(15);

  if (validUrl.isUri(url)) {
    resData.original_url = url;
    var mdbClient = mongo.connect(mongoURL, function (err, client) {
      if (err) console.error(err);
      const db = client.db(mdbName);
      var lastDoc = db.collection(shortUrlCollection).find().sort({ index: -1 }).limit(1);
      lastDoc.project({_id: 0, index: 1}).toArray(function (err, documents) {
        if (err) console.error(err);
        var insertIndex = 1;
        if (documents.length > 0) {
          // console.log(documents[0].index);
          insertIndex += documents[0].index;
        }
        db.collection(shortUrlCollection).insertOne({
          index: insertIndex,
          url: resData.original_url
        }, function(err, r) {
          if (err) console.error(err);
          resData.short_url += insertIndex;
          res.json(resData);
        });
      });
    });
    if (mdbClient) mdbClient.close();
  } else { //end valid url section
  res.json(resData);
  }
});



app.get("/shortener/:id?", function(req, res) {
  if (req.params.id) {
    var mdbClient = mongo.connect(mongoURL, function (err, client) {
      if (err) console.error(err);
      const db = client.db(mdbName);
      var shortDestDoc = db.collection(shortUrlCollection).find({
        index: parseInt(req.params.id)
      }).project({
        _id: 0,
        url: 1
      }).toArray(function (err, documents) {
        if (err) console.error(err);
        if (documents.length > 0) {
          res.redirect(documents[0].url);
        } else {
          res.end("Invalid short URL id.");
        }
      });
    });
    if (mdbClient) mdbClient.close();
  } else {
    res.end(JSON.stringify({"error":"invalid URL"}));
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
