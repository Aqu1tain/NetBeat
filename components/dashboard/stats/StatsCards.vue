<!-- components/dashboard/stats/StatsCards.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">
            {{ isAdmin ? 'Bienvenue sur le panneau d\'administration' : 'Bienvenue sur votre tableau de bord' }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <!-- Tickets Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-200 text-blue-800">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-800">Tickets</h3>
                        <p class="text-2xl font-bold text-gray-900">{{ ticketsCount }}</p>
                        <p class="text-sm text-gray-600">{{ openTicketsCount }} ouvert(s)</p>
                    </div>
                </div>
            </div>

            <!-- Resolved Tickets Card -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-200 text-green-800">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-800">{{ isAdmin ? 'Tickets résolus' : 'Vos tickets résolus' }}</h3>
                        <p class="text-2xl font-bold text-gray-900">{{ closedTicketsCount }}</p>
                        <p class="text-sm text-gray-600">{{ resolutionRate }}% de résolution</p>
                    </div>
                </div>
            </div>

            <!-- Third Card - Admin: Users, Regular User: Pending -->
            <div v-if="isAdmin" class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-200 text-purple-800">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-800">Utilisateurs</h3>
                        <p class="text-2xl font-bold text-gray-900">{{ usersCount }}</p>
                        <p class="text-sm text-gray-600">{{ adminCount }} admin(s)</p>
                    </div>
                </div>
            </div>

            <!-- Regular User Pending Card -->
            <div v-else class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-200 text-yellow-800">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-800">En attente</h3>
                        <p class="text-2xl font-bold text-gray-900">{{ pendingTicketsCount }}</p>
                        <p class="text-sm text-gray-600">Tickets nécessitant attention</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTicketsStore } from '~/stores/tickets';
import { useUsersStore } from '~/stores/users';
import { useAuth } from '~/utils/auth';

const props = defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const ticketsStore = useTicketsStore();
const usersStore = useUsersStore();
const { user } = useAuth();

// Tickets stats
const ticketsCount = computed(() => ticketsStore.tickets.length);
const openTicketsCount = computed(() => ticketsStore.openTicketsCount);
const closedTicketsCount = computed(() => ticketsStore.closedTicketsCount);
const pendingTicketsCount = computed(() => ticketsStore.pendingTicketsCount(user.value?.id));

// Resolution rate
const resolutionRate = computed(() => {
    return Math.round((closedTicketsCount.value / (ticketsCount.value || 1)) * 100);
});

// User stats (admin only)
const usersCount = computed(() => usersStore.usersCount);
const adminCount = computed(() => usersStore.adminCount);
</script>