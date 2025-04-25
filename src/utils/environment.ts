/**
 * Detects if the code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Detects if the code is running in a Node.js environment
 */
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/**
 * Detects if the code is running in a Web Worker environment
 */
export const isWebWorker = typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
