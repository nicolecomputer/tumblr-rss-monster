var RSSFeed = require('rss');
var padStart = require('lodash.padstart');
exports.buildRSSFeed = function buildRSSFeed(o) {
    var feed = new RSSFeed({
        title: o.title,
        description: o.description,
        feed_url: "http://".concat(o.request.headers.host).concat(o.request.url),
        site_url: o.site_url,
    });
    o.formatter(o.data).forEach(function (feedItem, idx, arr) {
        console.log("- Feed item ".concat(padStart(idx + 1, "".concat(arr.length).length, ' '), " of ").concat(arr.length, ": ").concat(feedItem.title, " (").concat(feedItem.date, ")"));
        return feed.item(feedItem);
    });
    return feed;
};
