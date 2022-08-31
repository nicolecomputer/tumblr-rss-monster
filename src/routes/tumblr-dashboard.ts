import Tumblr from "tumblr.js"

import { buildRSSItems } from '../utils/tumblr'
import { getLoggedInUserInfo, getDashboardPosts } from '../utils/tumblr-cached-resource'
import userStore from '../data_storage/user';
import config from "../config/config";
const { buildRSSFeed } = require('../utils/rss')

export default async function tumblrDashboard(request, response) {
  try {
    const userId = request.params.userid;
    const user: any = await userStore.findById(userId);

    if (!user) {
      response.status(404).send("Couldn't find user");
      return
    }

    var client = Tumblr.createClient({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      token: user.token,
      token_secret: user.tokenSecret
      // TODO: returnPromises: true,
    });

    const userInfo = await getLoggedInUserInfo(client);
    const posts = await getDashboardPosts(client);

    const data = { userInfo, posts };
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
  } catch (error) {
    console.error(error)
    response.status(500).send("Something went wrong");
  }
}
