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
                  class="py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="viewTicketDetails(ticket._id)"
            >
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <!-- Ticket Info -->
                    <div class="flex-1">
                        <div class="flex items-start">
                            <!-- Status Indicator -->
                            <div class="mr-3 mt-1">
                                <span
                                      class="h-3 w-3 rounded-full block"
                                      :class="{
                                        'bg-blue-500': ticket.status === 'new',
                                        'bg-yellow-500': ticket.status === 'in_progress',
                                        'bg-orange-500': ticket.status === 'waiting_user',
                                        'bg-green-500': ticket.status === 'closed'
                                    }"
                                ></span>
                            </div>

                            <!-- Ticket Content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between">
                                    <h4 class="text-lg font-medium text-gray-900 truncate">{{ ticket.title }}</h4>

                                    <!-- Priority indicator (visible on mobile) -->
                                    <div class="md:hidden">
                                        <span
                                              :class="{
                                                'bg-red-100 text-red-800': ticket.priority === 'high',
                                                'bg-blue-100 text-blue-800': ticket.priority === 'medium',
                                                'bg-green-100 text-green-800': ticket.priority === 'low'
                                            }"
                                              class="px-2 py-0.5 text-xs rounded-full ml-2"
                                        >
                                            {{ ticket.priority === 'high' ? 'Élevée' : ticket.priority === 'medium' ? 'Moyenne' : 'Faible' }}
                                        </span>
                                    </div>
                                </div>

                                <p class="mt-1 text-gray-600 line-clamp-2">{{ ticket.description }}</p>

                                <!-- Common metadata -->
                                <div class="mt-2 flex flex-wrap items-center text-xs text-gray-500 space-x-3">
                                    <!-- Ticket ID -->
                                    <span class="font-mono">#{{ ticket._id.substring(0, 6) }}</span>

                                    <!-- Status -->
                                    <span
                                          :class="{
                                            'text-blue-600': ticket.status === 'new',
                                            'text-yellow-600': ticket.status === 'in_progress',
                                            'text-orange-600': ticket.status === 'waiting_user',
                                            'text-green-600': ticket.status === 'closed'
                                        }"
                                          class="font-medium"
                                    >
                                        {{ formatStatus(ticket.status).text }}
                                    </span>

                                    <!-- Creation date -->
                                    <span>{{ formatDate(ticket.createdAt) }}</span>

                                    <!-- Admin-visible metadata -->
                                    <template v-if="isAdmin">
                                        <span>Par: {{ getUsername(ticket.createdBy) }}</span>

                                        <!-- If assigned -->
                                        <span v-if="ticket.assignedTo">
                                            Assigné: {{ getUsername(ticket.assignedTo) }}
                                        </span>
                                    </template>

                                    <!-- Last activity -->
                                    <span v-if="ticket.lastActivityAt">
                                        Dernière activité: {{ formatRelativeTime(ticket.lastActivityAt) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Priority and Quick Actions (desktop view) -->
                    <div class="hidden md:flex md:items-center space-x-3 ml-4">
                        <!-- Priority badge -->
                        <span
                              :class="{
                                'bg-red-100 text-red-800': ticket.priority === 'high',
                                'bg-blue-100 text-blue-800': ticket.priority === 'medium',
                                'bg-green-100 text-green-800': ticket.priority === 'low'
                            }"
                              class="px-2 py-1 text-xs rounded-full"
                        >
                            {{ ticket.priority === 'high' ? 'Élevée' : ticket.priority === 'medium' ? 'Moyenne' : 'Faible' }}
                        </span>

                        <!-- Quick actions for admin -->
                        <div v-if="isAdmin && ticket.status !== 'closed'" class="flex space-x-1">
                            <button
                                  @click.stop="$emit('assignTo', ticket._id)"
                                  title="Assigner ce ticket"
                                  class="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <button
                                  @click.stop="$emit('updateStatus', ticket._id, 'closed')"
                                  title="Marquer comme résolu"
                                  class="p-1 text-gray-500 hover:text-green-700 hover:bg-green-100 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Quick "reopen" action for closed tickets (admin only) -->
                        <div v-else-if="isAdmin && ticket.status === 'closed'" class="flex space-x-1">
                            <button
                                  @click.stop="$emit('updateStatus', ticket._id, 'in_progress')"
                                  title="Réouvrir le ticket"
                                  class="p-1 text-gray-500 hover:text-yellow-700 hover:bg-yellow-100 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>

                        <!-- User actions: resolve option -->
                        <div v-else-if="!isAdmin && ticket.status !== 'closed'" class="flex space-x-1">
                            <button
                                  @click.stop="confirmCloseTicket(ticket._id); $event.stopPropagation();"
                                  title="Marquer comme résolu"
                                  class="p-1 text-gray-500 hover:text-green-700 hover:bg-green-100 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
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

const emit = defineEmits(['updateStatus', 'assignTo', 'viewTicket', 'update-status']);

const ticketsStore = useTicketsStore();
const usersStore = useUsersStore();

// Get filtered tickets from store
const filteredTickets = computed(() => ticketsStore.filteredTickets(props.isAdmin));

// Status helper from store
const formatStatus = (status) => ticketsStore.formatStatus(status);

// Get username from ID (for admin view)
const getUsername = (userId) => usersStore.getUsername(userId);

// Format relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);

    if (diffSec < 60) return 'à l\'instant';

    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return `il y a ${diffMin} min${diffMin > 1 ? 's' : ''}`;

    const diffHour = Math.round(diffMin / 60);
    if (diffHour < 24) return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;

    const diffDay = Math.round(diffHour / 24);
    if (diffDay < 30) return `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;

    // Default to standard date format for older dates
    return formatDate(dateString);
};

// Confirm before closing ticket (for regular users)
const confirmCloseTicket = (ticketId) => {
    if (confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) {
        try {
            console.log("Tentative de fermeture du ticket depuis la liste:", ticketId);
            emit('update-status', ticketId, 'closed');
        } catch (error) {
            console.error("Erreur lors de la fermeture du ticket:", error);
        }
    }
};

// View ticket details
const viewTicketDetails = (ticketId) => {
    emit('viewTicket', ticketId);
};
</script>