const { getBlogInfo, getPosts, buildRSSItems } = require('../utils/tumblr')
const { buildRSSFeed } = require('../utils/rss')

module.exports = async function (request, response) {
  const blogId = request.params.userid;
  console.log(`Loading posts for ${blogId}.tumblr.com`)


  const blogInfo = await getBlogInfo(blogId);
  const posts = await getPosts(blogId);

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
  return response.send(feed.xml())
}
