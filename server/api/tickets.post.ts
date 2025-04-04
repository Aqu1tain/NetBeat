// server/api/tickets.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../utils/db';
import Ticket from '../models/Ticket';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    const body = await readBody(event);
    const { title, description } = body;

    if (!title || !description) {
        throw createError({ statusCode: 400, statusMessage: 'Title and description are required' });
    }

    await connectToDatabase();
    const newTicket = new Ticket({
        title,
        description,
        createdBy: decoded.id,
    });

    await newTicket.save();
    return { success: true, ticket: newTicket };
});
