/**
 * Browser-compatible file utilities
 * These functions use the File System Access API where available
 */

/**
 * Checks if a file or directory exists at the specified path
 * @throws Error Browser version does not support direct file system access
 */
export async function fileExists(): Promise<boolean> {
    throw new Error('File system operations are not supported in browser environment');
}

/**
 * Creates a directory and all necessary parent directories
 * @throws Error Browser version does not support direct file system access
 */
export async function ensureDir(): Promise<void> {
    throw new Error('File system operations are not supported in browser environment');
}

/**
 * Reads a file with specified encoding and options
 * @param file - File or Blob object to read
 * @param options - Optional configuration for file reading
 * @returns Promise resolving to the file contents
 */
export async function readFile(
    file: File | Blob,
    options: { encoding?: 'utf-8' | 'base64' } = { encoding: 'utf-8' }
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));

        if (options.encoding === 'base64') {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    });
}

/**
 * Writes content to a file using the File System Access API
 * @param content - Content to write
 * @param options - Optional configuration for file writing
 * @returns Promise resolving to the saved File object
 */
export async function writeFile(
    content: string | Blob,
    options: {
        type?: string;
        suggestedName?: string;
    } = {}
): Promise<File> {
    // Check if File System Access API is available
    if (!('showSaveFilePicker' in window)) {
        throw new Error('File System Access API is not supported in this browser');
    }

    const opts = {
        suggestedName: options.suggestedName || 'untitled.txt',
        types: [{
            description: 'Text file',
            accept: {
                'text/plain': ['.txt'],
                ...options.type ? { [options.type]: [`.${options.type.split('/')[1]}`] } : {}
            }
        }]
    };

    try {
        // @ts-ignore - TypeScript doesn't have types for File System Access API yet
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        return new File([content], handle.name, { type: options.type || 'text/plain' });
    } catch (error) {
        throw new Error(`Failed to write file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets the file extension from a filename
 * @param filename - The filename to extract extension from
 * @param options - Optional configuration for extension extraction
 * @returns The file extension (with or without dot)
 */
export function getFileExtension(
    filename: string,
    options: { withDot?: boolean; lowercase?: boolean } = { withDot: true, lowercase: true }
): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) return '';

    let ext = options.withDot ? filename.slice(lastDotIndex) : filename.slice(lastDotIndex + 1);
    return options.lowercase ? ext.toLowerCase() : ext;
}

/**
 * Gets the file name from a path or File object
 * @param input - The file path or File object
 * @param options - Optional configuration for name extraction
 * @returns The file name according to specified options
 */
export function getFileName(
    input: string | File,
    options: { withExt?: boolean; lowercase?: boolean } = { withExt: false, lowercase: false }
): string {
    const filename = input instanceof File ? input.name : input.split('/').pop() || '';
    if (!options.withExt) {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            return options.lowercase ? filename.slice(0, lastDotIndex).toLowerCase() : filename.slice(0, lastDotIndex);
        }
    }
    return options.lowercase ? filename.toLowerCase() : filename;
}
