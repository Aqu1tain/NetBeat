<!-- components/dashboard/tickets/TicketDetail.vue -->
<template>
    <div class="bg-white rounded-lg shadow">
        <!-- Back button and ticket header -->
        <div class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <button
                          @click="$emit('back')"
                          class="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                          title="Retour aux tickets"
                    >
                        <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              class="w-5 h-5"
                        >
                            <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>
                    <h3 class="text-lg font-medium">Ticket #{{ ticket._id.substring(0, 6) }}</h3>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Priority Badge -->
                    <span
                          :class="{
                            'bg-green-100 text-green-800': ticket.priority === 'low',
                            'bg-blue-100 text-blue-800': ticket.priority === 'medium',
                            'bg-red-100 text-red-800': ticket.priority === 'high'
                        }"
                          class="px-2 py-1 text-xs rounded-full font-medium"
                    >
                        {{ ticket.priority === 'low' ? 'Faible' : ticket.priority === 'medium' ? 'Moyenne' : 'Élevée' }}
                    </span>

                    <!-- Status Badge -->
                    <span
                          :class="{
                            'bg-blue-100 text-blue-800': ticket.status === 'new',
                            'bg-yellow-100 text-yellow-800': ticket.status === 'in_progress',
                            'bg-orange-100 text-orange-800': ticket.status === 'waiting_user',
                            'bg-green-100 text-green-800': ticket.status === 'closed'
                        }"
                          class="px-2 py-1 text-xs rounded-full font-medium"
                    >
                        {{ formatStatus(ticket.status).text }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Ticket content -->
        <div class="p-6 border-b border-gray-200">
            <h2 class="text-xl font-semibold mb-3">{{ ticket.title }}</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ ticket.description }}</p>

            <!-- Ticket metadata -->
            <div class="mt-4 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:space-x-6">
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Créé le {{ formatDate(ticket.createdAt) }}</span>
                </div>

                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>
                        Par {{ ticket.createdBy?.username || 'Utilisateur inconnu' }}
                    </span>
                </div>

                <div v-if="ticket.assignedTo && isAdmin" class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>
                        Assigné à {{ ticket.assignedTo?.username || 'personne' }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Admin actions -->
        <div v-if="isAdmin" class="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div class="flex flex-wrap gap-2 justify-between">
                <div class="flex flex-wrap gap-2">
                    <!-- Status Actions -->
                    <div class="relative" v-if="ticket.status !== 'closed'">
                        <button
                              @click="showStatusDropdown = !showStatusDropdown"
                              class="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 flex items-center space-x-1"
                        >
                            <span>Changer statut</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-if="showStatusDropdown" class="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div class="py-1" role="menu" aria-orientation="vertical">
                                <button
                                      v-for="status in availableStatuses"
                                      :key="status.value"
                                      @click="updateStatus(status.value); showStatusDropdown = false"
                                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      role="menuitem"
                                >
                                    {{ status.label }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Reopen if closed -->
                    <button
                          v-if="ticket.status === 'closed'"
                          @click="updateStatus('in_progress')"
                          class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                    >
                        Réouvrir le ticket
                    </button>

                    <!-- Priority Actions -->
                    <div class="relative">
                        <button
                              @click="showPriorityDropdown = !showPriorityDropdown"
                              class="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 flex items-center space-x-1"
                        >
                            <span>Priorité</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-if="showPriorityDropdown" class="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div class="py-1" role="menu" aria-orientation="vertical">
                                <button
                                      v-for="priority in availablePriorities"
                                      :key="priority.value"
                                      @click="updatePriority(priority.value); showPriorityDropdown = false"
                                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      role="menuitem"
                                >
                                    {{ priority.label }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Assign Action -->
                    <div class="relative" v-if="isAdmin">
                        <button
                              @click="showAssignDropdown = !showAssignDropdown"
                              class="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 flex items-center space-x-1"
                        >
                            <span>{{ ticket.assignedTo && ticket.assignedTo._id === user._id ? 'Réassigner' : ticket.assignedTo ? 'Réassigner' : 'Assigner' }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-if="showAssignDropdown" class="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div class="py-1" role="menu" aria-orientation="vertical">
                                <!-- Option to assign to self -->
                                <button
                                      @click="assignToSelf(); showAssignDropdown = false"
                                      class="block w-full text-left px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                                      role="menuitem"
                                >
                                    <span v-if="ticket.assignedTo && ticket.assignedTo._id === user._id">
                                        ✓ Assigné à moi-même
                                    </span>
                                    <span v-else>
                                        M'assigner ce ticket
                                    </span>
                                </button>

                                <!-- Divider -->
                                <div class="border-t border-gray-100 my-1"></div>

                                <!-- Other admins -->
                                <button
                                      v-for="admin in otherAdmins"
                                      :key="admin._id"
                                      @click="assignTicket(admin._id); showAssignDropdown = false"
                                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      role="menuitem"
                                >
                                    <span v-if="ticket.assignedTo && ticket.assignedTo._id === admin._id">
                                        ✓ {{ admin.username }}
                                    </span>
                                    <span v-else>
                                        {{ admin.username }}
                                    </span>
                                </button>

                                <!-- Unassign option -->
                                <div v-if="ticket.assignedTo" class="border-t border-gray-100 my-1"></div>
                                <button
                                      v-if="ticket.assignedTo"
                                      @click="unassignTicket(); showAssignDropdown = false"
                                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      role="menuitem"
                                >
                                    Retirer l'assignation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Request closure from user -->
                <div v-if="ticket.status !== 'closed' && ticket.status !== 'waiting_user'" class="flex items-center">
                    <button
                          @click="requestClosure"
                          class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200 flex items-center space-x-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Demander la résolution
                    </button>
                </div>
            </div>
        </div>

        <!-- User actions -->
        <div v-else-if="ticket.status !== 'closed'" class="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <div>
                <button
                      type="button"
                      @click="closeTicket"
                      class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                    Marquer comme résolu
                </button>
            </div>

            <!-- Display info to user when admin is requesting resolution -->
            <div v-if="ticket.status === 'waiting_user'" class="text-yellow-700 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                Action requise: Veuillez confirmer la résolution
            </div>
        </div>

        <!-- Comments section -->
        <div class="divide-y divide-gray-200">
            <!-- Loading indicator -->
            <div v-if="isLoadingComments" class="py-8 text-center text-gray-500">
                <svg class="animate-spin h-6 w-6 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Chargement des commentaires...</p>
            </div>

            <!-- No comments yet -->
            <div v-else-if="comments.length === 0" class="py-8 text-center text-gray-500">
                <p>Aucun commentaire pour le moment</p>
            </div>

            <!-- Comments list -->
            <div v-else>
                <div
                      v-for="comment in comments"
                      :key="comment._id"
                      :class="[
                        'p-6',
                        comment.isInternal ? 'bg-yellow-50' : '',
                        comment.createdBy._id === ticket.createdBy._id ? 'bg-blue-50' : ''
                    ]"
                >
                    <div class="flex items-start">
                        <!-- User avatar (placeholder) -->
                        <div class="flex-shrink-0 mr-4">
                            <div
                                  :class="[
                                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-medium',
                                    comment.createdBy.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                                ]"
                            >
                                {{ comment.createdBy.username.charAt(0).toUpperCase() }}
                            </div>
                        </div>

                        <!-- Comment content -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-1">
                                <h4 class="text-sm font-medium text-gray-900">
                                    {{ comment.createdBy.username }}
                                    <span v-if="comment.createdBy.role === 'admin'" class="ml-2 text-xs bg-red-100 text-red-800 py-0.5 px-1.5 rounded-full">
                                        Admin
                                    </span>
                                    <span v-if="comment.isInternal" class="ml-2 text-xs bg-yellow-100 text-yellow-800 py-0.5 px-1.5 rounded-full">
                                        Note interne
                                    </span>
                                </h4>
                                <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                            </div>

                            <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                                {{ comment.content }}
                            </div>

                            <!-- Show attachment if present -->
                            <div v-if="comment.attachmentUrl" class="mt-2">
                                <a :href="comment.attachmentUrl" target="_blank" class="text-sm text-blue-600 hover:underline flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    Pièce jointe
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comment form (if ticket is not closed) -->
        <div v-if="ticket.status !== 'closed'" class="p-6 bg-gray-50">
            <form @submit.prevent="submitComment">
                <div class="mb-3">
                    <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
                        Ajouter un commentaire
                    </label>
                    <textarea
                          id="comment"
                          v-model="commentContent"
                          rows="4"
                          placeholder="Votre message..."
                          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                </div>

                <!-- Admin-only internal note checkbox -->
                <div v-if="isAdmin" class="flex items-center mb-4">
                    <input
                          id="internal-note"
                          type="checkbox"
                          v-model="isInternalNote"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="internal-note" class="ml-2 block text-sm text-gray-700">
                        Note interne (visible uniquement par les administrateurs)
                    </label>
                </div>

                <!-- Future: Attachment upload
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Pièce jointe (optionnel)
                    </label>
                    <div class="flex items-center">
                        <input type="file" class="sr-only" id="file-upload" ref="fileInput">
                        <label for="file-upload" class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                            Choisir un fichier
                        </label>
                        <span class="ml-3 text-sm text-gray-500" id="file-name">Aucun fichier choisi</span>
                    </div>
                </div>
                -->

                <div class="flex justify-end">
                    <button
                          type="submit"
                          class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          :disabled="isSubmittingComment"
                    >
                        <span v-if="isSubmittingComment">Envoi...</span>
                        <span v-else>Envoyer</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Closed message -->
        <div v-else class="p-6 bg-green-50 text-green-800 flex justify-between items-center">
            <div class="text-sm">
                Ce ticket a été résolu et est maintenant fermé. Créez un nouveau ticket si vous avez besoin d'assistance supplémentaire.
            </div>

            <!-- Reopen button (for both users and admins) -->
            <button
                  type="button"
                  @click="reopenTicket"
                  class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
                Réouvrir
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTicketsStore } from '~/stores/tickets';
import { useUsersStore } from '~/stores/users';
import { formatDate } from '~/utils/formatters';

const props = defineProps({
    ticket: {
        type: Object,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['back', 'update']);

const ticketsStore = useTicketsStore();
const usersStore = useUsersStore();

// Dropdown states
const showStatusDropdown = ref(false);
const showPriorityDropdown = ref(false);
const showAssignDropdown = ref(false);

// Comment form state
const commentContent = computed({
    get: () => ticketsStore.commentContent,
    set: (value) => ticketsStore.commentContent = value
});

const isInternalNote = computed({
    get: () => ticketsStore.isInternalNote,
    set: (value) => ticketsStore.isInternalNote = value
});

// Loading & submitting states
const isLoadingComments = computed(() => ticketsStore.isLoadingComments);
const isSubmittingComment = computed(() => ticketsStore.isSubmittingComment);

// Comments from store
const comments = computed(() => ticketsStore.ticketComments);

// Status helper from store
const formatStatus = (status) => ticketsStore.formatStatus(status);

// Admin users for assignment
const admins = computed(() => usersStore.admins);
const otherAdmins = computed(() =>
      admins.value.filter(admin => admin._id !== props.user._id)
);

// Available statuses for admin
const availableStatuses = [
    { value: 'new', label: 'Nouveau' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'waiting_user', label: 'En attente de l\'utilisateur' },
    { value: 'closed', label: 'Résolu/Fermé' }
];

// Available priorities for admin
const availablePriorities = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Élevée' }
];

// Fetch comments on mount
onMounted(async () => {
    await ticketsStore.fetchTicketComments(props.ticket._id);
});

// Actions
const updateStatus = async (newStatus) => {
    await ticketsStore.updateTicketStatus(props.ticket._id, newStatus);
    emit('update');
};

const updatePriority = async (newPriority) => {
    await ticketsStore.updateTicketPriority(props.ticket._id, newPriority);
    emit('update');
};

const assignTicket = async (adminId) => {
    await ticketsStore.assignTicket(props.ticket._id, adminId);
    emit('update');
};

const assignToSelf = async () => {
    await ticketsStore.assignTicket(props.ticket._id, props.user._id);
    emit('update');
};

const unassignTicket = async () => {
    await ticketsStore.unassignTicket(props.ticket._id);
    emit('update');
};

const reopenTicket = async () => {
    await ticketsStore.updateTicketStatus(props.ticket._id, 'in_progress');
    emit('update');
};

const requestClosure = async () => {
    // Add a comment requesting the user to close the ticket
    ticketsStore.commentContent = "Ce ticket peut être résolu de votre côté. Pourriez-vous le marquer comme résolu si votre problème est résolu ?";
    ticketsStore.isInternalNote = false;
    await ticketsStore.addComment(props.ticket._id);

    // Update ticket status to waiting_user
    await ticketsStore.updateTicketStatus(props.ticket._id, 'waiting_user');
    emit('update');
};

const closeTicket = async () => {
    if (confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) {
        try {
            console.log("Tentative de fermeture du ticket:", props.ticket._id);
            const updatedTicket = await ticketsStore.updateTicketStatus(props.ticket._id, 'closed');
            console.log("Ticket mis à jour:", updatedTicket);
            emit('update');
        } catch (error) {
            console.error("Erreur lors de la fermeture du ticket:", error);
        }
    }
};

const submitComment = async () => {
    await ticketsStore.addComment(props.ticket._id);
    emit('update');
};
</script>