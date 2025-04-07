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
                      required
                />
            </div>

            <div>
                <label for="ticket-category" class="block text-sm font-medium text-gray-700">Catégorie (optionnel)</label>
                <select
                      id="ticket-category"
                      v-model="ticketCategory"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner une catégorie --</option>
                    <option value="technique">Problème technique</option>
                    <option value="acces">Problème d'accès</option>
                    <option value="question">Question</option>
                    <option value="autre">Autre</option>
                </select>
            </div>

            <div>
                <label for="ticket-priority" class="block text-sm font-medium text-gray-700">Priorité</label>
                <div class="mt-1 flex items-center space-x-4">
                    <label class="inline-flex items-center">
                        <input
                              type="radio"
                              name="priority"
                              value="low"
                              v-model="ticketPriority"
                              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Faible</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                              type="radio"
                              name="priority"
                              value="medium"
                              v-model="ticketPriority"
                              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Moyenne</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                              type="radio"
                              name="priority"
                              value="high"
                              v-model="ticketPriority"
                              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Élevée</span>
                    </label>
                </div>
            </div>

            <div>
                <label for="ticket-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                      id="ticket-description"
                      v-model="ticketDescription"
                      placeholder="Décrivez votre problème en détail"
                      rows="5"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                ></textarea>
                <p class="mt-1 text-sm text-gray-500">
                    Veuillez inclure autant de détails que possible pour nous aider à résoudre votre problème rapidement.
                </p>
            </div>

            <!-- Future: File attachment
            <div>
                <label class="block text-sm font-medium text-gray-700">Pièce jointe (optionnel)</label>
                <div class="mt-1 flex items-center">
                    <input type="file" class="sr-only" id="file-upload" ref="fileInput">
                    <label for="file-upload" class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                        Choisir un fichier
                    </label>
                    <span class="ml-3 text-sm text-gray-500" id="file-name">Aucun fichier choisi</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF, PDF jusqu'à 10MB
                </p>
            </div>
            -->

            <div class="flex justify-end space-x-3">
                <button
                      type="button"
                      @click="cancelForm"
                      class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      :disabled="isSubmittingTicket"
                >
                    <span v-if="isSubmittingTicket">Création en cours...</span>
                    <span v-else>Créer le ticket</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';

const props = defineProps({
    userId: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['cancel']);

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

const ticketCategory = computed({
    get: () => ticketsStore.ticketCategory,
    set: (value) => ticketsStore.ticketCategory = value
});

const ticketPriority = computed({
    get: () => ticketsStore.ticketPriority,
    set: (value) => ticketsStore.ticketPriority = value
});

const isSubmittingTicket = computed(() => ticketsStore.isSubmittingTicket);

// Submit ticket
const submitTicket = async () => {
    console.log("submitTicket appelé");
    if (!ticketTitle.value || !ticketDescription.value) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        console.log("Tentative de création de ticket avec isAdmin =", props.isAdmin);
        const newTicket = await ticketsStore.createTicket(props.isAdmin);
        console.log("Ticket créé:", newTicket);
        // After successful creation, form fields are reset in the store
    } catch (error) {
        console.error('Error submitting ticket:', error);
    }
};

// Cancel form
const cancelForm = () => {
    // Reset the form fields
    ticketsStore.resetTicketForm();
    // Emit cancel event to parent
    emit('cancel');
};
</script>