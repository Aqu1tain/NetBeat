<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 class="text-xl font-bold">Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <p class="text-gray-700">Bienvenue, <span class="font-semibold">{{ user.username }}</span> ({{ user.role }})</p>
                    <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Déconnexion
                    </button>
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 py-8">
            <!-- Section Supervision (placeholder) -->
            <section class="mt-8">
                <h2 class="text-2xl font-bold mb-4">Supervision</h2>
                <div class="p-4 bg-white rounded shadow">
                    <p>Les données de monitoring s'afficheront ici...</p>
                </div>
            </section>

            <!-- Section Ticketing -->
            <section class="mt-8">
                <h2 class="text-2xl font-bold mb-4">Tickets</h2>

                <!-- Formulaire de création de ticket (accessible aux utilisateurs classiques) -->
                <div v-if="user.role === 'user'" class="mb-4">
                    <form @submit.prevent="createTicket" class="flex flex-col space-y-2">
                        <input
                              v-model="ticketTitle"
                              type="text"
                              placeholder="Titre du ticket"
                              class="p-2 border border-gray-300 rounded"
                        />
                        <textarea
                              v-model="ticketDescription"
                              placeholder="Description du problème"
                              class="p-2 border border-gray-300 rounded"
                        ></textarea>
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            Créer un ticket
                        </button>
                    </form>
                </div>

                <!-- Liste des tickets -->
                <div>
                    <h3 class="text-xl font-semibold mb-2">
                        {{ user.role === 'admin' ? 'Gestion des tickets (Vue technique)' : 'Vos tickets' }}
                    </h3>
                    <ul>
                        <li
                              v-for="ticket in tickets"
                              :key="ticket._id"
                              class="p-4 mb-2 bg-white rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
                        >
                            <div class="w-full">
                                <h4 class="font-bold">{{ ticket.title }}</h4>
                                <p>{{ ticket.description }}</p>
                                <p class="text-sm text-gray-500">
                                    Créé le : {{ formatDate(ticket.createdAt) }} - Statut :
                                    <span :class="ticket.status === 'open' ? 'text-red-500' : 'text-green-500'">
                    {{ ticket.status }}
                  </span>
                                </p>
                                <!-- Affichage technique pour l'admin -->
                                <div v-if="user.role === 'admin'" class="mt-2 text-xs text-gray-600">
                                    <p>ID Ticket: {{ ticket._id }}</p>
                                    <p>Créé par: {{ ticket.createdBy.username || ticket.createdBy }}</p>
                                </div>
                            </div>
                            <!-- Actions de gestion pour l'admin -->
                            <div v-if="user.role === 'admin'" class="mt-4 md:mt-0">
                                <button
                                      @click="updateTicketStatus(ticket._id, 'closed')"
                                      v-if="ticket.status === 'open'"
                                      class="px-3 py-1 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                >
                                    Marquer comme résolu
                                </button>
                                <button
                                      @click="updateTicketStatus(ticket._id, 'open')"
                                      v-if="ticket.status === 'closed'"
                                      class="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                                >
                                    Réouvrir
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';

const user = ref({});
const router = useRouter();
const tickets = ref([]);
const ticketTitle = ref('');
const ticketDescription = ref('');

// Charge les tickets en fonction du rôle
async function fetchTickets() {
    try {
        const token = localStorage.getItem('token');
        // Si l'utilisateur est admin, on peut imaginer un endpoint qui renvoie tous les tickets
        const endpoint = user.value.role === 'admin' ? '/api/tickets/all' : '/api/tickets';
        const data = await $fetch(endpoint, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        tickets.value = data.tickets;
    } catch (err) {
        console.error(err);
    }
}

async function createTicket() {
    try {
        const token = localStorage.getItem('token');
        await $fetch('/api/tickets', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: { title: ticketTitle.value, description: ticketDescription.value },
        });
        // Reset le formulaire et rafraîchit la liste
        ticketTitle.value = '';
        ticketDescription.value = '';
        fetchTickets();
    } catch (err) {
        console.error(err);
    }
}

// Pour l'admin : action pour changer le statut d'un ticket
async function updateTicketStatus(ticketId, newStatus) {
    try {
        const token = localStorage.getItem('token');
        await $fetch(`/api/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
            },
            body: { status: newStatus },
        });
        fetchTickets();
    } catch (err) {
        console.error(err);
    }
}

function logout() {
    localStorage.removeItem('token');
    router.push('/login');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString();
}

onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
    } else {
        try {
            user.value = jwt_decode(token);
            fetchTickets();
        } catch (error) {
            router.push('/login');
        }
    }
});
</script>
