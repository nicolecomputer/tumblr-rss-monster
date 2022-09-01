import Tumblr, { TumblrClient } from "tumblr.js"

import config from "../config/config";
import userStore from '../data_storage/user';

export function clientForUser(user): TumblrClient {
    return Tumblr.createClient({
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        token: user.token,
        token_secret: user.tokenSecret,
        returnPromises: true,
    });
}
export class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotFoundError";
    }
}

export async function userFromRequest(request) {
    const userId = request.params.userid;
    const user: any = await userStore.findById(userId);

    if (!user) {
        throw new UserNotFoundError(`Couldn't find user ${userId}`)
    }

    return user
}

export async function configuredClientFromRequest(request) {
    const user = await userFromRequest(request);
    return clientForUser(user);
}
