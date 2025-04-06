<!-- components/dashboard/tickets/TicketForm.vue -->
<template>
    <div class="border-b border-gray-200 p-6 bg-gray-50">
        <form @submit.prevent="submitTicket" class="space-y-4">
            <div>
                <label for="ticket-title" class="block text-sm font-medium text-gray-700">Titre</label>
                <input
                      id="ticket-title"
                      v-model="ticketTitle"
                      type="text"
                      placeholder="Titre du ticket"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label for="ticket-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                      id="ticket-description"
                      v-model="ticketDescription"
                      placeholder="Décrivez votre problème en détail"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
                <button
                      type="button"
                      @click="$emit('cancel')"
                      class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      :disabled="isSubmittingTicket"
                >
                    <span v-if="isSubmittingTicket">Création...</span>
                    <span v-else>Créer le ticket</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';

defineProps({
    userId: {
        type: String,
        required: true
    }
});

defineEmits(['cancel']);

const ticketsStore = useTicketsStore();

// Form state from store
const ticketTitle = computed({
    get: () => ticketsStore.ticketTitle,
    set: (value) => ticketsStore.ticketTitle = value
});

const ticketDescription = computed({
    get: () => ticketsStore.ticketDescription,
    set: (value) => ticketsStore.ticketDescription = value
});

const isSubmittingTicket = computed(() => ticketsStore.isSubmittingTicket);

// Submit ticket
const submitTicket = async () => {
    await ticketsStore.createTicket();
};
</script>