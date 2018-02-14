// timestamp.js
// Challenge 1 - Timestamp conversion UNIX <--> Standard

exports.convert = function (req, res) {
  var timestamp = req.params.timestamp
  var resData = {
    unix: null,
    natural: null
  }
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
      var unixDate = new Date(timestamp * 1000)
      resData.natural = months[unixDate.getUTCMonth()] + ' ' + unixDate.getUTCDate() + ', ' + unixDate.getUTCFullYear()
      resData.unix = timestamp
    }
    res.json(resData)
  }
}