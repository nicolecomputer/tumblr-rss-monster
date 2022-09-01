export default function Cached({ cacheKey, cache }: { cacheKey: string, cache: any }) {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const childFunction = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            var computedCacheKey = cacheKey
            if (['blogInfo', 'postsForBlog'].includes(key.toString())) {
                computedCacheKey = `${cacheKey}/${args[0]}`
            }
            return cache.wrap(computedCacheKey, async () => {
                return childFunction.apply(this, args);
            })

        };
        return descriptor;
    };
}
