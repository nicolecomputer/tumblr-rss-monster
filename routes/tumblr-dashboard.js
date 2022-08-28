const {getLoggedInUserInfo, getDashboardPosts, buildRSSItems} = require('../utils/tumblr')
const {buildRSSFeed} = require('../utils/rss')

module.exports = async function tumblrDashboard(request, response) {
  const userInfo = await getLoggedInUserInfo();
  const posts = await getDashboardPosts();
  const data = {userInfo, posts};
  const feed = buildRSSFeed({
    formatter: buildRSSItems,
    request,
    title: `Tumblr Dashboard for ${data.userInfo.name}`,
    description: `${data.userInfo.name} follows some interesting people. this is the stuff they post on Tumblr.`,
    site_url: 'http://www.tumblr.com/dashboard',
    data,
  })

  response.set('Content-Type', 'text/xml; charset=utf-8')
  return response.send(feed.xml())
}
