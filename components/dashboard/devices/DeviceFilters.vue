<!-- components/dashboard/devices/DeviceFilters.vue -->
<template>
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Status Filter -->
            <div class="flex space-x-2">
                <button
                      @click="setDeviceFilter('all')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="deviceFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    Tous
                </button>
                <button
                      @click="setDeviceFilter('active')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="deviceFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    Actifs
                </button>
                <button
                      @click="setDeviceFilter('inactive')"
                      class="px-3 py-1 text-sm rounded-md"
                      :class="deviceFilter === 'inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                >
                    Inactifs
                </button>
            </div>

            <!-- Search -->
            <div class="relative">
                <input
                      v-model="deviceSearch"
                      type="text"
                      placeholder="Rechercher..."
                      class="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDevicesStore } from '~/stores/devices';

const devicesStore = useDevicesStore();

// Device filter from store
const deviceFilter = computed({
    get: () => devicesStore.deviceFilter,
    set: (value) => devicesStore.deviceFilter = value
});

// Device search from store
const deviceSearch = computed({
    get: () => devicesStore.deviceSearch,
    set: (value) => devicesStore.deviceSearch = value
});

// Set filter
const setDeviceFilter = (filter) => {
    deviceFilter.value = filter;
};
</script>