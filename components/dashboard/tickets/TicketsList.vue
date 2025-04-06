<!-- components/dashboard/tickets/TicketsList.vue -->
<template>
    <div class="p-6">
        <div v-if="filteredTickets.length === 0" class="text-center py-8 text-gray-500">
            Aucun ticket à afficher
        </div>
        <ul v-else class="divide-y divide-gray-200">
            <li
                  v-for="ticket in filteredTickets"
                  :key="ticket._id"
                  class="py-4"
            >
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <!-- Ticket Info -->
                    <div class="flex-1">
                        <div class="flex items-start">
                            <!-- Status Indicator -->
                            <span
                                  class="h-2 w-2 mt-2 mr-2 rounded-full"
                                  :class="ticket.status === 'open' ? 'bg-red-500' : 'bg-green-500'"
                            ></span>

                            <!-- Ticket Content -->
                            <div>
                                <h4 class="text-lg font-medium text-gray-900">{{ ticket.title }}</h4>
                                <p class="mt-1 text-gray-600">{{ ticket.description }}</p>

                                <!-- Admin-visible metadata -->
                                <div v-if="isAdmin" class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                    <span>ID: {{ ticket._id }}</span>
                                    <span>Créé par: {{ getUsername(ticket.createdBy) }}</span>
                                </div>

                                <!-- Common metadata -->
                                <div class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                    <span>Créé le: {{ formatDate(ticket.createdAt) }}</span>
                                    <span>
                    Statut:
                    <span
                          :class="ticket.status === 'open' ? 'text-red-600' : 'text-green-600'"
                          class="font-medium"
                    >
                      {{ ticket.status === 'open' ? 'Ouvert' : 'Résolu' }}
                    </span>
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-4 md:mt-0 flex justify-end">
                        <!-- Admin Actions -->
                        <div v-if="isAdmin" class="flex space-x-2">
                            <button
                                  v-if="ticket.status === 'open'"
                                  @click="updateTicketStatus(ticket._id, 'closed')"
                                  class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                                Marquer comme résolu
                            </button>
                            <button
                                  v-else
                                  @click="updateTicketStatus(ticket._id, 'open')"
                                  class="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                            >
                                Réouvrir
                            </button>
                        </div>

                        <!-- User Actions -->
                        <div v-else class="flex space-x-2">
                            <button
                                  v-if="ticket.status === 'open'"
                                  @click="confirmCloseTicket(ticket._id)"
                                  class="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                            >
                                Marquer comme résolu
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';
import { useUsersStore } from '~/stores/users';
import { formatDate } from '~/utils/formatters';

const props = defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
        required: true
    }
});

const ticketsStore = useTicketsStore();
const usersStore = useUsersStore();

// Get filtered tickets from store
const filteredTickets = computed(() => ticketsStore.filteredTickets(props.isAdmin));

// Get username from ID (for admin view)
const getUsername = (userId) => usersStore.getUsername(userId);

// Update ticket status (admin action)
const updateTicketStatus = async (ticketId, newStatus) => {
    await ticketsStore.updateTicketStatus(ticketId, newStatus);
};

// Confirm before closing ticket (for regular users)
const confirmCloseTicket = (ticketId) => {
    if (confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) {
        updateTicketStatus(ticketId, 'closed');
    }
};
</script>