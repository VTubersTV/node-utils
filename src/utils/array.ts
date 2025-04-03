/**
 * Removes duplicate values from an array with optional comparison function
 * @param arr - The input array to deduplicate
 * @param compareFn - Optional custom comparison function
 * @param options - Optional configuration for deduplication
 * @returns Array with unique values
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 1}], (a, b) => a.id === b.id) // [{id: 1}]
 */
export function unique<T>(
    arr: T[],
    compareFn?: (a: T, b: T) => boolean,
    options: { preserveOrder?: boolean } = { preserveOrder: true }
): T[] {
    if (!compareFn) {
        return [...new Set(arr)];
    }

    const result: T[] = [];
    const seen = new Set<T>();

    for (const item of arr) {
        const isDuplicate = result.some(existing => compareFn(existing, item));
        if (!isDuplicate) {
            result.push(item);
        }
    }

    return options.preserveOrder ? result : [...new Set(result)];
}

/**
 * Shuffles an array using the Fisher-Yates algorithm with optional seed
 * @param arr - The input array to shuffle
 * @param options - Optional configuration for shuffling
 * @returns Shuffled array
 * @example
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 4, 2, 5]
 */
export function shuffle<T>(
    arr: T[],
    options: { seed?: number; inPlace?: boolean } = { inPlace: false }
): T[] {
    const result = options.inPlace ? arr : [...arr];
    const seed = options.seed || Math.random();
    let random = seed;

    for (let i = result.length - 1; i > 0; i--) {
        random = (random * 16807) % 2147483647;
        const j = Math.floor(random * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

/**
 * Groups array elements by a key function with advanced grouping options
 * @param arr - The input array to group
 * @param keyFn - Function to generate group keys
 * @param options - Optional configuration for grouping
 * @returns Map of grouped elements
 * @example
 * groupBy([{type: 'A'}, {type: 'B'}], item => item.type)
 */
export function groupBy<T, K>(
    arr: T[],
    keyFn: (item: T) => K,
    options: {
        sortKeys?: boolean;
        transform?: (group: T[]) => T[];
    } = {}
): Map<K, T[]> {
    const groups = arr.reduce((map, item) => {
        const key = keyFn(item);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(item);
        return map;
    }, new Map<K, T[]>());

    if (options.transform) {
        for (const [key, value] of groups) {
            groups.set(key, options.transform(value));
        }
    }

    if (options.sortKeys) {
        return new Map([...groups.entries()].sort());
    }

    return groups;
}

/**
 * Chunks an array into smaller arrays with advanced options
 * @param arr - The input array to chunk
 * @param size - Size of each chunk
 * @param options - Optional configuration for chunking
 * @returns Array of chunks
 * @example
 * chunk([1, 2, 3, 4], 2) // [[1, 2], [3, 4]]
 */
export function chunk<T>(
    arr: T[],
    size: number,
    options: {
        overlap?: number;
        pad?: T;
    } = {}
): T[][] {
    const { overlap = 0, pad } = options;
    const chunks: T[][] = [];
    
    for (let i = 0; i < arr.length; i += size - overlap) {
        const chunk = arr.slice(i, i + size);
        if (pad && chunk.length < size) {
            chunk.push(...Array(size - chunk.length).fill(pad));
        }
        chunks.push(chunk);
    }

    return chunks;
}

/**
 * Flattens a nested array with depth control and transformation
 * @param arr - The input array to flatten
 * @param options - Optional configuration for flattening
 * @returns Flattened array
 * @example
 * flatten([1, [2, [3]]]) // [1, 2, 3]
 */
export function flatten<T>(
    arr: (T | T[])[],
    options: {
        depth?: number;
        transform?: (item: T) => T;
    } = {}
): T[] {
    const { depth = Infinity, transform } = options;

    function flattenWithDepth(items: (T | T[])[], currentDepth: number): T[] {
        return items.reduce<T[]>((flat, item) => {
            if (Array.isArray(item) && currentDepth > 0) {
                return flat.concat(flattenWithDepth(item, currentDepth - 1));
            }
            return flat.concat(transform ? transform(item as T) : item as T);
        }, []);
    }

    return flattenWithDepth(arr, depth);
}

/**
 * Checks if an array is empty with optional validation
 * @param arr - The input array to check
 * @param options - Optional validation options
 * @returns Boolean indicating if array is empty
 */
export function isArrayEmpty<T>(
    arr: T[],
    options: {
        checkNull?: boolean;
        checkUndefined?: boolean;
        checkEmptyStrings?: boolean;
    } = {}
): boolean {
    if (arr.length === 0) return true;

    const { checkNull, checkUndefined, checkEmptyStrings } = options;
    
    return arr.every(item => {
        if (checkNull && item === null) return true;
        if (checkUndefined && item === undefined) return true;
        if (checkEmptyStrings && item === '') return true;
        return false;
    });
}

/**
 * Gets the last element of an array with fallback options
 * @param arr - The input array
 * @param options - Optional configuration for last element retrieval
 * @returns Last element or fallback value
 */
export function last<T>(
    arr: T[],
    options: {
        fallback?: T;
        predicate?: (item: T) => boolean;
    } = {}
): T | undefined {
    const { fallback, predicate } = options;
    
    if (predicate) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (predicate(arr[i])) return arr[i];
        }
        return fallback;
    }
    
    return arr[arr.length - 1] ?? fallback;
}

/**
 * Creates an array of numbers with advanced range options
 * @param start - Starting number
 * @param end - Ending number
 * @param options - Optional configuration for range generation
 * @returns Array of numbers
 * @example
 * range(1, 5) // [1, 2, 3, 4, 5]
 */
export function range(
    start: number,
    end: number,
    options: {
        step?: number;
        inclusive?: boolean;
        transform?: (n: number) => number;
    } = {}
): number[] {
    const { step = 1, inclusive = true, transform } = options;
    const length = Math.ceil((end - start) / step) + (inclusive ? 1 : 0);
    
    return Array.from({ length }, (_, i) => {
        const value = start + i * step;
        return transform ? transform(value) : value;
    });
}