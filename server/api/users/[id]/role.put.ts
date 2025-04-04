// server/api/users/[id]/role.put.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../../utils/db';
import User from '../../../models/User';
import { verifyToken } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);

    // Check if the user has admin privileges
    if (decoded.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access forbidden: Admin privileges required'
        });
    }

    const userId = event.context.params?.id;
    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID is required'
        });
    }

    const body = await readBody(event);
    const { role } = body;

    // Validate role
    if (role !== 'admin' && role !== 'user') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid role. Must be "admin" or "user"'
        });
    }

    await connectToDatabase();

    // Prevent an admin from downgrading themselves
    if (userId === decoded.id && decoded.role === 'admin' && role === 'user') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Cannot remove admin privileges from yourself'
        });
    }

    // Find and update the user's role
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        });
    }

    return {
        success: true,
        user: updatedUser
    };
});