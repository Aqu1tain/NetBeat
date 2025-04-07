<!-- components/dashboard/tickets/TicketsPanel.vue -->
<template>
    <div class="bg-white rounded-lg shadow">
        <!-- Ticket List View -->
        <div v-if="!selectedTicket">
            <!-- Header with title and new ticket button -->
            <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-medium">{{ isAdmin ? 'Gestion des tickets' : 'Vos tickets' }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ ticketCountsText }}</p>
                </div>

                <!-- New Ticket button (for all users) -->
                <button
                      @click="toggleNewTicketForm"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <span v-if="!showNewTicketForm">Nouveau ticket</span>
                    <span v-else>Annuler</span>
                </button>
            </div>

            <!-- New Ticket Form -->
            <TicketForm
                  v-if="showNewTicketForm"
                  :user-id="user?.id"
                  :is-admin="isAdmin"
                  @cancel="showNewTicketForm = false"
            />

            <!-- Ticket Filters -->
            <TicketFilters :is-admin="isAdmin" />

            <!-- Tickets List -->
            <TicketsList
                  :is-admin="isAdmin"
                  :user="user"
                  @view-ticket="viewTicket"
                  @update-status="updateTicketStatus"
                  @assign-to="openAssignModal"
            />
        </div>

        <!-- Ticket Detail View -->
        <TicketDetail
              v-else
              :ticket="selectedTicket"
              :is-admin="isAdmin"
              :user="user"
              @back="backToList"
              @update="refreshTicket"
        />

        <!-- Assignment Modal (Admin only) -->
        <div v-if="showAssignModal && isAdmin" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium">Assigner le ticket</h3>
                </div>

                <div class="p-6">
                    <p class="text-gray-700 mb-4">Choisissez un administrateur pour assigner ce ticket :</p>

                    <div class="space-y-2 max-h-60 overflow-y-auto">
                        <button
                              v-for="admin in admins"
                              :key="admin._id"
                              @click="assignTicket(ticketToAssign, admin._id)"
                              class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center space-x-3"
                        >
                            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                                {{ admin.username.charAt(0).toUpperCase() }}
                            </div>
                            <span>{{ admin.username }}</span>
                        </button>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button
                              @click="showAssignModal = false"
                              class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTicketsStore } from '~/stores/tickets';
import { useUsersStore } from '~/stores/users';
import TicketForm from './TicketForm.vue';
import TicketFilters from './TicketFilters.vue';
import TicketsList from './TicketsList.vue';
import TicketDetail from './TicketDetail.vue';

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

// UI state
const selectedTicket = ref(null);
const showAssignModal = ref(false);
const ticketToAssign = ref(null);

// Form visibility from store
const showNewTicketForm = computed({
    get: () => ticketsStore.showNewTicketForm,
    set: (value) => {
        console.log("Modification de showNewTicketForm à:", value);
        ticketsStore.showNewTicketForm = value;
    }
});

// Ticket counts for display
const ticketCounts = computed(() => ticketsStore.ticketCounts);
const ticketCountsText = computed(() => {
    if (props.isAdmin) {
        return `${ticketCounts.value.total} tickets au total (${ticketCounts.value.new} nouveaux, ${ticketCounts.value.inProgress} en cours, ${ticketCounts.value.waitingUser} en attente, ${ticketCounts.value.closed} résolus)`;
    } else {
        const openCount = ticketCounts.value.new + ticketCounts.value.inProgress + ticketCounts.value.waitingUser;
        return `${ticketCounts.value.total} tickets au total (${openCount} actifs, ${ticketCounts.value.closed} résolus)`;
    }
});

// Admin users list
const admins = computed(() => usersStore.admins);

// Fetch users for assignment (admins only)
watch(() => props.isAdmin, (isAdmin) => {
    if (isAdmin) {
        usersStore.fetchUsers();
    }
}, { immediate: true });

// Toggle new ticket form visibility
const toggleNewTicketForm = () => {
    console.log("toggleNewTicketForm appelé");
    showNewTicketForm.value = !showNewTicketForm.value;
    console.log("Nouvelle valeur de showNewTicketForm:", showNewTicketForm.value);

    // If hiding the form, refresh the tickets
    if (!showNewTicketForm.value) {
        ticketsStore.fetchTickets(props.isAdmin);
    }
};

// View a specific ticket
const viewTicket = async (ticketId) => {
    try {
        const ticket = await ticketsStore.fetchTicketDetails(ticketId);
        if (ticket) {
            selectedTicket.value = ticket;
        }
    } catch (error) {
        console.error('Error loading ticket:', error);
    }
};

// Go back to the ticket list
const backToList = () => {
    selectedTicket.value = null;
    ticketsStore.currentTicket = null;
    ticketsStore.ticketComments = [];
};

// Refresh current ticket
const refreshTicket = async () => {
    if (selectedTicket.value?._id) {
        await viewTicket(selectedTicket.value._id);
    }
};

// Update ticket status
const updateTicketStatus = async (ticketId, newStatus) => {
    console.log("Mise à jour du statut du ticket:", ticketId, "vers", newStatus);
    try {
        await ticketsStore.updateTicketStatus(ticketId, newStatus);

        // If we're viewing this ticket, refresh it
        if (selectedTicket.value?._id === ticketId) {
            await refreshTicket();
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
    }
};

// Open assign modal
const openAssignModal = (ticketId) => {
    ticketToAssign.value = ticketId;
    showAssignModal.value = true;
};

// Assign ticket to admin
const assignTicket = async (ticketId, adminId) => {
    await ticketsStore.assignTicket(ticketId, adminId);
    showAssignModal.value = false;

    // If we're viewing this ticket, refresh it
    if (selectedTicket.value?._id === ticketId) {
        await refreshTicket();
    }
};
</script>