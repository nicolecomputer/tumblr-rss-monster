// TODO: Replace all of this- I'm using a different cache manager
// TODO: Remove NodeCache
import NodeCache from "node-cache"

export const userInfoCache = new NodeCache({ stdTTL: 60 * 60 * 24, maxKeys: 1000 });
export const postCache = new NodeCache({ stdTTL: 60 * 60, maxKeys: 1000 });
