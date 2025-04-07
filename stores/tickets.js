// stores/tickets.js
import { defineStore } from 'pinia';
import { useActivityStore } from './activity';

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        tickets: [],
        currentTicket: null,
        ticketComments: [],
        isSubmittingTicket: false,
        isLoadingComments: false,
        isSubmittingComment: false,
        ticketFilter: 'all',
        ticketSearch: '',
        ticketPriorityFilter: 'all',
        showNewTicketForm: false,
        ticketTitle: '',
        ticketDescription: '',
        ticketCategory: '',
        ticketPriority: 'medium',
        commentContent: '',
        isInternalNote: false
    }),

    getters: {
        // Counts by status
        ticketCounts: (state) => ({
            new: state.tickets.filter(t => t.status === 'new').length,
            inProgress: state.tickets.filter(t => t.status === 'in_progress').length,
            waitingUser: state.tickets.filter(t => t.status === 'waiting_user').length,
            closed: state.tickets.filter(t => t.status === 'closed').length,
            total: state.tickets.length
        }),

        // Pending tickets by specific user
        pendingTicketsCount: (state) => (userId) => {
            return state.tickets.filter(t =>
                ['new', 'in_progress', 'waiting_user'].includes(t.status) &&
                t.createdBy === userId
            ).length;
        },

        // Filtered tickets for display
        filteredTickets: (state) => (isAdmin) => {
            let result = [...state.tickets];

            // Filter by status
            if (state.ticketFilter !== 'all') {
                switch(state.ticketFilter) {
                    case 'open':
                        result = result.filter(ticket =>
                            ['new', 'in_progress', 'waiting_user'].includes(ticket.status)
                        );
                        break;
                    case 'waiting':
                        result = result.filter(ticket => ticket.status === 'waiting_user');
                        break;
                    case 'closed':
                        result = result.filter(ticket => ticket.status === 'closed');
                        break;
                    default:
                        // Handle specific status filter if needed
                        if (['new', 'in_progress'].includes(state.ticketFilter)) {
                            result = result.filter(ticket => ticket.status === state.ticketFilter);
                        }
                }
            }

            // Filter by priority
            if (state.ticketPriorityFilter !== 'all') {
                result = result.filter(ticket => ticket.priority === state.ticketPriorityFilter);
            }

            // Filter by search (admin only)
            if (isAdmin && state.ticketSearch) {
                const searchLower = state.ticketSearch.toLowerCase();
                result = result.filter(ticket =>
                    ticket.title.toLowerCase().includes(searchLower) ||
                    ticket.description.toLowerCase().includes(searchLower) ||
                    (ticket._id && ticket._id.includes(searchLower))
                );
            }

            // Sort primary by priority, then by lastActivityAt date
            return result.sort((a, b) => {
                // First by priority (high > medium > low)
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const priorityA = priorityOrder[a.priority] || 1;
                const priorityB = priorityOrder[b.priority] || 1;

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // Then by latest activity
                return new Date(b.lastActivityAt || b.updatedAt) - new Date(a.lastActivityAt || a.updatedAt);
            });
        },

        // Format status for display
        formatStatus: () => (status) => {
            switch(status) {
                case 'new': return { text: 'Nouveau', color: 'blue' };
                case 'in_progress': return { text: 'En cours', color: 'yellow' };
                case 'waiting_user': return { text: 'En attente', color: 'orange' };
                case 'closed': return { text: 'Résolu', color: 'green' };
                default: return { text: status, color: 'gray' };
            }
        }
    },

    actions: {
        // Fetch ticket list
        async fetchTickets(isAdmin) {
            if (process.server) return;

            try {
                // Skip if not authenticated
                const token = localStorage.getItem('token');
                if (!token) return;

                // Endpoint depends on user role
                const endpoint = isAdmin ? '/api/tickets/all' : '/api/tickets';

                const response = await $fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                this.tickets = response.tickets || [];
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        },

        // Fetch single ticket with details
        async fetchTicketDetails(ticketId) {
            if (process.server || !ticketId) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await $fetch(`/api/tickets/${ticketId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.success && response.ticket) {
                    this.currentTicket = response.ticket;
                    // Also fetch comments
                    await this.fetchTicketComments(ticketId);
                    return response.ticket;
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
            }
        },

        // Fetch comments for a ticket
        async fetchTicketComments(ticketId) {
            if (process.server || !ticketId) return;

            try {
                this.isLoadingComments = true;
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await $fetch(`/api/tickets/${ticketId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.success) {
                    this.ticketComments = response.comments || [];
                }
            } catch (error) {
                console.error('Error fetching ticket comments:', error);
            } finally {
                this.isLoadingComments = false;
            }
        },

        // Create new ticket
        async createTicket(isAdmin = false) {
            if (!this.ticketTitle || !this.ticketDescription) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            try {
                this.isSubmittingTicket = true;

                const ticketData = {
                    title: this.ticketTitle,
                    description: this.ticketDescription,
                    priority: this.ticketPriority
                };

                // Add optional category if present
                if (this.ticketCategory) {
                    ticketData.category = this.ticketCategory;
                }

                const response = await $fetch('/api/tickets', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: ticketData
                });

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'ticket_created',
                    message: `Nouveau ticket créé: "${this.ticketTitle}"`,
                    timestamp: new Date()
                });

                // Reset form
                this.resetTicketForm();

                // Update showNewTicketForm to false
                this.showNewTicketForm = false;

                // Refresh tickets
                await this.fetchTickets(isAdmin);

                return response.ticket;

            } catch (error) {
                console.error('Error creating ticket:', error);
                alert('Erreur lors de la création du ticket');
            } finally {
                this.isSubmittingTicket = false;
            }
        },

        // Add comment to ticket
        async addComment(ticketId) {
            if (!this.commentContent) {
                alert('Le contenu du commentaire est requis');
                return;
            }

            try {
                this.isSubmittingComment = true;

                const commentData = {
                    content: this.commentContent,
                    isInternal: this.isInternalNote
                };

                const response = await $fetch(`/api/tickets/${ticketId}/comments`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: commentData
                });

                if (response.success) {
                    // Add new comment to list
                    this.ticketComments.push(response.comment);

                    // Update current ticket status if it changed
                    if (this.currentTicket) {
                        await this.fetchTicketDetails(ticketId);
                    }

                    // Clear form
                    this.commentContent = '';
                    this.isInternalNote = false;

                    // Add to activity log
                    const activityStore = useActivityStore();
                    activityStore.addActivity({
                        type: 'ticket_comment',
                        message: `Commentaire ajouté au ticket #${ticketId.substring(0, 6)}`,
                        timestamp: new Date()
                    });
                }

                return response.comment;
            } catch (error) {
                console.error('Error adding comment:', error);
                alert('Erreur lors de l\'ajout du commentaire');
            } finally {
                this.isSubmittingComment = false;
            }
        },

        // Update ticket status
        async updateTicketStatus(ticketId, newStatus) {
            try {
                console.log(`Mise à jour du ticket ${ticketId} vers le statut ${newStatus}`);
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("Token manquant, impossible de mettre à jour le ticket");
                    return;
                }

                const response = await $fetch(`/api/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                });

                console.log("Réponse du serveur:", response);

                // Update current ticket if we're viewing it
                if (this.currentTicket && this.currentTicket._id === ticketId) {
                    this.currentTicket = response.ticket;
                }

                // Find the ticket in our existing list
                const ticketIndex = this.tickets.findIndex(t => t._id === ticketId);
                if (ticketIndex !== -1) {
                    // Update it in-place
                    this.tickets[ticketIndex] = {
                        ...this.tickets[ticketIndex],
                        status: newStatus,
                        updatedAt: new Date(),
                        lastActivityAt: new Date()
                    };
                }

                // Add to recent activity
                const activityStore = useActivityStore();
                let actionType, actionMessage;

                switch(newStatus) {
                    case 'closed':
                        actionType = 'ticket_closed';
                        actionMessage = `Ticket #${ticketId.substring(0, 6)} marqué comme résolu`;
                        break;
                    case 'in_progress':
                        actionType = 'ticket_in_progress';
                        actionMessage = `Ticket #${ticketId.substring(0, 6)} mis en traitement`;
                        break;
                    case 'waiting_user':
                        actionType = 'ticket_waiting';
                        actionMessage = `Ticket #${ticketId.substring(0, 6)} en attente de réponse`;
                        break;
                    default:
                        actionType = 'ticket_updated';
                        actionMessage = `Statut du ticket #${ticketId.substring(0, 6)} mis à jour`;
                }

                activityStore.addActivity({
                    type: actionType,
                    message: actionMessage,
                    timestamp: new Date()
                });

                return response.ticket;
            } catch (error) {
                console.error('Error updating ticket:', error);
                console.error('Message d\'erreur:', error.message);
                if (error.response) {
                    console.error('Détails de la réponse:', error.response);
                }
                alert('Erreur lors de la mise à jour du ticket: ' + (error.message || 'Erreur inconnue'));
            }
        },

        // Update ticket priority (admin only)
        async updateTicketPriority(ticketId, newPriority) {
            try {
                const response = await $fetch(`/api/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        priority: newPriority
                    }
                });

                // Update current ticket if we're viewing it
                if (this.currentTicket && this.currentTicket._id === ticketId) {
                    this.currentTicket = response.ticket;
                }

                // Refresh all tickets
                await this.fetchTickets(true);

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'ticket_updated',
                    message: `Priorité du ticket #${ticketId.substring(0, 6)} mise à jour`,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error updating ticket priority:', error);
                alert('Erreur lors de la mise à jour de la priorité');
            }
        },

        // Assign ticket to admin (admin only)
        async assignTicket(ticketId, adminId) {
            try {
                const response = await $fetch(`/api/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        assignedTo: adminId,
                        status: 'in_progress' // Auto-update to in-progress when assigned
                    }
                });

                // Update current ticket if we're viewing it
                if (this.currentTicket && this.currentTicket._id === ticketId) {
                    this.currentTicket = response.ticket;
                }

                // Refresh all tickets
                await this.fetchTickets(true);

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'ticket_assigned',
                    message: `Ticket #${ticketId.substring(0, 6)} assigné à un administrateur`,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error assigning ticket:', error);
                alert('Erreur lors de l\'assignation du ticket');
            }
        },

        // Unassign ticket (clear assignment)
        async unassignTicket(ticketId) {
            try {
                const response = await $fetch(`/api/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        assignedTo: null // Remove assignment
                    }
                });

                // Update current ticket if we're viewing it
                if (this.currentTicket && this.currentTicket._id === ticketId) {
                    this.currentTicket = response.ticket;
                }

                // Refresh all tickets
                await this.fetchTickets(true);

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'ticket_unassigned',
                    message: `Ticket #${ticketId.substring(0, 6)} désassigné`,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error unassigning ticket:', error);
                alert('Erreur lors de la suppression de l\'assignation du ticket');
            }
        },

        // Reset ticket form
        resetTicketForm() {
            this.ticketTitle = '';
            this.ticketDescription = '';
            this.ticketCategory = '';
            this.ticketPriority = 'medium';
            this.showNewTicketForm = false;
        }
    }
});