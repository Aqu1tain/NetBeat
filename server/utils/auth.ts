import { H3Event, getHeader, createError } from 'h3';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    id: string;
    username: string;
    role: 'user' | 'admin';
}

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';

export function verifyToken(event: H3Event): DecodedToken {
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
        // On s'assure que le payload n'est pas une chaîne
        if (typeof decoded === 'string') {
            throw createError({ statusCode: 401, statusMessage: 'Invalid token payload' });
        }
        return decoded as DecodedToken;
    } catch (err) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
    }
}
