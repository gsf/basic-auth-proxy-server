//var httpAuth = require('http-auth')
var httpProxy = require('http-proxy')

var port = process.env.PORT || 9876
var pairs = process.env.PAIRS || 'user:pass user2:pass2 user3:pass3'
var encoded = []
pairs.split(' ').forEach(function (pair) {
  encoded.push(Buffer(pair).toString('base64'))
})

httpProxy.createServer(basicAuth, 9200, '127.0.0.1').listen(port, function () {
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
