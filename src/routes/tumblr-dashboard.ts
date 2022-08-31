import Tumblr, { TumblrClient } from "tumblr.js"

import config from "../config/config";
import userStore from '../data_storage/user';
import API from "../tumblr-api/base";

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

async function configuredClientFromRequest(request) {
  const user = await userFromRequest(request);
  return clientForUser(user);
}

export default async function tumblrDashboard(request, response) {
  try {
    const configuredClient = await configuredClientFromRequest(request)
    const userInfo = await API.userInfo(configuredClient)
    const posts = await API.dashboardPosts(configuredClient);

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
    console.log(error)
    // TODO: Extract this out to middleware - all requests are going to have this in common
    if (error.name === "UserNotFoundError") {
      response.status(404).send(error.message);
      return
    }

    response.status(500).send("Something went wrong");
    return
  }
}
