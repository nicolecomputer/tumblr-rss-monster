const RSSFeed = require('rss')
const padStart = require('lodash.padstart')

export const buildRSSFeed = function buildRSSFeed(o) {
  const feed = new RSSFeed({
    title: o.title,
    description: o.description,
    feed_url: `http://${o.request.headers.host}${o.request.url}`,
    site_url: o.site_url,
  })

  o.formatter(o.data).forEach(function (feedItem, idx, arr) {
    return feed.item(feedItem)
  })

  return feed
}
