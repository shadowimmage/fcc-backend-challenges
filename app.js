// app.js

const express = require('express');
const mongo = require('mongodb').MongoClient;
const mongoURL = process.env.MLABCONNECTION;
const mdbName = process.env.MDBNAME;
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

app.get("/shortener/new/:url", function (req, res) {
  var resData = {
    original_url: "invalid URL",
    short_url: null
  };
  /// db.find().sort( {index} ).limit( 1 )
  /// how to insert at last index position - not using inbuilt object ids.
  if (isValidUrl(req.params.url)) {
    var mdbClient = mongo.connect(mongoURL, function (err, client) {
      if (err) console.error(err);
      const db = mdbClient.db(mdbName);
      db.collection('shortUrls').insertOne()
    });
    mdbClient.close();
  };
});

function isValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
};

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
