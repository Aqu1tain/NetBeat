// server/api/tickets/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Ticket from '../../models/Ticket';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    // Verify token
    const decoded: any = verifyToken(event);
    if (!decoded) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or missing token'
        });
    }

    // Get ticket ID
    const ticketId = event.context.params?.id;
    if (!ticketId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ticket ID is required'
        });
    }

    // Read request body
    let body;
    try {
        body = await readBody(event);
        console.log("Corps de la requête reçu:", body);
    } catch (error) {
        console.error("Erreur lors de la lecture du corps de la requête:", error);
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body'
        });
    }

    // Connect to database
    await connectToDatabase();

    // Find ticket to verify it exists and check permissions
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Ticket not found'
        });
    }

    // Check permissions: owner or admin can update
    const isOwner = ticket.createdBy.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    console.log(`Vérification des permissions: isOwner=${isOwner}, isAdmin=${isAdmin}, userId=${decoded.id}, ticketCreator=${ticket.createdBy}`);

    if (!isOwner && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'You are not authorized to update this ticket'
        });
    }

    // Define fields that can be updated based on role
    let allowedFields = ['status']; // Base fields any ticket owner can update

    // Admins can update more fields
    if (isAdmin) {
        allowedFields = [
            ...allowedFields,
            'priority',
            'assignedTo',
            'category'
        ];
    }

    // Regular users can only close tickets or respond to them
    if (!isAdmin && body.status && !['closed', 'waiting_user'].includes(body.status)) {
        console.log(`Tentative non autorisée de changement de statut: ${body.status}`);
        throw createError({
            statusCode: 403,
            statusMessage: 'You can only mark tickets as closed or respond to them'
        });
    }

    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    // Check if valid fields were provided
    if (Object.keys(updates).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No valid fields provided for update'
        });
    }

    console.log("Mises à jour à appliquer:", updates);

    // Update timestamps
    updates.updatedAt = new Date();
    updates.lastActivityAt = new Date();

    // Update ticket and populate creator and assignee fields
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { $set: updates },
            { new: true, runValidators: true }
        )
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username');

        console.log("Ticket mis à jour avec succès:", updatedTicket);

        return { success: true, ticket: updatedTicket };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du ticket:", error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error updating ticket: ' + (error as Error).message
        });
    }
});