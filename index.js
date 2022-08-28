const express = require('express')

const server = express()

require('dotenv').config()

const routes = {
  'tumblr-dashboard.rss':         'tumblr-dashboard',
  'tumblr-likes.rss':             'tumblr-likes',
  'tumblr-user/:userid/feed.rss': 'tumblr-user',
}

server.set('port', 6969)

server.use('/', function(request, response, next) {
  console.log(`${new Date} - ${request.originalUrl}`)
  next()
})

const localURL = `http://localhost:${server.get('port')}/`

console.log('============')
console.log('AVAILABLE PATHS')

  for (const route in routes) {
    const handler = routes[route]
    console.log(`${localURL}${route}`)
    server.get(`/${route}`, require(`./routes/${handler}`))
  }

console.log('============')

server.listen(6969)
