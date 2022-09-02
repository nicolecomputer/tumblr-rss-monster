import API from "../tumblr-api";
import { clientForUser } from "../utils/user"

import { buildRSSFeed, buildRSSItems } from '../utils/rss'
import userStore from "../data_storage/user";


export default async function (request, response, next) {
  try {
    const blogId = request.params.blogId;

    const user = await userStore.anyUser()
    const configuredClient = await clientForUser(user);

    const blogInfo = await API.blogInfo(blogId, configuredClient);
    const posts = await API.postsForBlog(blogId, configuredClient);

    const data = { blogInfo, posts };
    const feed = buildRSSFeed({
      formatter: buildRSSItems,
      request,
      title: `${data.blogInfo.name} posts`,
      description: `Posts from ${data.blogInfo.name}`,
      site_url: `https://${blogId}.tumblr.com`,
      data,
    })

    response.set('Content-Type', 'text/xml; charset=utf-8')
    response.send(feed.xml())
  } catch (error) {
    next(error)
  }
}
