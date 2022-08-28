const {getLoggedInUserInfo, getLikedPosts, buildRSSItems} = require('../utils/tumblr')
const {buildRSSFeed} = require('../utils/rss')

module.exports = async function tumblrLikes(request, response) {
  const userInfo = await getLoggedInUserInfo();
  const posts = await getLikedPosts();

  const data = {userInfo, posts};
  const feed = buildRSSFeed({
    formatter: buildRSSItems,
    request,
    title: `Tumblr Likes for ${data.userInfo.name}`,
    description: 'wow, look at all these posts you liked',
    site_url: 'https://www.tumblr.com/likes',
    data,
  })

  response.set('Content-Type', 'text/xml; charset=utf-8')
  return response.send(feed.xml())
}
