<template>
    <div class="bg-white rounded-lg shadow">
        <!-- Header -->
        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
                <h3 class="text-lg font-medium">{{ device.name }} - Monitoring</h3>
                <p class="text-sm text-gray-600">{{ device.ipAddress }}</p>
            </div>

            <div class="flex space-x-3">
                <!-- Auto-refresh toggle -->
                <div class="flex items-center">
                    <label for="auto-refresh" class="mr-2 text-sm text-gray-600">Auto-refresh</label>
                    <div class="relative inline-block w-10 align-middle select-none">
                        <input
                              id="auto-refresh"
                              type="checkbox"
                              v-model="autoRefreshEnabled"
                              class="sr-only peer"
                        />
                        <div class="h-5 bg-gray-200 rounded-full w-10 peer-checked:bg-blue-600"></div>
                        <div class="absolute h-4 w-4 rounded-full bg-white shadow left-0.5 top-0.5 peer-checked:left-5 transition-all"></div>
                    </div>
                </div>

                <!-- Refresh interval selector -->
                <select
                      v-if="autoRefreshEnabled"
                      v-model="refreshInterval"
                      class="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option :value="30000">30s</option>
                    <option :value="60000">1m</option>
                    <option :value="300000">5m</option>
                    <option :value="600000">10m</option>
                </select>

                <!-- Ping button -->
                <button
                      @click="pingDevice"
                      class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                      :disabled="isPinging"
                >
                    <svg v-if="isPinging" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isPinging ? 'Ping...' : 'Ping' }}</span>
                </button>

                <!-- Refresh all button -->
                <button
                      @click="refreshAllMetrics"
                      class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
                      :disabled="isRefreshing"
                >
                    <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isRefreshing ? 'Actualisation...' : 'Actualiser tout' }}</span>
                </button>
            </div>
        </div>

        <!-- Device Status Information -->
        <div class="p-4 border-b border-gray-200 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Status -->
                <div class="flex items-center">
                    <div class="mr-3 p-2 rounded-full bg-gray-200 text-gray-700">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Statut</p>
                        <p class="font-medium">
              <span
                    :class="device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 py-0.5 rounded-full text-xs"
              >
                {{ device.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
                        </p>
                    </div>
                </div>

                <!-- Last Monitored -->
                <div class="flex items-center">
                    <div class="mr-3 p-2 rounded-full bg-gray-200 text-gray-700">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Dernière vérification</p>
                        <p class="font-medium">
                            {{ device.lastMonitored ? formatDate(device.lastMonitored) : 'Jamais' }}
                        </p>
                    </div>
                </div>

                <!-- Ping Status -->
                <div class="flex items-center">
                    <div class="mr-3 p-2 rounded-full bg-gray-200 text-gray-700">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Ping</p>
                        <div v-if="device.lastPingStatus" class="font-medium">
              <span
                    :class="device.lastPingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 py-0.5 rounded-full text-xs"
              >
                {{ device.lastPingStatus.success ? 'OK' : 'Échec' }}
              </span>
                            <span v-if="device.lastPingStatus.success && device.lastPingStatus.responseTime" class="ml-2 text-sm">
                {{ device.lastPingStatus.responseTime.toFixed(1) }} ms
              </span>
                        </div>
                        <p v-else class="text-sm italic text-gray-500">Non testé</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ping Results Modal -->
        <div v-if="showPingResults" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-medium">Résultats Ping - {{ device.ipAddress }}</h3>
                    <button @click="showPingResults = false" class="text-gray-500 hover:text-gray-700">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-4 flex-1 overflow-auto">
                    <div v-if="pingResults">
                        <div class="mb-4 flex items-center">
              <span
                    :class="pingResults.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 py-1 mr-2 rounded-full text-sm font-medium"
              >
                {{ pingResults.success ? 'Succès' : 'Échec' }}
              </span>
                            <span class="text-gray-600">{{ formatDate(new Date()) }}</span>
                        </div>

                        <div v-if="pingResults.success && pingResults.stats" class="mb-4 grid grid-cols-2 gap-4">
                            <div class="p-3 bg-gray-50 rounded">
                                <p class="text-sm text-gray-500">Temps de réponse</p>
                                <p class="text-xl font-semibold">{{ pingResults.stats.avgTime.toFixed(1) }} ms</p>
                            </div>
                            <div class="p-3 bg-gray-50 rounded">
                                <p class="text-sm text-gray-500">Perte de paquets</p>
                                <p class="text-xl font-semibold">{{ pingResults.stats.packetLoss }}%</p>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Détails</h4>
                            <pre class="bg-gray-50 p-4 rounded text-xs text-gray-800 overflow-auto max-h-64">{{ pingResults.details }}</pre>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 text-gray-500">
                        Aucun résultat de ping disponible
                    </div>
                </div>

                <div class="p-4 border-t border-gray-200">
                    <button
                          @click="showPingResults = false"
                          class="w-full py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>

        <!-- Monitoring Charts -->
        <div class="p-6">
            <div v-if="device.oids.length === 0" class="text-center py-8 text-gray-500">
                <svg class="mx-auto h-12 w-12 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm">Aucun OID configuré pour cet appareil</p>
                <button
                      @click="$emit('edit-device')"
                      class="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Configurer les OIDs
                </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Create a monitoring chart for each OID -->
                <DeviceMonitoringChart
                      v-for="oid in device.oids"
                      :key="oid.oid"
                      :device-id="device._id"
                      :oid="oid.oid"
                      :title="oid.name"
                      :description="oid.description"
                      :graph-type="oid.graphType || 'line'"
                      :alert="oid.alert"
                      :auto-refresh="autoRefreshEnabled"
                      :refresh-interval="refreshInterval"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DeviceMonitoringChart from './DeviceMonitoringChart.vue';

const props = defineProps({
    device: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:device', 'edit-device']);

// State
const autoRefreshEnabled = ref(false);
const refreshInterval = ref(60000); // Default to 1 minute
const isPinging = ref(false);
const isRefreshing = ref(false);
const pingResults = ref(null);
const showPingResults = ref(false);

// Format date for display
const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Ping the device
const pingDevice = async () => {
    if (isPinging.value) return;

    isPinging.value = true;

    try {
        const response = await $fetch('/api/devices/ping', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                ipAddress: props.device.ipAddress
            }
        });

        // Update ping results
        pingResults.value = response;

        // Show ping results modal
        showPingResults.value = true;

        // Update device with ping status
        const updatedDevice = {
            ...props.device,
            lastPingStatus: {
                timestamp: new Date(),
                success: response.success,
                responseTime: response.stats?.avgTime,
                packetLoss: response.stats?.packetLoss
            }
        };

        // Update device status if ping fails
        if (!response.success && props.device.status === 'active') {
            updatedDevice.status = 'inactive';
        }

        // Send update to parent
        emit('update:device', updatedDevice);

        // Update device in API
        await $fetch(`/api/devices/${props.device._id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                lastPingStatus: updatedDevice.lastPingStatus,
                status: updatedDevice.status
            }
        });
    } catch (error) {
        console.error('Error pinging device:', error);
        alert('Erreur lors du ping de l\'appareil');
    } finally {
        isPinging.value = false;
    }
};

// Refresh all metrics
const refreshAllMetrics = async () => {
    if (isRefreshing.value) return;

    isRefreshing.value = true;

    try {
        // Get all OIDs for this device
        const oids = props.device.oids.map(oid => oid.oid);

        if (oids.length === 0) {
            alert('Aucun OID configuré pour cet appareil');
            return;
        }

        // Call monitor API
        const response = await $fetch('/api/devices/monitor', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                deviceId: props.device._id,
                oids
            }
        });

        if (response.success) {
            // Update device with last monitored timestamp
            const updatedDevice = {
                ...props.device,
                lastMonitored: response.timestamp,
                // Update status to active if monitoring succeeds
                status: 'active'
            };

            // Send update to parent
            emit('update:device', updatedDevice);
        }
    } catch (error) {
        console.error('Error refreshing metrics:', error);
        alert('Erreur lors de l\'actualisation des métriques');

        // Update device status to inactive if monitoring fails
        const updatedDevice = {
            ...props.device,
            status: 'inactive'
        };

        // Send update to parent
        emit('update:device', updatedDevice);
    } finally {
        isRefreshing.value = false;
    }
};
</script>