// server/api/tickets/[id].get.ts
import { defineEventHandler, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Ticket from '../../models/Ticket';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    // Get user from token
    const decoded: any = verifyToken(event);

    // Get ticket ID from params
    const ticketId = event.context.params?.id;
    if (!ticketId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ticket ID is required'
        });
    }

    await connectToDatabase();

    // Find ticket and populate creator and assignee
    const ticket = await Ticket.findById(ticketId)
        .populate('createdBy', 'username')
        .populate('assignedTo', 'username');

    if (!ticket) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Ticket not found'
        });
    }

    // Check permissions: ticket creator or admin can view details
    const isAdmin = decoded.role === 'admin';
    const isOwner = ticket.createdBy._id.toString() === decoded.id;

    if (!isAdmin && !isOwner) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access denied to this ticket'
        });
    }

    return { success: true, ticket };
});