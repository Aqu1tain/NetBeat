<!-- components/dashboard/devices/DevicesList.vue -->
<template>
    <div class="p-6">
        <div v-if="filteredDevices.length === 0" class="text-center py-8 text-gray-500">
            Aucun appareil à afficher
        </div>
        <ul v-else class="divide-y divide-gray-200">
            <li
                  v-for="device in filteredDevices"
                  :key="device._id"
                  class="py-4"
            >
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <!-- Device Info -->
                    <div class="flex-1">
                        <div class="flex items-start">
                            <!-- Status Indicator -->
                            <span
                                  class="h-2 w-2 mt-2 mr-2 rounded-full"
                                  :class="device.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                            ></span>

                            <!-- Device Content -->
                            <div>
                                <h4 class="text-lg font-medium text-gray-900">{{ device.name }}</h4>
                                <p class="mt-1 text-gray-600">{{ device.description }}</p>

                                <!-- Device metadata -->
                                <div class="mt-2 flex flex-wrap text-xs text-gray-500 space-x-4">
                                    <span>IP: {{ device.ipAddress }}</span>
                                    <span>SNMP: v{{ device.snmpVersion }}</span>
                                    <span>OIDs: {{ device.oids.length }}</span>
                                    <span>Créé le: {{ formatDate(device.createdAt) }}</span>
                                    <span>
                    Statut:
                    <span
                          :class="device.status === 'active' ? 'text-green-600' : 'text-red-600'"
                          class="font-medium"
                    >
                      {{ device.status === 'active' ? 'Actif' : 'Inactif' }}
                    </span>
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-4 md:mt-0 flex justify-end space-x-2">
                        <button
                              @click="viewDeviceDetails(device._id)"
                              class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            Détails
                        </button>
                        <button
                              @click="pollDevice(device._id)"
                              class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                            Interroger
                        </button>
                        <button
                              @click="editDevice(device._id)"
                              class="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                        >
                            Modifier
                        </button>
                        <button
                              @click="deleteDevice(device._id)"
                              class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>

                <!-- Device Details Panel (hidden by default) -->
                <DeviceDetails
                      v-if="device._id === selectedDeviceId"
                      :device="device"
                      :polling-results="devicePollingResults[device._id]"
                      @close="selectedDeviceId = null"
                />

                <!-- Device Edit Form (hidden by default) -->
                <DeviceEdit
                      v-if="device._id === editingDeviceId"
                      :device-id="device._id"
                      @close="editingDeviceId = null"
                />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDevicesStore } from '~/stores/devices';
import { formatDate } from '~/utils/formatters';
import DeviceDetails from './DeviceDetails.vue';
import DeviceEdit from './DeviceEdit.vue';

const devicesStore = useDevicesStore();

// Get filtered devices from store
const filteredDevices = computed(() => devicesStore.filteredDevices);

// Get state from store
const selectedDeviceId = computed({
    get: () => devicesStore.selectedDeviceId,
    set: (value) => devicesStore.selectedDeviceId = value
});

const editingDeviceId = computed({
    get: () => devicesStore.editingDeviceId,
    set: (value) => devicesStore.editingDeviceId = value
});

const devicePollingResults = computed(() => devicesStore.devicePollingResults);

// Device actions
const viewDeviceDetails = (deviceId) => {
    devicesStore.viewDeviceDetails(deviceId);
};

const pollDevice = (deviceId) => {
    devicesStore.monitorDevice(deviceId);
};

const editDevice = (deviceId) => {
    devicesStore.editDevice(deviceId);
};

const deleteDevice = (deviceId) => {
    devicesStore.deleteDevice(deviceId);
};
</script>