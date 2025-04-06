<!-- components/dashboard/stats/RecentActivity.vue -->
<template>
    <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-medium">Activité récente</h3>
        </div>
        <div class="p-6">
            <div v-if="activities.length === 0" class="text-center py-4 text-gray-500">
                Aucune activité récente à afficher
            </div>
            <ul v-else class="divide-y divide-gray-200">
                <li v-for="activity in activities" :key="activity.id" class="py-3">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div :class="`h-8 w-8 rounded-full ${activityTypeColor(activity.type)} flex items-center justify-center text-white`">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-3 flex-1">
                            <p class="text-sm text-gray-900">
                                {{ activity.message }}
                            </p>
                            <p class="mt-1 text-xs text-gray-500">
                                {{ formatDate(activity.timestamp) }}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useActivityStore } from '~/stores/activity';
import { formatDate } from '~/utils/formatters';

const activityStore = useActivityStore();

// Get activities from store
const activities = computed(() => activityStore.activities);

// Get activity type color
const activityTypeColor = (type) => activityStore.activityTypeColor(type);
</script>