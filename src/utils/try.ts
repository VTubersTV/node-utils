/**
 * Safely executes a function and returns its result or a fallback value
 * @param fn - Function to execute
 * @param options - Configuration options
 * @returns Result of function execution or fallback value
 * @example
 * safeTry(() => riskyOperation()) // Returns result or undefined
 * safeTry(() => riskyOperation(), { 
 *   fallback: 'default',
 *   onError: (err) => console.error(err)
 * })
 */
export function safeTry<T, R = undefined>(
    fn: () => T,
    options: {
        fallback?: R;
        onError?: (error: unknown) => void;
        logError?: boolean;
    } = {}
): T | R {
    try {
        return fn();
    } catch (error) {
        if (options.logError) {
            console.error('Error in safeTry:', error);
        }
        if (options.onError) {
            options.onError(error);
        }
        return options.fallback as R;
    }
}
