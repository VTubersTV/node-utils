/**
 * Advanced date manipulation and formatting utilities
 * @module date-utils
 */

/**
 * Time unit type for date operations
 */
export type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';
export type TimeUnitShort = 'day' | 'hour' | 'minute' | 'second';

/**
 * Date format tokens and their corresponding values
 */
const DATE_FORMAT_TOKENS = {
    YYYY: (d: Date) => d.getFullYear(),
    MM: (d: Date) => String(d.getMonth() + 1).padStart(2, '0'),
    DD: (d: Date) => String(d.getDate()).padStart(2, '0'),
    HH: (d: Date) => String(d.getHours()).padStart(2, '0'),
    mm: (d: Date) => String(d.getMinutes()).padStart(2, '0'),
    ss: (d: Date) => String(d.getSeconds()).padStart(2, '0'),
    SSS: (d: Date) => String(d.getMilliseconds()).padStart(3, '0'),
    DDD: (d: Date) => String(Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1).padStart(3, '0'),
    WW: (d: Date) => String(Math.floor((d.getDate() - 1) / 7) + 1).padStart(2, '0'),
    w: (d: Date) => String(d.getDay()),
    A: (d: Date) => d.getHours() >= 12 ? 'PM' : 'AM',
    a: (d: Date) => d.getHours() >= 12 ? 'pm' : 'am'
} as const;

/**
 * Milliseconds per time unit
 */
const MS_PER_UNIT: Record<TimeUnit, number> = {
    days: 1000 * 60 * 60 * 24,
    hours: 1000 * 60 * 60,
    minutes: 1000 * 60,
    seconds: 1000,
    milliseconds: 1
};

/**
 * Formats a date into a human-readable string with advanced formatting options
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param format - Format string with supported tokens (default: 'YYYY-MM-DD HH:mm:ss')
 * @param options - Additional formatting options
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss.SSS A') // "2024-03-14 15:30:45.123 PM"
 * formatDate(new Date(), 'DDD day of the year') // "074 day of the year"
 */
export function formatDate(
    date: Date | string | number,
    format: string = 'YYYY-MM-DD HH:mm:ss',
    options: { timezone?: string; locale?: string } = {}
): string {
    const d = new Date(date);
    if (options.timezone) {
        d.toLocaleString('en-US', { timeZone: options.timezone });
    }

    return Object.entries(DATE_FORMAT_TOKENS).reduce(
        (result, [token, formatter]) => result.replace(token, () => String(formatter(d))),
        format
    );
}

/**
 * Adds time units to a date with support for negative values
 * @param date - Base date
 * @param amount - Amount to add (can be negative for subtraction)
 * @param unit - Time unit
 * @param options - Additional options for time addition
 * @returns New date
 * @example
 * addTime(new Date(), 2, 'days') // Adds 2 days
 * addTime(new Date(), -1, 'hours') // Subtracts 1 hour
 */
export function addTime(
    date: Date | string | number,
    amount: number,
    unit: TimeUnit,
    options: { preserveTime?: boolean } = { preserveTime: true }
): Date {
    const d = new Date(date);
    const ms = amount * MS_PER_UNIT[unit];
    
    if (options.preserveTime) {
        d.setTime(d.getTime() + ms);
    } else {
        switch (unit) {
            case 'days':
                d.setDate(d.getDate() + amount);
                break;
            case 'hours':
                d.setHours(d.getHours() + amount);
                break;
            case 'minutes':
                d.setMinutes(d.getMinutes() + amount);
                break;
            case 'seconds':
                d.setSeconds(d.getSeconds() + amount);
                break;
            case 'milliseconds':
                d.setMilliseconds(d.getMilliseconds() + amount);
                break;
        }
    }
    
    return d;
}

/**
 * Calculates the difference between two dates with advanced options
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Time unit for the difference
 * @param options - Additional options for difference calculation
 * @returns Difference in specified units
 * @example
 * getTimeDifference(new Date(), addTime(new Date(), 2, 'days'), 'days') // 2
 */
export function getTimeDifference(
    date1: Date | string | number,
    date2: Date | string | number,
    unit: TimeUnit,
    options: { absolute?: boolean; precise?: boolean } = { absolute: false, precise: false }
): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    let diff = d2.getTime() - d1.getTime();

    if (options.absolute) {
        diff = Math.abs(diff);
    }

    if (options.precise) {
        return diff / MS_PER_UNIT[unit];
    }

    return Math.floor(diff / MS_PER_UNIT[unit]);
}

/**
 * Validates a date with additional checks
 * @param date - Date to validate
 * @param options - Validation options
 * @returns True if date is valid and meets criteria
 * @example
 * isValidDate('2024-02-30') // false
 * isValidDate('2024-02-29') // true
 */
export function isValidDate(
    date: Date | string | number,
    options: { min?: Date; max?: Date; allowFuture?: boolean } = {}
): boolean {
    const d = new Date(date);
    if (!(d instanceof Date) || isNaN(d.getTime())) {
        return false;
    }

    if (options.min && d < options.min) return false;
    if (options.max && d > options.max) return false;
    if (options.allowFuture === false && d > new Date()) return false;

    return true;
}

/**
 * Gets the start of a specified time unit with additional options
 * @param date - Base date
 * @param unit - Time unit
 * @param options - Additional options for start calculation
 * @returns Date at start of specified unit
 * @example
 * getStartOf(new Date(), 'day') // Start of current day
 */
export function getStartOf(
    date: Date | string | number,
    unit: TimeUnitShort,
    options: { preserveTimezone?: boolean } = {}
): Date {
    const d = new Date(date);
    
    if (options.preserveTimezone) {
        const tzOffset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() - tzOffset);
    }

    switch (unit) {
        case 'day':
            d.setHours(0, 0, 0, 0);
            break;
        case 'hour':
            d.setMinutes(0, 0, 0);
            break;
        case 'minute':
            d.setSeconds(0, 0);
            break;
        case 'second':
            d.setMilliseconds(0);
            break;
    }

    return d;
}

/**
 * Gets the end of a specified time unit with additional options
 * @param date - Base date
 * @param unit - Time unit
 * @param options - Additional options for end calculation
 * @returns Date at end of specified unit
 * @example
 * getEndOf(new Date(), 'day') // End of current day
 */
export function getEndOf(
    date: Date | string | number,
    unit: TimeUnitShort,
    options: { preserveTimezone?: boolean } = {}
): Date {
    const d = new Date(date);
    
    if (options.preserveTimezone) {
        const tzOffset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() - tzOffset);
    }

    switch (unit) {
        case 'day':
            d.setHours(23, 59, 59, 999);
            break;
        case 'hour':
            d.setMinutes(59, 59, 999);
            break;
        case 'minute':
            d.setSeconds(59, 999);
            break;
        case 'second':
            d.setMilliseconds(999);
            break;
    }

    return d;
}