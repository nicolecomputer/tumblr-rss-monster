import RSSFeed from 'rss'
import padStart from 'lodash.padstart'
import unicode from './unicode'

import { ucfirst, img, howmany, wrapHTMLMaybe } from './index'

export const buildRSSFeed = function buildRSSFeed(o) {
  const feed = new RSSFeed({
    title: o.title,
    description: o.description,
    feed_url: `http://${o.request.headers.host}${o.request.url}`,
    site_url: o.site_url,
  })

  o.formatter(o.data).forEach(function (feedItem, idx, arr) {
    return feed.item(feedItem)
  })

  return feed
}

export const buildRSSItems = function buildRSSItems(results) {
  const showLikeStatus = (results.likes == null)

  const what = (results.likes && 'likes') || (results.posts && 'posts')

  if (!what) { throw 'buildRSSItem only supports liked_posts and posts' }


  const feedItems = results[what].map(function (post, idx, arr) {

    const post_title = []
    const post_content = []
    const post_footer = ['<hr>']

    const tags = post.tags.map(t => `<a href=\'http://${post.blog_name}.tumblr.com/tagged/${encodeURIComponent(t)}\'>#${t}</a>`)

    if (post.title && post.title !== '') {
      post_title.push(post.title)
    } else {
      post_title.push(`${ucfirst(post.type)}`)
    }

    // Add reblog info
    // TODO: Handle answers specially. x answered y, x ⇄ y answered z
    if (post.reblogged_from_name) {
      let reblog_src = post.reblogged_from_name
      if (post.reblogged_root_name !== post.reblogged_from_name) {
        reblog_src = `${post.reblogged_from_name} … ${post.reblogged_root_name}`
      }
      // else

      post_title.push(`${post.blog_name} ${unicode.reblogIcon} ${reblog_src}`)
    } else {
      if (post.type === 'answer') {
        post_title.push(`${post.blog_name} ${unicode.answerIcon} ${post.asking_name}`)
      } else {
        post_title.push(`${post.blog_name}`)
      }
    }

    post_footer.push(`<p>${howmany(post.note_count, 'note', 'notes')}</p>`)
    if (tags.length > 0) {
      post_footer.push(`<p>${tags.join(', ')}</p>`)
    }

    if (post.source_url) {
      post_footer.push(`<p>Source: <a href="${post.source_url}">${post.source_title}</a></p>`)
    }

    if (post.liked && showLikeStatus) {
      post_footer.push(`<p>${unicode.check} Liked</p>`)
    }

    // tumblr://x-callback-url/blog?blogName=tumblr-username
    // tumblr://x-callback-url/blog?blogName=tumblr-username&postID=post-id
    const tumblrPostURL = `http://www.tumblr.com/open/app?app_args=blog%3FblogName%3D${post.blog_name}%26page%3Dpermalink%26postID%3D${post.id}`
    post_footer.push(`<p><a href="${tumblrPostURL}">View in Tumblr app</a></p>`)

    switch (post.type) {
      case 'photo':
      case 'link': {
        const desc = []

        if (post.caption) { desc.push(`${post.caption}`.trim()) }

        // Link posts
        if (post.description) { desc.push(`${post.description}`.trim()) }
        if (post.excerpt) { desc.push(`${post.excerpt}`.trim()) }

        if (post.photos) {
          return post.photos.map(function (p, idx, arr) {
            let titleSuffix = ''
            if (arr.length > 1) {
              titleSuffix = ` (${idx + 1} of ${arr.length})`
            }

            p.title = post_title.join(` ${unicode.bullet} `) + titleSuffix

            const photo_desc = desc.slice(0)

            // Photo posts
            if (p.caption && p.caption !== '') {
              photo_desc.unshift(wrapHTMLMaybe(p.caption, 'p'))
            }

            p.desc = [].concat(
              '<div>',
              img(p.original_size.url, p.original_size.width, p.original_size.height),
              '</div>',
              photo_desc,
              photo_desc.length > 0 ? post_footer : post_footer.slice(1, post_footer.length),
              `<p>Post URL: <a href='${post.post_url}'>${post.post_url}</a></p>`
            ).join('\n\n')

            p.guid = p.original_size.url
            p.date = new Date(post.date)

            // post_date = new Date(post.date)
            // p.date = new Date(post_date.getTime() + idx * 1000)

            return p
          }).reverse().map(p =>
          ({
            title: p.title,
            description: p.desc,
            url: p.original_size.url,
            guid: p.guid,
            categories: post.tags,
            author: post.blog_name,
            date: p.date,
          }))
        } else {
          if (post.type === 'link') {
            post_content.push(desc)

            post_content.push(`<a href='${post.url}'>Link</a>`)

          } else {
            post_content.push('<p><strong>Empty Photo Post :....(</strong></p>')
          }
        }
        break
      }

      case 'text':
        post_content.push(post.body)
        break

      case 'quote':
        post_content.push(wrapHTMLMaybe(post.text, 'p'))
        post_content.push(`<p>${unicode.mdash}${unicode.thinsp}${post.source}</p>`)
        break

      case 'chat':
        post_content.push('<table>')

        post.dialogue.forEach(line =>
          post_content.push(
            `<tr>
  <th align=left>${line.name}</th>
  <td>${line.phrase}</td>
</tr>`
          )
        )

        post_content.push('</table>')
        break

      case 'audio':
        post_content.push(post.player)
        post_content.push(post.caption)
        break

      case 'video':
        post_content.push(post.player.pop().embed_code)
        break

      case 'answer': {
        const avatarSize = 128

        let asker

        if (post.asking_name === 'Anonymous') {
          asker = [
            img(
              `https://secure.assets.tumblr.com/images/anonymous_avatar_${avatarSize}.gif`,
              avatarSize,
              avatarSize,
              { style: 'vertical-align: middle' }
            ),
            post.asking_name,
          ].join('')
        } else {
          asker = [
            `<a href="${post.asking_url}">`,
            img(
              `http://api.tumblr.com/v2/blog/${post.asking_name}.tumblr.com/avatar/${avatarSize}`,
              avatarSize,
              avatarSize,
              { style: 'vertical-align: middle' }
            ),
            post.asking_name,
            '</a>',
          ].join('')
        }

        post_content.push(`<blockquote><p><strong>${asker}</strong>: ${post.question}</p></blockquote>`)
        post_content.push(post.answer)
        break
      }

      default:
        post_content.push(`${ucfirst(post.type)} posts not supported (yet!)`)
    }


    return {
      title: post_title.join(` ${unicode.bullet} `),
      description: [].concat(
        post_content,
        post_footer
      ).join('\n\n'),
      url: post.post_url,
      guid: post.post_url,
      categories: post.tags,
      author: post.blog_name,
      date: post.date,
    }
  })

  return Array.prototype.concat.apply([], feedItems)
}
