"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRSSItems = exports.getPosts = exports.getLikedPosts = exports.getDashboardPosts = exports.getBlogInfo = exports.getLoggedInUserInfo = void 0;
var tumblr_js_1 = __importDefault(require("tumblr.js"));
var padStart = require('lodash.padstart');
var unicode = require('./unicode');
var _a = require('./index'), ucfirst = _a.ucfirst, img = _a.img, howmany = _a.howmany, wrapHTMLMaybe = _a.wrapHTMLMaybe;
// Setup a singleton client for this file
var client = tumblr_js_1.default.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET
});
var getLoggedInUserInfo = function () {
    return new Promise(function (resolve, reject) {
        client.userInfo(function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data.user);
            }
        });
    });
};
exports.getLoggedInUserInfo = getLoggedInUserInfo;
var getBlogInfo = function (blog) {
    return new Promise(function (resolve, reject) {
        client.blogInfo(blog, function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data.blog);
            }
        });
    });
};
exports.getBlogInfo = getBlogInfo;
var getDashboardPosts = function () {
    return new Promise(function (resolve, reject) {
        client.userDashboard({ limit: 60 }, function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data.posts);
            }
        });
    });
};
exports.getDashboardPosts = getDashboardPosts;
var getLikedPosts = function () {
    return new Promise(function (resolve, reject) {
        client.userLikes({ limit: 60 }, function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data.liked_posts);
            }
        });
    });
};
exports.getLikedPosts = getLikedPosts;
var getPosts = function getPosts(blogName) {
    return new Promise(function (resolve, reject) {
        client.blogPosts("".concat(blogName, ".tumblr.com"), { limit: 60 }, function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(data.posts);
            }
        });
    });
};
exports.getPosts = getPosts;
var buildRSSItems = function buildRSSItems(results) {
    var showLikeStatus = (results.likes == null);
    var what = (results.likes && 'likes') || (results.posts && 'posts');
    if (!what) {
        throw 'buildRSSItem only supports liked_posts and posts';
    }
    console.log("LOADING ".concat(results[what].length, " ").concat(what.toUpperCase()));
    console.log('====================');
    var feedItems = results[what].map(function (post, idx, arr) {
        console.log("- Post ".concat(padStart(idx + 1, "".concat(arr.length).length, ' '), " of ").concat(arr.length, ": ").concat(padStart(post.id, 13, ' '), " (").concat(post.type, ")"));
        var post_title = [];
        var post_content = [];
        var post_footer = ['<hr>'];
        var tags = post.tags.map(function (t) { return "<a href='http://".concat(post.blog_name, ".tumblr.com/tagged/").concat(encodeURIComponent(t), "'>#").concat(t, "</a>"); });
        if (post.title && post.title !== '') {
            post_title.push(post.title);
        }
        else {
            post_title.push("".concat(ucfirst(post.type)));
        }
        // Add reblog info
        // TODO: Handle answers specially. x answered y, x ⇄ y answered z
        if (post.reblogged_from_name) {
            var reblog_src = post.reblogged_from_name;
            if (post.reblogged_root_name !== post.reblogged_from_name) {
                reblog_src = "".concat(post.reblogged_from_name, " \u2026 ").concat(post.reblogged_root_name);
            }
            // else
            //   console.log 'post author is the same as reblogger'
            post_title.push("".concat(post.blog_name, " ").concat(unicode.reblogIcon, " ").concat(reblog_src));
        }
        else {
            if (post.type === 'answer') {
                post_title.push("".concat(post.blog_name, " ").concat(unicode.answerIcon, " ").concat(post.asking_name));
            }
            else {
                post_title.push("".concat(post.blog_name));
            }
        }
        post_footer.push("<p>".concat(howmany(post.note_count, 'note'), "</p>"));
        if (tags.length > 0) {
            post_footer.push("<p>".concat(tags.join(', '), "</p>"));
        }
        if (post.source_url) {
            post_footer.push("<p>Source: <a href=\"".concat(post.source_url, "\">").concat(post.source_title, "</a></p>"));
        }
        if (post.liked && showLikeStatus) {
            post_footer.push("<p>".concat(unicode.check, " Liked</p>"));
        }
        // tumblr://x-callback-url/blog?blogName=tumblr-username
        // tumblr://x-callback-url/blog?blogName=tumblr-username&postID=post-id
        var tumblrPostURL = "http://www.tumblr.com/open/app?app_args=blog%3FblogName%3D".concat(post.blog_name, "%26page%3Dpermalink%26postID%3D").concat(post.id);
        post_footer.push("<p><a href=\"".concat(tumblrPostURL, "\">View in Tumblr app</a></p>"));
        switch (post.type) {
            case 'photo':
            case 'link': {
                var desc_1 = [];
                if (post.caption) {
                    desc_1.push("".concat(post.caption).trim());
                }
                // Link posts
                if (post.description) {
                    desc_1.push("".concat(post.description).trim());
                }
                if (post.excerpt) {
                    desc_1.push("".concat(post.excerpt).trim());
                }
                if (post.photos) {
                    return post.photos.map(function (p, idx, arr) {
                        var titleSuffix = '';
                        if (arr.length > 1) {
                            titleSuffix = " (".concat(idx + 1, " of ").concat(arr.length, ")");
                        }
                        p.title = post_title.join(" ".concat(unicode.bullet, " ")) + titleSuffix;
                        var photo_desc = desc_1.slice(0);
                        // Photo posts
                        if (p.caption && p.caption !== '') {
                            photo_desc.unshift(wrapHTMLMaybe(p.caption, 'p'));
                        }
                        p.desc = [].concat('<div>', img(p.original_size.url, p.original_size.width, p.original_size.height), '</div>', photo_desc, photo_desc.length > 0 ? post_footer : post_footer.slice(1, post_footer.length), "<p>Post URL: <a href='".concat(post.post_url, "'>").concat(post.post_url, "</a></p>")).join('\n\n');
                        p.guid = p.original_size.url;
                        p.date = new Date(post.date);
                        // post_date = new Date(post.date)
                        // p.date = new Date(post_date.getTime() + idx * 1000)
                        console.log(JSON.stringify(p, null, '  '));
                        return p;
                    }).reverse().map(function (p) {
                        return ({
                            title: p.title,
                            description: p.desc,
                            url: p.original_size.url,
                            guid: p.guid,
                            categories: post.tags,
                            author: post.blog_name,
                            date: p.date,
                        });
                    });
                }
                else {
                    console.log("!!! ".concat(post.type, " without photos"));
                    if (post.type === 'link') {
                        post_content.push(desc_1);
                        post_content.push("<a href='".concat(post.url, "'>Link</a>"));
                    }
                    else {
                        post_content.push('<p><strong>Empty Photo Post :....(</strong></p>');
                    }
                }
                break;
            }
            case 'text':
                post_content.push(post.body);
                break;
            case 'quote':
                post_content.push(wrapHTMLMaybe(post.text, 'p'));
                post_content.push("<p>".concat(unicode.mdash).concat(unicode.thinsp).concat(post.source, "</p>"));
                break;
            case 'chat':
                post_content.push('<table>');
                post.dialogue.forEach(function (line) {
                    return post_content.push("<tr>\n  <th align=left>".concat(line.name, "</th>\n  <td>").concat(line.phrase, "</td>\n</tr>"));
                });
                post_content.push('</table>');
                break;
            case 'audio':
                post_content.push(post.player);
                post_content.push(post.caption);
                break;
            case 'video':
                post_content.push(post.player.pop().embed_code);
                break;
            case 'answer': {
                var avatarSize = 128;
                var asker = void 0;
                if (post.asking_name === 'Anonymous') {
                    asker = [
                        img("https://secure.assets.tumblr.com/images/anonymous_avatar_".concat(avatarSize, ".gif"), avatarSize, avatarSize, { style: 'vertical-align: middle' }),
                        post.asking_name,
                    ].join('');
                }
                else {
                    asker = [
                        "<a href=\"".concat(post.asking_url, "\">"),
                        img("http://api.tumblr.com/v2/blog/".concat(post.asking_name, ".tumblr.com/avatar/").concat(avatarSize), avatarSize, avatarSize, { style: 'vertical-align: middle' }),
                        post.asking_name,
                        '</a>',
                    ].join('');
                }
                post_content.push("<blockquote><p><strong>".concat(asker, "</strong>: ").concat(post.question, "</p></blockquote>"));
                post_content.push(post.answer);
                break;
            }
            default:
                console.log("Unsupported post type: ".concat(post.type));
                post_content.push("".concat(ucfirst(post.type), " posts not supported (yet!)"));
        }
        return {
            title: post_title.join(" ".concat(unicode.bullet, " ")),
            description: [].concat(post_content, post_footer).join('\n\n'),
            url: post.post_url,
            guid: post.post_url,
            categories: post.tags,
            author: post.blog_name,
            date: post.date,
        };
    });
    return Array.prototype.concat.apply([], feedItems);
};
exports.buildRSSItems = buildRSSItems;
