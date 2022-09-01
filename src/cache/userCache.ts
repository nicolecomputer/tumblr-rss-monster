import cacheManager from 'cache-manager';
import fsStore from 'cache-manager-fs-hash';

import config from "../config/config";

const userCache = cacheManager.caching({
    store: fsStore,
    options: {
        path: `${config.storage_root}/cache`,
        ttl: 60 * 60 * 24,
    }
});

export default userCache;
