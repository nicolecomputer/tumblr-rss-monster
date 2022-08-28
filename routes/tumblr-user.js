const {getBlogInfo, getPosts, buildRSSItems} = require('../utils/tumblr')
const {buildRSSFeed} = require('../utils/rss')

module.exports = async function(request, response) {
  const blogId = request.params.userid;
  console.log(`Loading posts for ${blogId}.tumblr.com`)


  const blogInfo = await getBlogInfo(blogId);
  console.log(blogInfo)
  const posts = await getPosts(blogId);

  const data = {blogInfo, posts};
  const feed = buildRSSFeed({
    formatter: buildRSSItems,
    request,
    title: `Tumblr Likes for ${data.blogInfo.name}`,
    description: 'wow, look at all these posts you liked',
    site_url: 'https://www.tumblr.com/likes',
    data,
  })

  response.set('Content-Type', 'text/xml; charset=utf-8')
  return response.send(feed.xml())

  // return Promise.all([
  //   getBlogInfo(request.params.userid),
  //   getPosts(request.params.userid, request.query.post_count),
  // ]).then(function([userInfo, posts]) {
  //   const data = {userInfo, posts}
  //   const feed = buildRSSFeed({
  //     formatter: buildRSSItems,
  //     request,
  //     title: `Tumblr posts for ${data.userInfo.name}`,
  //     description: 'wow, look at all these posts',
  //     site_url: `https://${request.params.userid}.tumblr.com`,
  //     data,
  //   })

  //   response.set('Content-Type', 'text/xml; charset=utf-8')
  //   return response.send(feed.xml())
  // }, function(err) {
  //   response.set('Content-Type', 'text/plain; charset=utf-8')
  //   return response.send(err)
  // })
}
