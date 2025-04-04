// server/utils/auth.ts
import { H3Event, getHeader } from 'h3';
import jwt from 'jsonwebtoken';
import { createError } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';

export function verifyToken(event: H3Event) {
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader) {
        throw createError({ statusCode: 401, statusMessage: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1]; // Attend "Bearer <token>"
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Token missing' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
    }
}
