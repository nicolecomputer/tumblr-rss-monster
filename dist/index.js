var express = require('express');
var server = express();
require('dotenv').config();
var routes = {
    'tumblr-dashboard.rss': 'tumblr-dashboard',
    'tumblr-likes.rss': 'tumblr-likes',
    'tumblr-user/:userid/feed.rss': 'tumblr-user',
};
server.set('port', 6969);
server.use('/', function (request, response, next) {
    console.log("".concat(new Date, " - ").concat(request.originalUrl));
    next();
});
var localURL = "http://localhost:".concat(server.get('port'), "/");
console.log('============');
console.log('AVAILABLE PATHS');
for (var route in routes) {
    var handler = routes[route];
    console.log("".concat(localURL).concat(route));
    server.get("/".concat(route), require("./routes/".concat(handler)));
}
console.log('============');
server.listen(6969);
