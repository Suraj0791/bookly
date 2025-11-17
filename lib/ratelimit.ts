import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";
import { simpleRateLimit } from "./ratelimit-fallback";

// Create rate limiter with error handling
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// Wrapper function with fallback for when Redis is unavailable
export const checkRateLimit = async (identifier: string) => {
  try {
    const result = await ratelimit.limit(identifier);
    return result;
  } catch (error) {
    console.error("Redis rate limit failed, using fallback:", error);
    // Fallback to simple in-memory rate limiting
    return simpleRateLimit(identifier, 5, 60000);
  }
};

export default ratelimit;