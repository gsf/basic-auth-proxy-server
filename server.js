var httpProxy = require('http-proxy')

var port = process.env.PORT || 9876
// user:pass pairs must be separated by whitespace
var pairs = process.env.PAIRS || 'user:pass user2:pass2 user3:pass3'
var realm = process.env.REALM || 'luxembourg'
var proxiedHost = process.env.PROXIEDHOST || '127.0.0.1'
var proxiedPort = process.env.PROXIEDPORT || 8765

// Make an array of the user:pass pairs, base64-encoded for easy comparison
var encoded = []
pairs.split(/\s+/).forEach(function (pair) {
  encoded.push(Buffer(pair).toString('base64'))
})

httpProxy.createServer(basicAuth, proxiedPort, proxiedHost).listen(port, function () {
  console.log('Listening on port ' + port)
})

function basicAuth (req, res, next) {
  if (req.headers.authorization &&
      req.headers.authorization.substr(0, 5) == 'Basic' &&
      encoded.indexOf(req.headers.authorization.split(' ')[1]) != -1) {
    return next()
  }
  res.writeHead(401, {'WWW-Authenticate': 'Basic realm="try me"'})
  res.end()
}
