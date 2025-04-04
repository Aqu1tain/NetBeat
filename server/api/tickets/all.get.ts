// server/api/tickets/all.get.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Ticket from '../../models/Ticket';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);

    // Verify admin role
    if (decoded.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access forbidden: Admin privileges required'
        });
    }

    await connectToDatabase();

    // Get all tickets with user details populated
    const tickets = await Ticket.find({})
        .populate('createdBy', 'username') // Populate the username of the creator
        .sort({ createdAt: -1 });

    return { success: true, tickets };
});