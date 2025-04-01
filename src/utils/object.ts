/**
 * Deep clones an object with advanced options for handling special cases
 * @param obj - The object to clone
 * @param options - Optional configuration for cloning behavior
 * @returns Deep clone of the input object
 * @throws Error if object contains circular references
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * deepClone(obj) // { a: 1, b: { c: 2 } }
 */
export function deepClone<T>(
    obj: T,
    options: {
        handleCircular?: boolean;
        preservePrototype?: boolean;
        customReplacer?: (key: string, value: any) => any;
    } = {}
): T {
    const { handleCircular = false, preservePrototype = false, customReplacer } = options;
    const seen = new WeakMap();

    function clone(value: any): any {
        if (value === null || typeof value !== 'object') return value;
        
        if (seen.has(value)) {
            if (handleCircular) return seen.get(value);
            throw new Error('Circular reference detected');
        }

        const cloned = Array.isArray(value) ? [] : {} as { [K in keyof T]: any };
        seen.set(value, cloned);

        if (preservePrototype) {
            Object.setPrototypeOf(cloned, Object.getPrototypeOf(value));
        }

        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                const newValue = customReplacer ? customReplacer(key, value[key]) : value[key];
                (cloned as any)[key] = clone(newValue);
            }
        }

        return cloned;
    }

    return clone(obj);
}

/**
 * Checks if an object is empty with advanced validation options
 * @param obj - The object to check
 * @param options - Optional configuration for empty check
 * @returns True if object is considered empty
 * @example
 * isEmpty({}) // true
 * isEmpty({ a: undefined, b: null }, { ignoreNullish: true }) // true
 */
export function isEmpty(
    obj: object,
    options: {
        ignoreNullish?: boolean;
        ignoreWhitespace?: boolean;
        customValidator?: (value: any) => boolean;
    } = {}
): boolean {
    const { ignoreNullish = false, ignoreWhitespace = false, customValidator } = options;

    return Object.entries(obj).every(([_, value]) => {
        if (customValidator) return customValidator(value);
        
        if (ignoreNullish && (value === null || value === undefined)) return true;
        
        if (ignoreWhitespace && typeof value === 'string') {
            return value.trim().length === 0;
        }
        
        return value === null || value === undefined || 
               (typeof value === 'string' && value.length === 0) ||
               (Array.isArray(value) && value.length === 0) ||
               (typeof value === 'object' && Object.keys(value).length === 0);
    });
}

/**
 * Picks specified properties from an object with advanced filtering options
 * @param obj - The source object
 * @param keys - Array of keys to pick
 * @param options - Optional configuration for picking behavior
 * @returns New object with picked properties
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * pick(obj, ['a', 'b'], { filter: v => v > 1 }) // { b: 2 }
 */
export function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
    options: {
        filter?: (value: T[K]) => boolean;
        transform?: (value: T[K], key: K) => any;
        defaultValue?: any;
    } = {}
): Partial<Pick<T, K>> {
    const { filter, transform, defaultValue } = options;

    return keys.reduce((acc, key) => {
        if (key in obj) {
            const value = obj[key];
            if (!filter || filter(value)) {
                acc[key] = transform ? transform(value, key) : value;
            }
        } else if (defaultValue !== undefined) {
            acc[key] = defaultValue;
        }
        return acc;
    }, {} as Partial<Pick<T, K>>);
}

/**
 * Omits specified properties from an object with advanced filtering options
 * @param obj - The source object
 * @param keys - Array of keys to omit
 * @param options - Optional configuration for omitting behavior
 * @returns New object without omitted properties
 * @example
 * const obj = { a: 1, b: 2, c: 3 };
 * omit(obj, ['a'], { filter: v => v > 1 }) // { c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
    options: {
        filter?: (value: T[K]) => boolean;
        deep?: boolean;
    } = {}
): Omit<T, K> {
    const { filter, deep = false } = options;
    const result = { ...obj };

    function removeKeys(target: any, keysToRemove: K[]) {
        keysToRemove.forEach(key => {
            if (key in target) {
                if (!filter || filter(target[key])) {
                    delete target[key];
                }
            }
        });

        if (deep) {
            Object.values(target).forEach(value => {
                if (typeof value === 'object' && value !== null) {
                    removeKeys(value, keysToRemove);
                }
            });
        }
    }

    removeKeys(result, keys);
    return result;
}

/**
 * Merges multiple objects deeply with advanced options
 * @param objects - Array of objects to merge
 * @param options - Optional configuration for merge behavior
 * @returns Merged object
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 } };
 * merge(obj1, obj2) // { a: 1, b: { c: 2, d: 3 } }
 */
export function merge<T extends object>(
    ...objects: [T, ...T[]]
): T {
    const options: {
        arrayStrategy?: 'replace' | 'concat' | 'unique';
        customMerge?: (target: any, source: any, key: string) => any;
    } = arguments[arguments.length - 1] instanceof Object && !Array.isArray(arguments[arguments.length - 1])
        ? arguments[arguments.length - 1]
        : {};

    const { arrayStrategy = 'replace', customMerge } = options;
    const targetObjects = Array.isArray(arguments[arguments.length - 1]) ? objects : objects.slice(0, -1);

    return targetObjects.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
            const targetValue = acc[key as keyof T];
            const sourceValue = obj[key as keyof T];

            if (customMerge) {
                acc[key as keyof T] = customMerge(targetValue, sourceValue, key) as T[keyof T];
            } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                acc[key as keyof T] = (() => {
                    switch (arrayStrategy) {
                        case 'concat': return [...targetValue, ...sourceValue];
                        case 'unique': return [...new Set([...targetValue, ...sourceValue])];
                        default: return sourceValue;
                    }
                })() as T[keyof T];
            } else if (typeof sourceValue === 'object' && sourceValue !== null) {
                acc[key as keyof T] = merge(
                    targetValue as object || {},
                    sourceValue as object
                ) as T[keyof T];
            } else {
                acc[key as keyof T] = sourceValue;
            }
        });
        return acc;
    }, {} as T);
}

/**
 * Gets a value from an object using a path string with advanced options
 * @param obj - The source object
 * @param path - Dot-notation path to the value
 * @param options - Optional configuration for value retrieval
 * @returns The value at the specified path
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * get(obj, 'a.b.c') // 1
 */
export function get<T>(
    obj: Record<string, any>,
    path: string,
    options: {
        defaultValue?: T;
        separator?: string;
        validate?: (value: any) => boolean;
        transform?: (value: any) => T;
    } = {}
): T | undefined {
    const { defaultValue, separator = '.', validate, transform } = options;
    
    const value = path.split(separator).reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        return acc[part];
    }, obj);

    if (value === undefined) return defaultValue;
    
    if (validate && !validate(value)) return defaultValue;
    
    return transform ? transform(value) : value as T;
}

/**
 * Sets a value in an object using a path string with advanced options
 * @param obj - The target object
 * @param path - Dot-notation path where to set the value
 * @param value - The value to set
 * Sets a value in an object using a path string
 */
export function set<T>(obj: Record<string, any>, path: string, value: T): Record<string, any> {
    const parts = path.split('.');
    const last = parts.pop()!;
    const target = parts.reduce((acc, part) => {
        if (!(part in acc)) {
            acc[part] = {};
        }
        return acc[part];
    }, obj);
    target[last] = value;
    return obj;
} 