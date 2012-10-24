var hedge = require('hedge')
var httpProxy = require('http-proxy')


var port = process.env.PORT || 9876
var proxiedHost = process.env.PROXIEDHOST || '127.0.0.1'
// PROXIEDPORT has to be converted a number. See
// https://github.com/nodejitsu/node-http-proxy/issues/321
var proxiedPort = +process.env.PROXIEDPORT || 8765

// user:pass pairs must be separated by whitespace
var pairStr = process.env.PAIRS || 'user:pass user2:pass2 user3:pass3'
var pairs = {}
pairStr.split(/\s+/).forEach(function (pair) {
  var pairArr = pair.split(':')
  pairs[pairArr[0]] = pairArr[1]
})

httpProxy.createServer(
  hedge({
    pairs: pairs,
    realm: process.env.REALM || 'luxembourg'
  }), 
  proxiedPort, 
  proxiedHost
).listen(port, function () {
  console.log('Listening on port ' + port)
})
