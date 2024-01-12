import { redis } from './redis'
import {Ratelimit} from '@upstash/ratelimit'

export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, '10s'),
})