<!-- pages/dashboard.vue -->
<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Loading Screen -->
        <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600">Chargement du tableau de bord...</p>
            </div>
        </div>

        <template v-else>
            <!-- Navbar -->
            <DashboardNavbar
                  :user="user"
                  :is-admin="isAdmin"
                  :session-time="sessionTime"
                  @logout="logout"
            />

            <!-- Main Content with Sidebar -->
            <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row">
                    <!-- Sidebar Navigation -->
                    <DashboardSidebar
                          :active-tab="activeTab"
                          :is-admin="isAdmin"
                          @update:active-tab="activeTab = $event"
                    />

                    <!-- Main Content Area -->
                    <div class="flex-1 md:ml-6">
                        <!-- Dashboard Tab -->
                        <DashboardStats v-if="activeTab === 'dashboard'" :is-admin="isAdmin" />

                        <!-- Tickets Tab -->
                        <TicketsPanel
                              v-if="activeTab === 'tickets'"
                              :is-admin="isAdmin"
                              :user="user"
                        />

                        <!-- Admin-Only Devices Tab -->
                        <DevicesPanel
                              v-if="isAdmin && activeTab === 'devices'"
                        />

                        <!-- Admin-Only Users Tab -->
                        <UsersPanel
                              v-if="isAdmin && activeTab === 'users'"
                        />

                        <VersionPanel
                            v-if="activeTab === 'version'"
                        />

                        <!-- Admin-Only Logs Tab -->
                        <div v-if="isAdmin && activeTab === 'logs'" class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-xl font-semibold mb-4">Journaux système</h2>
                            <p class="text-gray-600">Accès aux journaux système pour le débogage.</p>
                            <!-- Placeholder for logs UI -->
                            <div class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mt-4">
                                Cette fonctionnalité est en cours de développement.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SNMP Query Modal -->
            <SNMPQueryViewer
                  v-if="showSnmpQueryModal"
                  :show="showSnmpQueryModal"
                  :device="selectedQueryDevice"
                  @close="showSnmpQueryModal = false"
                  @update-device="handleDeviceUpdate"
            />
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/utils/auth';
import { useTicketsStore } from '~/stores/tickets';
import { useDevicesStore } from '~/stores/devices';
import { useUsersStore } from '~/stores/users';
import { useActivityStore } from '~/stores/activity';

import DashboardNavbar from '~/components/dashboard/Navbar.vue';
import DashboardSidebar from '~/components/dashboard/Sidebar.vue';
import DashboardStats from '~/components/dashboard/stats/DashboardStats.vue';
import TicketsPanel from '~/components/dashboard/tickets/TicketsPanel.vue';
import DevicesPanel from '~/components/dashboard/devices/DevicesPanel.vue';
import UsersPanel from '~/components/dashboard/users/UsersPanel.vue';
import VersionPanel from '~/components/dashboard/version/VersionPanel.vue';
import SNMPQueryViewer from '~/components/SNMPQueryViewer.vue';

// Auth & routing
const router = useRouter();
const { user, isAdmin, logout, initAuth, setupTokenRefresh, getSessionTimeRemaining } = useAuth();

// Loading state
const isLoading = ref(true);

// UI State
const activeTab = ref('dashboard');
const sessionTime = ref(null);
const sessionRefreshInterval = ref(null);

// Stores
const ticketsStore = useTicketsStore();
const devicesStore = useDevicesStore();
const usersStore = useUsersStore();
const activityStore = useActivityStore();

// SNMP Query Modal State
const showSnmpQueryModal = ref(false);
const selectedQueryDevice = ref(null);

// Handle device update from SNMP query modal
const handleDeviceUpdate = async (updatedDevice) => {
    await devicesStore.updateDevice(updatedDevice._id, { oids: updatedDevice.oids });
    activityStore.addActivity({
        type: 'device_updated',
        message: `OIDs de l'appareil "${updatedDevice.name}" mis à jour`,
        timestamp: new Date()
    });
};

// Update session time display
const updateSessionTime = () => {
    if (process.server) return;
    sessionTime.value = getSessionTimeRemaining();
};

// Load initial data
const loadInitialData = async () => {
    try {
        // Load tickets first
        await ticketsStore.fetchTickets(isAdmin.value);

        // Then load admin-specific data if needed
        if (isAdmin.value) {
            await usersStore.fetchUsers();
            if (activeTab.value === 'devices') {
                await devicesStore.fetchDevices();
            }
        }

        // Set up activity data if needed
        if (activityStore.activities.length === 0) {
            activityStore.initializeDefaultActivities();
        }
    } catch (error) {
        console.error('Error loading initial data:', error);
    } finally {
        // Finish loading
        isLoading.value = false;
    }
};

// Lifecycle hooks
onMounted(async () => {
    if (process.server) return;

    try {
        // Initialize auth
        const isAuthed = await initAuth();
        if (!isAuthed) {
            router.push('/login');
            return;
        }

        // Set up token refresh
        setupTokenRefresh();

        // Load data
        await loadInitialData();

        // Update session time every minute
        updateSessionTime();
        sessionRefreshInterval.value = setInterval(updateSessionTime, 60000);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        isLoading.value = false;
    }
});

onUnmounted(() => {
    // Clear interval when component is destroyed
    if (process.client && sessionRefreshInterval.value) {
        clearInterval(sessionRefreshInterval.value);
    }
});

// Watch for tab changes to load data
watch(activeTab, async (newTab) => {
    if (process.server) return;
    if (newTab === 'users' && isAdmin.value) {
        await usersStore.fetchUsers();
    }
    if (newTab === 'devices' && isAdmin.value) {
        await devicesStore.fetchDevices();
    }
});

// Define page metadata
definePageMeta({
    middleware: ['auth']
});
</script>