// server/api/tickets/[id]/comments.get.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../../../utils/db';
import Comment from '../../../models/Comment';
import Ticket from '../../../models/Ticket';
import { verifyToken } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    const ticketId = event.context.params?.id;

    if (!ticketId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ticket ID is required'
        });
    }

    await connectToDatabase();

    // First check if user has access to this ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Ticket not found'
        });
    }

    // Check access: either admin, or the ticket creator
    const isAdmin = decoded.role === 'admin';
    const isOwner = ticket.createdBy.toString() === decoded.id;

    if (!isAdmin && !isOwner) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access denied to this ticket'
        });
    }

    // For regular users, exclude internal comments
    const query = isAdmin
        ? { ticketId }
        : { ticketId, isInternal: { $ne: true } };

    const comments = await Comment.find(query)
        .populate('createdBy', 'username role')
        .sort({ createdAt: 1 }); // Chronological order

    return { success: true, comments };
});