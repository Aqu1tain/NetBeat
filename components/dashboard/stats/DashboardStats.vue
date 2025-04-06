<!-- components/dashboard/stats/DashboardStats.vue -->
<template>
    <div class="space-y-6">
        <!-- Welcome Card with Stats -->
        <StatsCards :is-admin="isAdmin" />

        <!-- Recent Activity -->
        <RecentActivity />
    </div>
</template>

<script setup>
import StatsCards from './StatsCards.vue';
import RecentActivity from './RecentActivity.vue';

defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    }
});
</script>