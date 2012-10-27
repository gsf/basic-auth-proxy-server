var hedge = require('hedge')
var proxy = require('http-proxy')


// user:pass pairs must be separated by whitespace
var pairStr = process.env.PAIRS || 'user:pass user2:pass2 user3:pass3'
var port = process.env.PORT || 9876
var proxiedHost = process.env.PROXIEDHOST || '127.0.0.1'
// PROXIEDPORT must be converted to a number. See
// https://github.com/nodejitsu/node-http-proxy/issues/321
var proxiedPort = +process.env.PROXIEDPORT || 8765
var realm = process.env.REALM || 'luxembourg'

// set up validate function to pass to hedge
var pairs = {}
pairStr.split(/\s+/).forEach(function (pair) {
  var userPass = pair.split(':')
  pairs[userPass[0]] = userPass[1]
})
function validate (username, password, cb) {
  if (pairs[username] === password) return cb()
  cb(new Error('No match'))
}

proxy.createServer(
  hedge({realm: realm, validate: validate}), 
  proxiedPort, 
  proxiedHost
).listen(port, function () {
  console.log('Proxying from port '+port+' to '+proxiedHost+':'+proxiedPort)
})
