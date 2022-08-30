import * as API from './tumblr'
import { userInfoCache, postCache } from "./cache"

async function fromFromCacheOrDataSource(cache, key, source) {
    const data = cache.get(key);
    if (data == undefined) {
        console.log(`Cache miss for key: ${key} `)
        const fetchedData = await source();
        cache.set(key, fetchedData)
        return fetchedData
    }
    console.log(`Cache hit for key: ${key} `)
    return data
}

export const getLoggedInUserInfo = async function () {
    return fromFromCacheOrDataSource(userInfoCache, "user/self", async () => {
        return API.getLoggedInUserInfo()
    });
}

export const getBlogInfo = function (blog: string) {
    return fromFromCacheOrDataSource(userInfoCache, `user/${blog}`, async () => {
        return API.getBlogInfo(blog)
    });
}

export const getDashboardPosts = function () {
    return fromFromCacheOrDataSource(postCache, `posts/dashboard`, async () => {
        return API.getDashboardPosts()
    })
}

export const getLikedPosts = function () {
    return fromFromCacheOrDataSource(postCache, `posts/liked`, async () => {
        return API.getLikedPosts()
    })
}

export const getPosts = function getPosts(blogName) {
    return fromFromCacheOrDataSource(postCache, `posts/${blogName}`, async () => {
        return API.getPosts(blogName)
    })
}