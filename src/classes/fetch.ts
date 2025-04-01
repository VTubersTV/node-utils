import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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
        const response = await this.request<T>({
            method: 'GET',
            url,
            params: config?.params,
            headers: config?.headers,
            timeout: config?.timeout,
        });
        return response.data;
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
        const response = await this.request<T>({
            method: 'POST',
            url,
            data,
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response.data;
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
        const response = await this.request<T>({
            method: 'PUT',
            url,
            data,
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response.data;
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
        const response = await this.request<T>({
            method: 'DELETE',
            url,
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response.data;
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
        const response = await this.request<T>({
            method: 'PATCH',
            url,
            data,
            headers: config?.headers,
            timeout: config?.timeout
        });
        return response.data;
    }

    /**
     * Make a request with full configuration
     */
    private async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            return await axios({
                ...config,
                baseURL: this.baseURL,
                headers: {
                    ...this.defaultHeaders,
                    ...config.headers
                },
                timeout: config.timeout || this.timeout
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`HTTP Error: ${error.response?.status} - ${error.message}`);
            }
            throw error;
        }
    }
}

// Export default instance
export const http = HttpClient.getInstance();
