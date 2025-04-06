<!-- components/dashboard/tickets/TicketsPanel.vue -->
<template>
    <div class="bg-white rounded-lg shadow">
        <!-- Header with title and new ticket button -->
        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ isAdmin ? 'Gestion des tickets' : 'Vos tickets' }}</h3>

            <!-- New Ticket button (only for regular users) -->
            <button
                  v-if="!isAdmin"
                  @click="toggleNewTicketForm"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <span v-if="!showNewTicketForm">Nouveau ticket</span>
                <span v-else>Annuler</span>
            </button>
        </div>

        <!-- New Ticket Form (for regular users) -->
        <TicketForm v-if="!isAdmin && showNewTicketForm" :user-id="user?.id" @cancel="showNewTicketForm = false" />

        <!-- Ticket Filters -->
        <TicketFilters :is-admin="isAdmin" />

        <!-- Tickets List -->
        <TicketsList :is-admin="isAdmin" :user="user" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';
import TicketForm from './TicketForm.vue';
import TicketFilters from './TicketFilters.vue';
import TicketsList from './TicketsList.vue';

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

const showNewTicketForm = computed({
    get: () => ticketsStore.showNewTicketForm,
    set: (value) => ticketsStore.showNewTicketForm = value
});

// Toggle new ticket form visibility
const toggleNewTicketForm = () => {
    showNewTicketForm.value = !showNewTicketForm.value;
};
</script>