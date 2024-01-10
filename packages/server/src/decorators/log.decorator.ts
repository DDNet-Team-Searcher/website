//NOTE: you can use this decorator only if a class you use it in have a property logger.
//otherewise you will break everything.
export const log = (title: string) => {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            this.logger.verbose(title + '- [START]');

            const result = originalMethod.apply(this, args);

            this.logger.verbose(title + '- [END]');

            return result;
        };

        return descriptor;
    };
};
