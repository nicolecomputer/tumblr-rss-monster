// TODO: This needs to be stored off in the database
// TODO: This needs to know which user we're keeping track of
var callCount = 0
export default function CallCounter() {
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
