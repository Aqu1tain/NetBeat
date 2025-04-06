<!-- components/dashboard/devices/DevicesPanel.vue -->
<template>
    <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 class="text-lg font-medium">Gestion des appareils</h3>

            <!-- New Device button -->
            <button
                  @click="toggleNewDeviceForm"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <span v-if="!showNewDeviceForm">Nouvel appareil</span>
                <span v-else>Annuler</span>
            </button>
        </div>

        <!-- New Device Form -->
        <DeviceForm v-if="showNewDeviceForm" @cancel="showNewDeviceForm = false" />

        <!-- Device Filters -->
        <DeviceFilters />

        <!-- Devices List -->
        <DevicesList />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDevicesStore } from '~/stores/devices';
import DeviceForm from './DeviceForm.vue';
import DeviceFilters from './DeviceFilters.vue';
import DevicesList from './DevicesList.vue';

const devicesStore = useDevicesStore();

// Form visibility state from store
const showNewDeviceForm = computed({
    get: () => devicesStore.showNewDeviceForm,
    set: (value) => devicesStore.showNewDeviceForm = value
});

// Toggle new device form visibility
const toggleNewDeviceForm = () => {
    showNewDeviceForm.value = !showNewDeviceForm.value;
};

// Ensure devices are loaded
onMounted(() => {
    devicesStore.fetchDevices();
});
</script>