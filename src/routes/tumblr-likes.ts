import Tumblr from "tumblr.js"

import { buildRSSItems } from '../utils/tumblr'
import { buildRSSFeed } from '../utils/rss'
import { getLoggedInUserInfo, getLikedPosts } from '../utils/tumblr-cached-resource'
import userStore from '../data_storage/user';

export default async function tumblrLikes(request, response) {
  try {
    const userId = request.params.userid;
    const user: any = await userStore.findById(userId);

    if (!user) {
      response.status(404).send("Couldn't find user");
    }

    var client = Tumblr.createClient({
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
      token: user.token,
      token_secret: user.tokenSecret
      // TODO: returnPromises: true,
    });

    const userInfo = await getLoggedInUserInfo(client);
    const posts = await getLikedPosts(client);

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
