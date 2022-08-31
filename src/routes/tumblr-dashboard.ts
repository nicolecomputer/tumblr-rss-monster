import API from "../tumblr-api/base";
import { configuredClientFromRequest } from "../utils/user"

import { buildRSSFeed } from '../utils/rss';
import { buildRSSItems } from '../utils/tumblr'

export default async function tumblrDashboard(request, response, next) {
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
  } catch (error) {
    next(error)
  }
}
