<template>
    <div class="min-h-screen bg-gray-50">
        <DashboardNavbar
              :user="user ?? {}"
              :is-admin="isAdmin"
              :session-time="sessionTime"
              @logout="logout"
        />
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/utils/auth';

import DashboardNavbar from '~/components/dashboard/Navbar.vue';

// Auth & routing
const router = useRouter();
const { user, isAdmin, logout, initAuth, setupTokenRefresh, getSessionTimeRemaining } = useAuth();

// Loading state
const isLoading = ref(true);

// UI State
const activeTab = ref('dashboard');
const sessionTime = ref(null);
const sessionRefreshInterval = ref(null);

// Update session time display
const updateSessionTime = () => {
    if (process.server) return;
    sessionTime.value = getSessionTimeRemaining();
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

// Define page metadata
definePageMeta({
    middleware: ['auth'],
});

</script>

<style scoped>
/* Add any layout-specific styles here */
</style>
