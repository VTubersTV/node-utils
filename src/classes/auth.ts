import { Helix } from "./Helix";
import crypto from 'crypto';
import { http } from "./fetch";

/**
 * Custom error class for auth-specific errors
 */
export class AuthError extends Error {
    constructor(message: string, public code: string = 'AUTH_ERROR') {
        super(message);
        this.name = 'AuthError';
    }
}

/**
 * Configuration interface for auth system
 */
export interface AuthConfig {
    accessTokenExpiry: number; // in seconds
    refreshTokenExpiry: number; // in seconds
    rememberMeExpiry: number; // in seconds
    maxSessionsPerUser: number;
    tokenSecret: string;
    totpSecret: string;
}

/**
 * Default configuration for auth system
 */
const DEFAULT_CONFIG: AuthConfig = {
    accessTokenExpiry: 15 * 60, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
    rememberMeExpiry: 30 * 24 * 60 * 60, // 30 days
    maxSessionsPerUser: 5,
    tokenSecret: process.env.AUTH_TOKEN_SECRET || crypto.randomBytes(32).toString('hex'),
    totpSecret: process.env.AUTH_TOTP_SECRET || crypto.randomBytes(32).toString('hex')
};

/**
 * Session data interface
 */
export interface SessionData {
    userId: string;
    deviceInfo: {
        userAgent: string;
        ip: string;
        location?: {
            country?: string;
            city?: string;
            timezone?: string;
        };
        deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    };
    isRememberMe: boolean;
    lastActivity: number; // Unix timestamp in seconds
}

/**
 * Token data interface
 */
export interface TokenData {
    sessionId: string;
    userId: string;
    roles: string[];
    permissions: string[];
    deviceInfo: SessionData['deviceInfo'];
    isRememberMe: boolean;
    exp: number;
    iat: number;
}

/**
 * IP Geolocation response interface
 */
interface IPGeolocation {
    ip: string;
    country: string;
    city: string;
    timezone: string;
    latitude: number;
    longitude: number;
    isp: string;
    asn: string;
}

/**
 * Device type detection interface
 */
interface DeviceInfo {
    userAgent: string;
    ip: string;
    location?: {
        country?: string;
        city?: string;
        timezone?: string;
    };
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
}

/**
 * Main Auth class for handling authentication and session management
 */
export class Auth {
    private static instance: Auth;
    private config: AuthConfig;
    private helix: Helix;
    private sessions: Map<string, SessionData>;
    private ipCache: Map<string, { data: IPGeolocation; timestamp: number }>;
    private readonly IP_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    private constructor(config: Partial<AuthConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.helix = new Helix();
        this.sessions = new Map();
        this.ipCache = new Map();
    }

    /**
     * Get singleton instance of Auth
     */
    public static getInstance(config?: Partial<AuthConfig>): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth(config);
        }
        return Auth.instance;
    }

    /**
     * Detect device type from user agent
     */
    private detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
        const ua = userAgent.toLowerCase();
        
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        
        if (/(Macintosh|Windows NT|Linux|Ubuntu|X11)/.test(ua)) {
            return 'desktop';
        }
        
        return 'unknown';
    }

    /**
     * Get IP geolocation data
     */
    private async getIPGeolocation(ip: string): Promise<IPGeolocation> {
        // Check cache first
        const cached = this.ipCache.get(ip);
        if (cached && Date.now() - cached.timestamp < this.IP_CACHE_TTL) {
            return cached.data;
        }

        try {
            // Use ip-api.com (free service with rate limits)
            const response = await http.get(`http://ip-api.com/json/${ip}`);
            
            if (response.status === 'success') {
                const data: IPGeolocation = {
                    ip: response.query,
                    country: response.country,
                    city: response.city,
                    timezone: response.timezone,
                    latitude: response.lat,
                    longitude: response.lon,
                    isp: response.isp,
                    asn: response.as
                };

                // Cache the result
                this.ipCache.set(ip, {
                    data,
                    timestamp: Date.now()
                });

                return data;
            }

            throw new Error('Failed to get IP geolocation data');
        } catch (error) {
            console.error('IP geolocation error:', error);
            // Return minimal data if geolocation fails
            return {
                ip,
                country: 'Unknown',
                city: 'Unknown',
                timezone: 'UTC',
                latitude: 0,
                longitude: 0,
                isp: 'Unknown',
                asn: 'Unknown'
            };
        }
    }

    /**
     * Process device info and get geolocation data
     */
    private async processDeviceInfo(userAgent: string, ip: string): Promise<DeviceInfo> {
        const deviceType = this.detectDeviceType(userAgent);
        const location = await this.getIPGeolocation(ip);

        return {
            userAgent,
            ip,
            location: {
                country: location.country,
                city: location.city,
                timezone: location.timezone
            },
            deviceType
        };
    }

    /**
     * Create a new session for a user
     */
    public async createSession(data: SessionData): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }> {
        // Process device info and get geolocation data
        const deviceInfo = await this.processDeviceInfo(
            data.deviceInfo.userAgent,
            data.deviceInfo.ip
        );

        // Generate session ID
        const sessionId = this.helix.generateId();

        // Store session data with processed device info
        this.sessions.set(sessionId, {
            ...data,
            deviceInfo,
            lastActivity: Math.floor(Date.now() / 1000)
        });

        // Calculate expiry based on remember me
        const expiresIn = data.isRememberMe ? this.config.rememberMeExpiry : this.config.accessTokenExpiry;

        // Create token data
        const tokenData: TokenData = {
            sessionId,
            userId: data.userId,
            roles: [], // TODO: Get from user data
            permissions: [], // TODO: Get from user data
            deviceInfo,
            isRememberMe: data.isRememberMe,
            exp: Math.floor(Date.now() / 1000) + expiresIn,
            iat: Math.floor(Date.now() / 1000)
        };

        // Generate tokens
        const accessToken = this.helix.generateToken(tokenData);
        const refreshToken = this.helix.generateToken({
            ...tokenData,
            exp: Math.floor(Date.now() / 1000) + this.config.refreshTokenExpiry
        });

        return {
            accessToken,
            refreshToken,
            expiresIn
        };
    }

    /**
     * Validate and decode an access token
     */
    public validateAccessToken(token: string): TokenData {
        try {
            const decoded = Helix.decodeToken(token);
            const tokenData = JSON.parse(decoded.data?.toString() || '{}') as TokenData;

            // Check if token is expired
            if (tokenData.exp < Math.floor(Date.now() / 1000)) {
                throw new AuthError('Token expired', 'TOKEN_EXPIRED');
            }

            // Check if session exists
            if (!this.sessions.has(tokenData.sessionId)) {
                throw new AuthError('Session not found', 'SESSION_NOT_FOUND');
            }

            return tokenData;
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Invalid token', 'INVALID_TOKEN');
        }
    }

    /**
     * Refresh an access token using a refresh token
     */
    public async refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }> {
        try {
            const decoded = Helix.decodeToken(refreshToken);
            const tokenData = JSON.parse(decoded.data?.toString() || '{}') as TokenData;

            // Check if refresh token is expired
            if (tokenData.exp < Math.floor(Date.now() / 1000)) {
                throw new AuthError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
            }

            // Check if session exists
            if (!this.sessions.has(tokenData.sessionId)) {
                throw new AuthError('Session not found', 'SESSION_NOT_FOUND');
            }

            // Get session data
            const sessionData = this.sessions.get(tokenData.sessionId)!;

            // Create new tokens
            return this.createSession(sessionData);
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
        }
    }

    /**
     * Revoke a session
     */
    public revokeSession(sessionId: string, reason: string = 'user_logout'): void {
        this.sessions.delete(sessionId);
    }

    /**
     * Revoke all sessions for a user
     */
    public revokeUserSessions(userId: string, reason: string = 'security_breach'): void {
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.userId === userId) {
                this.revokeSession(sessionId, reason);
            }
        }
    }

    /**
     * Generate TOTP secret for 2FA
     */
    public generateTOTPSecret(): string {
        return crypto.randomBytes(20).toString('base64');
    }

    /**
     * Verify TOTP code
     */
    public verifyTOTP(secret: string, code: string): boolean {
        const now = Math.floor(Date.now() / 1000);
        const step = 30; // 30 seconds per step

        // Check current step and adjacent steps
        for (let i = -1; i <= 1; i++) {
            const timeStep = now + (i * step);
            const expectedCode = this.generateTOTPCode(secret, timeStep);
            if (code === expectedCode) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate TOTP code for a given timestamp
     */
    private generateTOTPCode(secret: string, timestamp: number): string {
        const key = Buffer.from(secret, 'base64');
        const counter = Buffer.alloc(8);
        counter.writeBigUInt64BE(BigInt(Math.floor(timestamp / 30)));

        const hmac = crypto.createHmac('sha1', key);
        hmac.update(counter);
        const hash = hmac.digest();

        const offset = hash[hash.length - 1] & 0xf;
        const code = ((hash[offset] & 0x7f) << 24) |
                    ((hash[offset + 1] & 0xff) << 16) |
                    ((hash[offset + 2] & 0xff) << 8) |
                    (hash[offset + 3] & 0xff);

        return (code % 1000000).toString().padStart(6, '0');
    }

    /**
     * Generate backup codes for 2FA
     */
    public generateBackupCodes(count: number = 8): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
        }
        return codes;
    }

    /**
     * Verify backup code
     */
    public verifyBackupCode(code: string): boolean {
        return /^[0-9A-F]{8}$/.test(code);
    }

    /**
     * Clean up expired sessions
     */
    public cleanupSessions(): void {
        const now = Math.floor(Date.now() / 1000);
        for (const [sessionId, session] of this.sessions.entries()) {
            // TODO: Implement session expiry check
            // For now, we'll just remove sessions older than 30 days
            if (now - session.lastActivity > 30 * 24 * 60 * 60) {
                this.revokeSession(sessionId, 'expired');
            }
        }
    }
}
