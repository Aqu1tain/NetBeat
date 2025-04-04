// server/api/tickets.get.ts
import { defineEventHandler } from 'h3';
import connectToDatabase from '../utils/db';
import Ticket from '../models/Ticket';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const decoded: any = verifyToken(event);
    await connectToDatabase();

    // On récupère uniquement les tickets créés par l'utilisateur connecté
    const tickets = await Ticket.find({ createdBy: decoded.id }).sort({ createdAt: -1 });
    return { success: true, tickets };
});
