// TODO: Remove all of these implementations
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

export const getLoggedInUserInfo = async function (client) {
    return fromFromCacheOrDataSource(userInfoCache, "user/self", async () => {
        return API.getLoggedInUserInfo(client)
    });
}

export const getBlogInfo = function (blog: string) {
    return fromFromCacheOrDataSource(userInfoCache, `user/${blog}`, async () => {
        return API.getBlogInfo(blog)
    });
}

export const getDashboardPosts = function (client) {
    return fromFromCacheOrDataSource(postCache, `posts/dashboard`, async () => {
        return API.getDashboardPosts(client)
    })
}

export const getLikedPosts = function (client) {
    return fromFromCacheOrDataSource(postCache, `posts/liked`, async () => {
        return API.getLikedPosts(client)
    })
}

export const getPosts = function getPosts(blogName) {
    return fromFromCacheOrDataSource(postCache, `posts/${blogName}`, async () => {
        return API.getPosts(blogName)
    })
}
