// server/api/auth/refresh.post.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../utils/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'development_secret';

export default defineEventHandler(async (event) => {
    // Verify the current token
    const decoded: any = verifyToken(event);

    await connectToDatabase();

    // Fetch the latest user data (in case role has changed)
    const user = await User.findById(decoded.id).exec();
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    // Issue a new token with fresh expiration
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '6h' }
    );

    return {
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    };
});