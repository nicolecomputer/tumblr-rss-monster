import { buildRSSItems } from '../utils/tumblr'
import { buildRSSFeed } from '../utils/rss'
import { getLoggedInUserInfo, getLikedPosts } from '../utils/tumblr-cached-resource'

module.exports = async function tumblrLikes(request, response) {
  try {
    // TODO: Cache this request, it is stable and only needs to be called once per day
    const userInfo = await getLoggedInUserInfo();
    const posts = await getLikedPosts();

    const data = { userInfo, posts };
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
  } catch (error) {
    console.error(error)
    response.status(500).send("Something went wrong");
  }
}
