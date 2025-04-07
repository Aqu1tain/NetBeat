<!-- components/dashboard/tickets/TicketFilters.vue -->
<template>
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <!-- Status Filter -->
            <div class="flex flex-wrap gap-2">
                <button
                      @click="setTicketFilter('all')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="ticketFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    Tous
                </button>
                <button
                      @click="setTicketFilter('open')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="ticketFilter === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    En cours
                </button>
                <button
                      @click="setTicketFilter('waiting')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="ticketFilter === 'waiting' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    En attente
                </button>
                <button
                      @click="setTicketFilter('closed')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="ticketFilter === 'closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    Résolus
                </button>

                <!-- Admin gets more specific filters -->
                <div v-if="isAdmin" class="ml-0 sm:ml-2 mt-2 sm:mt-0">
                    <button
                          @click="setTicketFilter('new')"
                          class="px-3 py-1 text-sm rounded-md"
                          :class="ticketFilter === 'new' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                    >
                        Nouveaux
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <!-- Priority Filter (Admin only) -->
                <div v-if="isAdmin" class="relative">
                    <select
                          v-model="ticketPriorityFilter"
                          class="pl-3 pr-8 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                        <option value="all">Toutes priorités</option>
                        <option value="high">Élevée</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Faible</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <!-- Search (Admin only) -->
                <div v-if="isAdmin" class="relative">
                    <input
                          v-model="ticketSearch"
                          type="text"
                          placeholder="Rechercher..."
                          class="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                    />
                    <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';

defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const ticketsStore = useTicketsStore();

// Ticket filter from store
const ticketFilter = computed({
    get: () => ticketsStore.ticketFilter,
    set: (value) => ticketsStore.ticketFilter = value
});

// Ticket priority filter from store (admin only)
const ticketPriorityFilter = computed({
    get: () => ticketsStore.ticketPriorityFilter,
    set: (value) => ticketsStore.ticketPriorityFilter = value
});

// Ticket search from store (admin only)
const ticketSearch = computed({
    get: () => ticketsStore.ticketSearch,
    set: (value) => ticketsStore.ticketSearch = value
});

// Set filter
const setTicketFilter = (filter) => {
    ticketFilter.value = filter;
};
</script>