import Tumblr, { TumblrClient } from "tumblr.js"

import config from "../config/config";
import userStore from '../data_storage/user';
import userCache from "../cache/userCache";
import postCache from "../cache/postCache";

import { buildRSSFeed } from '../utils/rss';
import { buildRSSItems } from '../utils/tumblr'

function clientForUser(user): TumblrClient {
  return Tumblr.createClient({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    token: user.token,
    token_secret: user.tokenSecret,
    returnPromises: true,
  });
}

const ApiWithCaching = {
  userInfo: async (client: TumblrClient): Promise<{ name: string }> => {
    const userInfoResponse = await userCache.wrap("user/self", async () => {
      // @ts-ignore: Promises are promised
      return client.userInfo()
    })
    return userInfoResponse.user
  },

  dashboardPosts: async (client: TumblrClient): Promise<any> => {
    const postResponse = await postCache.wrap(`posts/dashboard`, async () => {
      // @ts-ignore: Promises are promised
      return client.userDashboard({ limit: 60 })
    })
    return postResponse.posts;
  }
}

class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

async function userFromRequest(request) {
  const userId = request.params.userid;
  const user: any = await userStore.findById(userId);

  if (!user) {
    throw new UserNotFoundError(`Couldn't find user ${userId}`)
  }

  return user
}

export default async function tumblrDashboard(request, response) {
  try {
    const user = await userFromRequest(request);
    const cachedTumblrClient = clientForUser(user);
    const userInfo = await ApiWithCaching.userInfo(cachedTumblrClient);
    const posts = await ApiWithCaching.dashboardPosts(cachedTumblrClient);

    const feed = buildRSSFeed({
      formatter: buildRSSItems,
      request,
      title: `Tumblr Dashboard for ${userInfo.name}`,
      description: `${userInfo.name}'s Tumblr dashboard`,
      site_url: 'http://www.tumblr.com/dashboard',
      data: { userInfo, posts },
    })

    response.set('Content-Type', 'text/xml; charset=utf-8')
    response.send(feed.xml())

    return
  } catch (error) {
    // TODO: Extract this out to middleware - all requests are going to have this in common
    if (error.name === "UserNotFoundError") {
      response.status(404).send(error.message);
      return
    }

    response.status(500).send("Something went wrong");
    return
  }
}
