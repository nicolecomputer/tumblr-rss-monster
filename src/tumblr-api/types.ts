
export type Blog = {
    name: string,
    title: string,
    description: string,
    url: string,
    uuid: string,
    updated: number
};

export type UserInfo = {
    name: string,
    likes: number,
    following: number,
    default_post_format: string,
    blogs: Array<Blog>
}

export type Tag = any;

export type Post = {
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

