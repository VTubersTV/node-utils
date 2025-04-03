/**
 * Capitalizes the first letter of a string while preserving Unicode characters
 * @param str - The input string to capitalize
 * @returns The string with its first character capitalized
 * @throws {TypeError} If input is not a string
 */
export function capitalize(str: string): string {
    if (typeof str !== 'string') throw new TypeError('Input must be a string');
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncates a string to a specified length with configurable ellipsis
 * @param str - The input string to truncate
 * @param length - Maximum length of the output string
 * @param options - Optional configuration for truncation
 * @param options.ellipsis - Custom ellipsis string (default: '...')
 * @param options.preserveWords - Whether to avoid cutting words (default: true)
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(
    str: string,
    length: number,
    options: { ellipsis?: string; preserveWords?: boolean } = {}
): string {
    const { ellipsis = '...', preserveWords = true } = options;
    if (str.length <= length) return str;
    
    if (preserveWords) {
        const lastSpace = str.slice(0, length).lastIndexOf(' ');
        return str.slice(0, lastSpace) + ellipsis;
    }
    return str.slice(0, length) + ellipsis;
}

/**
 * Removes whitespace from both ends of a string with Unicode support
 * @param str - The input string to trim
 * @param chars - Optional characters to trim (default: whitespace)
 * @returns Trimmed string
 */
export function trim(str: string, chars: string = ' \t\n\r\v\f\u00A0\u1680\u180e\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff'): string {
    const pattern = `^[${chars}]+|[${chars}]+$`;
    return str.replace(new RegExp(pattern, 'g'), '');
}

/**
 * Converts a string to kebab-case with advanced handling
 * @param str - The input string to convert
 * @param options - Optional configuration for conversion
 * @param options.preserveNumbers - Whether to preserve numbers as separate segments
 * @returns Kebab-case string
 */
export function toKebabCase(
    str: string,
    options: { preserveNumbers?: boolean } = {}
): string {
    const { preserveNumbers = false } = options;
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(preserveNumbers ? /([0-9])([a-zA-Z])/g : /[^a-zA-Z0-9]+/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Converts a string to camelCase with advanced handling
 * @param str - The input string to convert
 * @param options - Optional configuration for conversion
 * @param options.preserveAcronyms - Whether to preserve existing acronyms
 * @returns Camel-case string
 */
export function toCamelCase(
    str: string,
    options: { preserveAcronyms?: boolean } = {}
): string {
    const { preserveAcronyms = false } = options;
    return str
        .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (_, c) => c.toLowerCase())
        .replace(preserveAcronyms ? /([A-Z])([A-Z][a-z])/g : /[^a-zA-Z0-9]+/g, '$1$2');
}

/**
 * Checks if a string is empty or only contains whitespace with Unicode support
 * @param str - The input string to check
 * @param options - Optional configuration for checking
 * @param options.includeWhitespace - Whether to consider whitespace-only strings as empty
 * @returns Boolean indicating if string is empty
 */
export function isStringEmpty(
    str: string,
    options: { includeWhitespace?: boolean } = {}
): boolean {
    const { includeWhitespace = true } = options;
    if (!str) return true;
    return includeWhitespace ? str.trim().length === 0 : str.length === 0;
}

/**
 * Reverses a string with Unicode character support
 * @param str - The input string to reverse
 * @returns Reversed string
 */
export function reverse(str: string): string {
    return [...str].reverse().join('');
}

/**
 * Counts the number of words in a string with advanced options
 * @param str - The input string to count words from
 * @param options - Optional configuration for word counting
 * @param options.includeNumbers - Whether to count numbers as words
 * @param options.minLength - Minimum word length to count
 * @returns Number of words in the string
 */
export function wordCount(
    str: string,
    options: { includeNumbers?: boolean; minLength?: number } = {}
): number {
    const { includeNumbers = true, minLength = 0 } = options;
    const pattern = includeNumbers ? /\b\w+\b/g : /\b[a-zA-Z]+\b/g;
    return (str.match(pattern) || []).filter(word => word.length >= minLength).length;
}

/**
 * Converts a string to snake_case with advanced handling
 * @param str - The input string to convert
 * @param options - Optional configuration for conversion
 * @param options.preserveAcronyms - Whether to preserve existing acronyms
 * @returns Snake-case string
 */
export function toSnakeCase(
    str: string,
    options: { preserveAcronyms?: boolean } = {}
): string {
    const { preserveAcronyms = false } = options;
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(preserveAcronyms ? /([A-Z])([A-Z][a-z])/g : /[^a-zA-Z0-9]+/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}

/**
 * Converts a string to PascalCase with advanced handling
 * @param str - The input string to convert
 * @param options - Optional configuration for conversion
 * @param options.preserveAcronyms - Whether to preserve existing acronyms
 * @returns Pascal-case string
 */
export function toPascalCase(
    str: string,
    options: { preserveAcronyms?: boolean } = {}
): string {
    const { preserveAcronyms = false } = options;
    return str
        .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (_, c) => c.toUpperCase())
        .replace(preserveAcronyms ? /([A-Z])([A-Z][a-z])/g : /[^a-zA-Z0-9]+/g, '$1$2');
}

/**
 * Removes all whitespace from a string with Unicode support
 * @param str - The input string to remove whitespace from
 * @param options - Optional configuration for whitespace removal
 * @param options.preserveNewlines - Whether to preserve newline characters
 * @returns String with whitespace removed
 */
export function removeWhitespace(
    str: string,
    options: { preserveNewlines?: boolean } = {}
): string {
    const { preserveNewlines = false } = options;
    const pattern = preserveNewlines ? /[^\S\r\n]+/g : /\s+/g;
    return str.replace(pattern, '');
}

/**
 * Normalizes whitespace in a string with advanced options
 * @param str - The input string to normalize
 * @param options - Optional configuration for normalization
 * @param options.preserveNewlines - Whether to preserve newline characters
 * @param options.maxSpaces - Maximum number of consecutive spaces to allow
 * @returns Normalized string
 */
export function normalizeWhitespace(
    str: string,
    options: { preserveNewlines?: boolean; maxSpaces?: number } = {}
): string {
    const { preserveNewlines = false, maxSpaces = 1 } = options;
    const pattern = preserveNewlines ? /[^\S\r\n]+/g : /\s+/g;
    return str.replace(pattern, ' '.repeat(maxSpaces)).trim();
}

/**
 * Checks if a string contains only alphanumeric characters with Unicode support
 * @param str - The input string to check
 * @param options - Optional configuration for checking
 * @param options.includeSpaces - Whether to allow spaces
 * @returns Boolean indicating if string is alphanumeric
 */
export function isAlphanumeric(
    str: string,
    options: { includeSpaces?: boolean } = {}
): boolean {
    const { includeSpaces = false } = options;
    const pattern = includeSpaces ? /^[a-zA-Z0-9\s]+$/ : /^[a-zA-Z0-9]+$/;
    return pattern.test(str);
}