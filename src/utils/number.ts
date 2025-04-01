/**
 * Advanced number manipulation and validation utilities
 * @module number-utils
 */

/**
 * Clamps a number between a minimum and maximum value with optional rounding
 * @param num - The number to clamp
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param options - Optional configuration for clamping
 * @returns Clamped number
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(15, 0, 10) // 10
 */
export function clamp(
    num: number,
    min: number,
    max: number,
    options: { round?: number } = {}
): number {
    if (min > max) throw new Error('Minimum value cannot be greater than maximum value');
    const clamped = Math.min(Math.max(num, min), max);
    return options.round !== undefined ? round(clamped, { decimals: options.round }) : clamped;
}

/**
 * Rounds a number to a specified number of decimal places with advanced options
 * @param num - The number to round
 * @param options - Rounding configuration
 * @returns Rounded number
 * @example
 * round(3.14159, { decimals: 2 }) // 3.14
 * round(3.14159, { decimals: 1, mode: 'floor' }) // 3.1
 */
export function round(
    num: number,
    options: {
        decimals?: number;
        mode?: 'round' | 'floor' | 'ceil' | 'trunc';
    } = { decimals: 0, mode: 'round' }
): number {
    const { decimals = 0, mode = 'round' } = options;
    const factor = Math.pow(10, decimals);
    const rounded = {
        round: Math.round,
        floor: Math.floor,
        ceil: Math.ceil,
        trunc: Math.trunc
    }[mode](num * factor);
    return rounded / factor;
}

/**
 * Checks if a number is even with optional tolerance for floating-point numbers
 * @param num - The number to check
 * @param options - Optional configuration for evenness check
 * @returns True if the number is even
 * @example
 * isEven(2) // true
 * isEven(2.0000001, { tolerance: 0.000001 }) // true
 */
export function isEven(
    num: number,
    options: { tolerance?: number } = {}
): boolean {
    const { tolerance = 0 } = options;
    return Math.abs(num % 2) <= tolerance;
}

/**
 * Checks if a number is odd with optional tolerance for floating-point numbers
 * @param num - The number to check
 * @param options - Optional configuration for oddness check
 * @returns True if the number is odd
 * @example
 * isOdd(3) // true
 * isOdd(3.0000001, { tolerance: 0.000001 }) // true
 */
export function isOdd(
    num: number,
    options: { tolerance?: number } = {}
): boolean {
    return !isEven(num, options);
}

/**
 * Checks if a number is within a specified range with optional inclusivity
 * @param num - The number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @param options - Optional configuration for range check
 * @returns True if the number is within the range
 * @example
 * isInRange(5, 0, 10) // true
 * isInRange(5, 0, 10, { inclusive: false }) // false
 */
export function isInRange(
    num: number,
    min: number,
    max: number,
    options: { inclusive?: boolean } = { inclusive: true }
): boolean {
    if (min > max) throw new Error('Minimum value cannot be greater than maximum value');
    return options.inclusive
        ? num >= min && num <= max
        : num > min && num < max;
}

/**
 * Generates a random number with advanced distribution options
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param options - Optional configuration for random number generation
 * @returns Random number
 * @example
 * random(0, 10) // Random integer between 0 and 10
 * random(0, 1, { decimals: 2 }) // Random float between 0 and 1 with 2 decimal places
 */
export function random(
    min: number,
    max: number,
    options: {
        decimals?: number;
        seed?: number;
        distribution?: 'uniform' | 'normal';
    } = {}
): number {
    const { decimals = 0, seed, distribution = 'uniform' } = options;
    
    let randomValue: number;
    if (seed !== undefined) {
        // Simple seeded random number generator
        let seedValue = seed;
        const x = Math.sin(seedValue++) * 10000;
        randomValue = x - Math.floor(x);
    } else {
        randomValue = Math.random();
    }

    if (distribution === 'normal') {
        // Box-Muller transform for normal distribution
        const u1 = randomValue;
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        randomValue = (z + 3) / 6; // Scale to [0,1]
    }

    const range = max - min;
    const result = min + randomValue * range;
    return decimals === 0 ? Math.floor(result) : round(result, { decimals });
}

/**
 * Formats a number with advanced formatting options
 * @param num - The number to format
 * @param options - Optional configuration for number formatting
 * @returns Formatted number string
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(1234567.89, { decimals: 1, prefix: '$' }) // "$1,234,567.9"
 */
export function formatNumber(
    num: number,
    options: {
        decimals?: number;
        prefix?: string;
        suffix?: string;
        locale?: string;
    } = {}
): string {
    const { decimals, prefix = '', suffix = '', locale = 'en-US' } = options;
    
    const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
    
    return `${prefix}${formatted}${suffix}`;
}

/**
 * Validates a number with advanced validation options
 * @param value - The value to validate
 * @param options - Optional configuration for number validation
 * @returns True if the value is a valid number
 * @example
 * isValidNumber(42) // true
 * isValidNumber('42', { allowString: true }) // true
 */
export function isValidNumber(
    value: unknown,
    options: {
        allowString?: boolean;
        allowInfinity?: boolean;
        allowNaN?: boolean;
        min?: number;
        max?: number;
    } = {}
): boolean {
    const {
        allowString = false,
        allowInfinity = false,
        allowNaN = false,
        min,
        max
    } = options;

    if (allowString && typeof value === 'string') {
        const num = Number(value);
        return isValidNumber(num, { ...options, allowString: false });
    }

    if (typeof value !== 'number') return false;
    if (!allowNaN && isNaN(value)) return false;
    if (!allowInfinity && !isFinite(value)) return false;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;

    return true;
}