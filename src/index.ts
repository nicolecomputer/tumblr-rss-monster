import * as dotenv from 'dotenv'
dotenv.config()

import express from "express"

import tumblrDashboard from "./routes/tumblr-dashboard";
import tumblrLikes from "./routes/tumblr-likes";
import tumblrUser from "./routes/tumblr-user"

const server = express()

const routes = {
    'tumblr-dashboard.rss': 'tumblr-dashboard',
    'tumblr-likes.rss': 'tumblr-likes',
    'tumblr-user/:userid/feed.rss': 'tumblr-user',
}


server.set('port', 6969)

server.use('/', function (request, response, next) {
    console.log(`${new Date} - ${request.originalUrl}`)
    next()
})

// RSS Routes
server.get('/tumblr-dashboard.rss', tumblrDashboard);
server.get('/tumblr-likes.rss', tumblrLikes)
server.get('/tumblr-user/:userid/feed.rss', tumblrUser)


const localURL = `http://localhost:${server.get('port')}`

console.log('============')
console.log('AVAILABLE PATHS')

server._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        const route = r.route.path;
        console.log(`${localURL}${route}`)
    }
});

console.log('============')

server.listen(6969)
