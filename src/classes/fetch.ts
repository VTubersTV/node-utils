/**
 * Enhanced HTTP client with convenient methods and rich features
 */
export class HttpClient {
    private static instance: HttpClient;
    private baseURL: string = '';
    private defaultHeaders: Record<string, string> = {};
    private timeout: number = 30000;

    private constructor() {}

    /**
     * Get singleton instance of HttpClient
     */
    public static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    /**
     * Configure global client settings
     */
    public configure(config: {
        baseURL?: string;
        headers?: Record<string, string>;
        timeout?: number;
    }) {
        if (config.baseURL) this.baseURL = config.baseURL;
        if (config.headers) this.defaultHeaders = { ...this.defaultHeaders, ...config.headers };
        if (config.timeout) this.timeout = config.timeout;
        return this;
    }

    /**
     * Make a GET request
     */
    public async get<T = any>(
        url: string,
        config?: {
            params?: Record<string, any>;
            headers?: Record<string, string>;
            timeout?: number;
        }
    ): Promise<T> {
        const queryString = config?.params ? '?' + new URLSearchParams(config.params).toString() : '';
        const response = await this.request<T>(`${url}${queryString}`, {
            method: 'GET',
            headers: config?.headers,
            timeout: config?.timeout,
        });
        return response;
    }

    /**
     * Make a POST request
     */
    public async post<T = any>(
        url: string,
        data?: any,
        config?: {
            headers?: Record<string, string>;
            timeout?: number;
        }
    ): Promise<T> {
        const response = await this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response;
    }

    /**
     * Make a PUT request
     */
    public async put<T = any>(
        url: string,
        data?: any,
        config?: {
            headers?: Record<string, string>;
            timeout?: number;
        }
    ): Promise<T> {
        const response = await this.request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response;
    }

    /**
     * Make a DELETE request
     */
    public async delete<T = any>(
        url: string,
        config?: {
            headers?: Record<string, string>;
            timeout?: number;
        }
    ): Promise<T> {
        const response = await this.request<T>(url, {
            method: 'DELETE',
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response;
    }

    /**
     * Make a PATCH request
     */
    public async patch<T = any>(
        url: string,
        data?: any,
        config?: {
            headers?: Record<string, string>;
            timeout?: number;
        }
    ): Promise<T> {
        const response = await this.request<T>(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response;
    }

    /**
     * Make a request with full configuration
     */
    private async request<T>(url: string, config: RequestInit & { timeout?: number }): Promise<T> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), config.timeout || this.timeout);

        try {
            const response = await fetch(this.baseURL + url, {
                ...config,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaultHeaders,
                    ...config.headers
                },
                signal: controller.signal
            });

            clearTimeout(id);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(id);
            if (error instanceof Error) {
                throw new Error(`HTTP Error: ${error.message}`);
            }
            throw error;
        }
    }
}

// Export default instance
export const http = HttpClient.getInstance();
