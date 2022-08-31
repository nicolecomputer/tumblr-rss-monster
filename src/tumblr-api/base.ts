import userCache from "../cache/userCache";
import postCache from "../cache/postCache";

var callCount = 0
function CallCounter() {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = (...args: any[]) => {
            callCount += 1
            return childFunction.apply(this, args);
        };
        return descriptor;
    };
}

function Cached({ key, cache }: { key: string, cache: any }) {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            return cache.wrap(key, async () => {
                return childFunction.apply(this, args);
            }, { ttl: 0 })

        };
        return descriptor;
    };
}

type Blog = {
    name: string,
    title: string,
    description: string,
    url: string,
    uuid: string,
    updated: number
};

type UserInfoResponse = {
    name: string,
    likes: number,
    following: number,
    default_post_format: string,
    blogs: Array<Blog>
}

type Tag = any;

type Post = {
    type: string,
    blog_name: string,
    blog: Blog,
    id: string,
    id_string: string,
    post_url: string,
    slug: string,
    date: string,
    timestamp: number,
    state: string,
    format: string,
    reblog_key: string,
    tags: Array<Tag>,
    short_url: string,
    summary: string,
    should_open_in_legacy: boolean,
    recommended_source: string | null,
    recommended_color: string | null,
    followed: boolean,
    liked: boolean,
    note_count: number,
    title: string,
    body: string,
    reblog: any,
    trail: Array<any>,
    can_like: boolean,
    interactability_reblog: string,
    can_reblog: boolean,
    can_send_in_message: boolean,
    can_reply: boolean,
    display_avatar: boolean
}


export class TumblrAPIClient {
    @Cached({ key: "user/self", cache: userCache })
    @CallCounter()
    async userInfo(client): Promise<UserInfoResponse> {
        const response = await client.userInfo();
        return response.user
    }

    @Cached({ key: "posts/dashboard", cache: postCache })
    @CallCounter()
    async dashboardPosts(client): Promise<Array<Post>> {
        const response = await client.userDashboard({ limit: 60 })
        console.log(response.posts[0])
        return response.posts
    }

    @Cached({ key: "posts/liked", cache: postCache })
    @CallCounter()
    async likedPosts(client): Promise<Array<Post>> {
        const response = await client.userLikes({ limit: 60 })
        console.log(response.liked_posts[0])
        return response.liked_posts
    }

}

const defaultClient = new TumblrAPIClient();
export default defaultClient;
