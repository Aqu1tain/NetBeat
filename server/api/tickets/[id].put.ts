import { defineEventHandler, readBody, createError } from 'h3';
import connectToDatabase from '../../utils/db';
import Ticket from '../../models/Ticket';
import { verifyToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    // Vérification du token
    const decoded = verifyToken(event); // decoded est maintenant de type DecodedToken
    if (!decoded) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Token invalide ou manquant'
        });
    }

    // Récupération de l'ID du ticket
    const ticketId = event.context.params?.id;
    if (!ticketId) {
        throw createError({
            statusCode: 400,
            statusMessage: "L'ID du ticket est requis"
        });
    }

    // Lecture du corps de la requête
    const body = await readBody(event);

    // Connexion à la base de données
    await connectToDatabase();

    // Recherche du ticket pour vérifier s'il existe et vérifier les permissions
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Ticket non trouvé'
        });
    }

    // Vérification des permissions : seul le propriétaire ou un admin peut mettre à jour
    const isOwner = ticket.createdBy.toString() === decoded.id;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Vous n’êtes pas autorisé à mettre à jour ce ticket'
        });
    }

    // Définir les champs autorisés à être modifiés
    const allowedFields = ['status']; // Ajouter d'autres champs si besoin
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    // Vérifie qu'au moins un champ valide a été fourni
    if (Object.keys(updates).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Aucun champ valide fourni pour la mise à jour'
        });
    }

    // Ajout de la date de mise à jour
    updates.updatedAt = new Date();

    // Mise à jour du ticket et peuplement du champ "createdBy" pour obtenir le username
    const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    return { success: true, ticket: updatedTicket };
});
