import API from "../tumblr-api";
import { configuredClientFromRequest } from "../utils/user"

import { buildRSSFeed, buildRSSItems } from '../utils/rss'


export default async function (request, response, next) {
  try {
    const blogId = request.params.blogId;

    const configuredClient = await configuredClientFromRequest(request)
    const blogInfo = await API.blogInfo(blogId, configuredClient);
    const posts = await API.postsForBlog(blogId, configuredClient);

    const data = { blogInfo, posts };
    const feed = buildRSSFeed({
      formatter: buildRSSItems,
      request,
      title: `${data.blogInfo.name} posts`,
      description: 'wow, look at all these posts',
      site_url: `https://${blogId}.tumblr.com`,
      data,
    })

    response.set('Content-Type', 'text/xml; charset=utf-8')
    response.send(feed.xml())
  } catch (error) {
    next(error)
  }
}
