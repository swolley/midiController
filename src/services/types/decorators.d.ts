/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-types
export function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

// // eslint-disable-next-line @typescript-eslint/ban-types
// export function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
//     const existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
//     existingRequiredParameters.push(parameterIndex);
//     Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
// }

export function Listener<I extends ObjectListener<any>>(listener: I) {
    return function <T extends { new (...constructorArgs: any[]) }>(constructorFunction: T) {
        //new constructor function
        const newConstructorFunction: any = function (...args) {
            const func: any = function () {
                return new constructorFunction(...args);
            };
            func.prototype = constructorFunction.prototype;
            const result: any = new func();
            listener.onObjectCreation(result);
            return result;
        };
        newConstructorFunction.prototype = constructorFunction.prototype;
        return newConstructorFunction;
    };
}

interface ObjectListener<T> {
    onObjectCreation(t: T): void;
}

export class MyObjectListener implements ObjectListener<any> {
    onObjectCreation(obj: any) {
        console.info("Object created: " + JSON.stringify(obj));
    }
}
