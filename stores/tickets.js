// stores/tickets.js
import { defineStore } from 'pinia';
import { useActivityStore } from './activity';

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        tickets: [],
        isSubmittingTicket: false,
        ticketFilter: 'all',
        ticketSearch: '',
        showNewTicketForm: false,
        ticketTitle: '',
        ticketDescription: ''
    }),

    getters: {
        openTicketsCount: (state) => state.tickets.filter(t => t.status === 'open').length,

        closedTicketsCount: (state) => state.tickets.filter(t => t.status === 'closed').length,

        pendingTicketsCount: (state) => (userId) => {
            return state.tickets.filter(t => t.status === 'open' && t.createdBy === userId).length;
        },

        filteredTickets: (state) => (isAdmin) => {
            let result = [...state.tickets];

            // Filter by status
            if (state.ticketFilter !== 'all') {
                result = result.filter(ticket => ticket.status === state.ticketFilter);
            }

            // Filter by search (admin only)
            if (isAdmin && state.ticketSearch) {
                const searchLower = state.ticketSearch.toLowerCase();
                result = result.filter(ticket =>
                    ticket.title.toLowerCase().includes(searchLower) ||
                    ticket.description.toLowerCase().includes(searchLower)
                );
            }

            // Sort by created date, newest first
            return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },

    actions: {
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

        async createTicket(userId) {
            if (!this.ticketTitle || !this.ticketDescription) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            try {
                this.isSubmittingTicket = true;

                await $fetch('/api/tickets', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        title: this.ticketTitle,
                        description: this.ticketDescription
                    }
                });

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'ticket_created',
                    message: `Nouveau ticket créé: "${this.ticketTitle}"`,
                    timestamp: new Date()
                });

                // Reset form and refresh tickets
                this.ticketTitle = '';
                this.ticketDescription = '';
                this.showNewTicketForm = false;
                await this.fetchTickets(false);

            } catch (error) {
                console.error('Error creating ticket:', error);
                alert('Erreur lors de la création du ticket');
            } finally {
                this.isSubmittingTicket = false;
            }
        },

        async updateTicketStatus(ticketId, newStatus) {
            try {
                await $fetch(`/api/tickets/${ticketId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        status: newStatus
                    }
                });

                // Refresh tickets
                await this.fetchTickets(true);

                // Add to recent activity
                const activityStore = useActivityStore();
                const actionType = newStatus === 'closed' ? 'ticket_closed' : 'ticket_reopened';
                const actionMessage = newStatus === 'closed'
                    ? `Ticket #${ticketId.substring(0, 6)} marqué comme résolu`
                    : `Ticket #${ticketId.substring(0, 6)} réouvert`;

                activityStore.addActivity({
                    type: actionType,
                    message: actionMessage,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error updating ticket:', error);
                alert('Erreur lors de la mise à jour du ticket');
            }
        }
    }
});