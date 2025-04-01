import { promises as fs } from 'fs';
import path from 'path';
import { Stats } from 'fs';

/**
 * Checks if a file or directory exists at the specified path
 * @param filePath - The path to check
 * @param checkType - Optional type to check for ('file' | 'directory')
 * @returns Promise resolving to true if exists, false otherwise
 */
export async function fileExists(filePath: string, checkType?: 'file' | 'directory'): Promise<boolean> {
    try {
        const stats = await fs.stat(filePath);
        if (checkType) {
            return checkType === 'file' ? stats.isFile() : stats.isDirectory();
        }
        return true;
    } catch {
        return false;
    }
}

/**
 * Creates a directory and all necessary parent directories if they don't exist
 * @param dirPath - The directory path to create
 * @param options - Optional configuration for directory creation
 * @throws Error if directory creation fails for reasons other than already existing
 */
export async function ensureDir(
    dirPath: string,
    options: { mode?: number; recursive?: boolean } = { recursive: true }
): Promise<void> {
    try {
        await fs.mkdir(dirPath, options);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw new Error(`Failed to create directory: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Reads a file with specified encoding and options
 * @param filePath - Path to the file
 * @param options - Optional configuration for file reading
 * @returns Promise resolving to the file contents
 * @throws Error if file cannot be read
 */
export async function readFile(
    filePath: string,
    options: { encoding?: BufferEncoding; flag?: string } = { encoding: 'utf-8' }
): Promise<string | Buffer> {
    try {
        return await fs.readFile(filePath, options);
    } catch (error) {
        throw new Error(`Failed to read file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Writes content to a file with specified options
 * @param filePath - Path where the file should be written
 * @param content - Content to write to the file
 * @param options - Optional configuration for file writing
 * @throws Error if file cannot be written
 */
export async function writeFile(
    filePath: string,
    content: string,
    options: { encoding?: BufferEncoding; mode?: number; flag?: string } = { encoding: 'utf-8' }
): Promise<void> {
    try {
        await ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, options);
    } catch (error) {
        throw new Error(`Failed to write file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Gets the file extension from a path with optional normalization
 * @param filePath - The path to extract extension from
 * @param options - Optional configuration for extension extraction
 * @returns The file extension (with or without dot)
 */
export function getFileExtension(
    filePath: string,
    options: { withDot?: boolean; lowercase?: boolean } = { withDot: true, lowercase: true }
): string {
    const ext = path.extname(filePath);
    let result = options.withDot ? ext : ext.slice(1);
    return options.lowercase ? result.toLowerCase() : result;
}

/**
 * Gets the file name from a path with various options
 * @param filePath - The path to extract name from
 * @param options - Optional configuration for name extraction
 * @returns The file name according to specified options
 */
export function getFileName(
    filePath: string,
    options: { withExt?: boolean; lowercase?: boolean } = { withExt: false, lowercase: false }
): string {
    const name = options.withExt ? path.basename(filePath) : path.basename(filePath, path.extname(filePath));
    return options.lowercase ? name.toLowerCase() : name;
}

/**
 * Lists all files in a directory recursively with filtering options
 * @param dirPath - The directory to list files from
 * @param options - Optional configuration for file listing
 * @returns Promise resolving to array of file paths
 * @throws Error if directory cannot be read
 */
export async function listFiles(
    dirPath: string,
    options: {
        recursive?: boolean;
        filter?: (stats: Stats) => boolean;
        maxDepth?: number;
    } = { recursive: true }
): Promise<string[]> {
    const { recursive = true, filter = () => true, maxDepth = Infinity } = options;
    
    async function scanDirectory(currentPath: string, depth: number): Promise<string[]> {
        if (depth > maxDepth) return [];
        
        const files = await fs.readdir(currentPath);
        const paths = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(currentPath, file);
                const stats = await fs.stat(filePath);
                
                if (stats.isDirectory() && recursive) {
                    return scanDirectory(filePath, depth + 1);
                }
                
                return filter(stats) ? [filePath] : [];
            })
        );
        return paths.flat();
    }
    
    return scanDirectory(dirPath, 0);
}

/**
 * Deletes a file or directory recursively with safety checks
 * @param filePath - Path to the file or directory to delete
 * @param options - Optional configuration for deletion
 * @throws Error if deletion fails
 */
export async function deleteFile(
    filePath: string,
    options: { recursive?: boolean; force?: boolean } = { recursive: true, force: false }
): Promise<void> {
    try {
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            if (!options.recursive && !options.force) {
                throw new Error('Directory deletion requires recursive option');
            }
            const files = await fs.readdir(filePath);
            await Promise.all(files.map(file => deleteFile(path.join(filePath, file), options)));
            await fs.rmdir(filePath);
        } else {
            await fs.unlink(filePath);
        }
    } catch (error) {
        if (!options.force) {
            throw new Error(`Failed to delete: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}