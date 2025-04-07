// server/api/tickets/[id]/comments.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
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

    const body = await readBody(event);
    const { content, isInternal = false, attachmentUrl } = body;

    if (!content) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Comment content is required'
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

    // Only admins can create internal comments
    if (isInternal && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Only admins can create internal notes'
        });
    }

    const newComment = new Comment({
        ticketId,
        content,
        createdBy: decoded.id,
        isInternal,
        attachmentUrl
    });

    await newComment.save();

    // Update ticket status and lastActivityAt
    let newStatus = ticket.status;

    // Auto-update status based on who is commenting
    if (isAdmin) {
        // Admin comments should set status to in_progress (unless it's already closed)
        if (ticket.status !== 'closed') {
            newStatus = 'in_progress';
        }
    } else {
        // User comments should set status to waiting_user (unless it's closed)
        if (ticket.status !== 'closed') {
            newStatus = 'waiting_user';
        }
    }

    await Ticket.findByIdAndUpdate(ticketId, {
        status: newStatus,
        lastActivityAt: new Date(),
        updatedAt: new Date()
    });

    // Return the populated comment
    const populatedComment = await Comment.findById(newComment._id)
        .populate('createdBy', 'username role');

    return { success: true, comment: populatedComment };
});