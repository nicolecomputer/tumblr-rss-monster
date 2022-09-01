// Decorators
import Cached from "./caching"
import CallCounter from "./api-usage"

// Caches for user data
import userCache from "../cache/userCache";
import postCache from "../cache/postCache";

import type { Blog, UserInfo, Post } from "./types"

export class TumblrAPIClient {
    @Cached({ cacheKey: "user/self", cache: userCache })
    @CallCounter()
    async userInfo(client): Promise<UserInfo> {
        const response = await client.userInfo();
        return response.user
    }

    @Cached({ cacheKey: `blog`, cache: userCache })
    @CallCounter()
    async blogInfo(blogId, client): Promise<Blog> {
        const response = await client.blogInfo(blogId);
        return response.blog
    }

    @Cached({ cacheKey: `posts/blog`, cache: postCache })
    @CallCounter()
    async postsForBlog(blogId, client): Promise<Array<Post>> {
        const response = await client.blogPosts(`${blogId}.tumblr.com`, { limit: 60 })
        return response.posts
    }

    @Cached({ cacheKey: "posts/dashboard", cache: postCache })
    @CallCounter()
    async dashboardPosts(client): Promise<Array<Post>> {
        const response = await client.userDashboard({ limit: 60 })
        return response.posts
    }

    @Cached({ cacheKey: "posts/liked", cache: postCache })
    @CallCounter()
    async likedPosts(client): Promise<Array<Post>> {
        const response = await client.userLikes({ limit: 60 })
        return response.liked_posts
    }
}

const defaultClient = new TumblrAPIClient();
export default defaultClient;
