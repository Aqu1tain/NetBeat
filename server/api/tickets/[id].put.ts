// server/api/tickets/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Ticket from '../../models/Ticket';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    const ticketId = event.context.params?.id;
    const body = await readBody(event);

    if (!ticketId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ticket ID is required'
        });
    }

    await connectToDatabase();

    // Find the ticket first to check permissions
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Ticket not found'
        });
    }

    // Check permissions - only owner or admin can update
    const isOwner = ticket.createdBy.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You are not authorized to update this ticket'
        });
    }

    // Update the ticket
    const allowedFields = ['status']; // Add more fields as needed
    const updates = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    return { success: true, ticket: updatedTicket };
});