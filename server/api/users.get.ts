// server/api/users.get.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../utils/db';
import User from '../models/User';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);

    // Check if the user has admin privileges
    if (decoded.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access forbidden: Admin privileges required'
        });
    }

    await connectToDatabase();

    // Fetch all users (except sensitive fields like passwords)
    const users = await User.find({}, { password: 0 }).sort({ username: 1 }).lean();

    return { success: true, users };
});