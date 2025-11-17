// Simple in-memory rate limiting fallback (for development only)
// This is NOT suitable for production with multiple servers

const requests = new Map<string, number[]>();

export const simpleRateLimit = (identifier: string, limit: number = 5, windowMs: number = 60000) => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];

    // Remove requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= limit) {
        return { success: false, limit, remaining: 0, reset: now + windowMs };
    }

    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);

    return {
        success: true,
        limit,
        remaining: limit - recentRequests.length,
        reset: now + windowMs
    };
};
