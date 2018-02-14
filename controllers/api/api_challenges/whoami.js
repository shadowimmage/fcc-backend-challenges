// whoami.js
// FreeCodeCamp // Backend Challenge 2 - Get requesting client IP Address
exports.who = function (req, res) {
  var resData = {
    ipaddress: null,
    language: null,
    software: null
  }
  resData.ipaddress = req.ip
  if (req.header('accept-language')) {
    resData.language = req.header('accept-language').split(',')[0]
  }
  if (req.header('user-agent')) {
    var userAgent = req.header('user-agent')
    var lParenIndex = userAgent.indexOf('(')
    var rParenIndex = userAgent.indexOf(')')
    if (lParenIndex > -1 && rParenIndex > -1) {
      resData.software = userAgent.substr(lParenIndex+1, rParenIndex-lParenIndex)
    }
  }
  
  res.json(resData)
}
