<!-- components/dashboard/devices/DeviceDetails.vue -->
<template>
    <div class="mt-4 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
        <div class="flex border-b border-gray-200">
            <button
                  @click="activeTab = 'details'"
                  class="px-4 py-2 text-sm font-medium transition-colors"
                  :class="activeTab === 'details' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
            >
                Détails
            </button>
            <button
                  @click="activeTab = 'monitor'"
                  class="px-4 py-2 text-sm font-medium transition-colors"
                  :class="activeTab === 'monitor' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'"
            >
                Monitoring
            </button>
        </div>

        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="p-4">
            <h5 class="font-medium mb-2">Détails de l'appareil</h5>

            <!-- OIDs Table -->
            <div class="overflow-x-auto mt-2">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                    <tr>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OID</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Graphique</th>
                        <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dernière valeur</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(oid, index) in device.oids" :key="index">
                        <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{{ oid.oid }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-xs">{{ oid.name }}</td>
                        <td class="px-4 py-2 text-xs">{{ oid.description }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-xs">
                <span
                      :class="{
                    'bg-blue-100 text-blue-800': oid.graphType === 'line',
                    'bg-green-100 text-green-800': oid.graphType === 'bar',
                    'bg-yellow-100 text-yellow-800': oid.graphType === 'gauge',
                    'bg-gray-100 text-gray-800': oid.graphType === 'none' || !oid.graphType
                  }"
                      class="px-2 py-0.5 rounded-full text-xs"
                >
                  {{ oid.graphType === 'line' ? 'Ligne' :
                      oid.graphType === 'bar' ? 'Histogramme' :
                            oid.graphType === 'gauge' ? 'Jauge' : 'Aucun' }}
                </span>
                            <span v-if="oid.alert?.enabled" class="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                  Alerte
                </span>
                        </td>
                        <td class="px-4 py-2 whitespace-nowrap text-xs">
                <span v-if="pollingResults && pollingResults[oid.oid]">
                  {{ pollingResults[oid.oid].value }}
                </span>
                            <span v-else class="text-gray-400">Non disponible</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!-- Device Info -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <h6 class="text-xs font-medium text-gray-500 uppercase mb-2">Informations</h6>
                    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt class="text-gray-500">IP</dt>
                        <dd class="text-gray-900">{{ device.ipAddress }}</dd>

                        <dt class="text-gray-500">Communauté SNMP</dt>
                        <dd class="text-gray-900">{{ device.snmpCommunity }}</dd>

                        <dt class="text-gray-500">Version SNMP</dt>
                        <dd class="text-gray-900">{{ device.snmpVersion }}</dd>

                        <dt class="text-gray-500">Statut</dt>
                        <dd>
              <span
                    :class="device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="px-2 py-0.5 rounded-full text-xs"
              >
                {{ device.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
                        </dd>
                    </dl>
                </div>

                <div class="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <h6 class="text-xs font-medium text-gray-500 uppercase mb-2">Monitoring</h6>
                    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt class="text-gray-500">Intervalle</dt>
                        <dd class="text-gray-900">{{ device.monitoringInterval || 5 }} minutes</dd>

                        <dt class="text-gray-500">Dernière vérification</dt>
                        <dd class="text-gray-900">{{ device.lastMonitored ? formatDate(device.lastMonitored) : 'Jamais' }}</dd>

                        <dt class="text-gray-500">Dernier ping</dt>
                        <dd>
              <span v-if="device.lastPingStatus">
                <span
                      :class="device.lastPingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 py-0.5 rounded-full text-xs"
                >
                  {{ device.lastPingStatus.success ? 'OK' : 'Échec' }}
                </span>
                <span v-if="device.lastPingStatus.responseTime" class="ml-1 text-gray-900">
                  {{ device.lastPingStatus.responseTime.toFixed(1) }} ms
                </span>
              </span>
                            <span v-else class="text-gray-500">Non testé</span>
                        </dd>
                    </dl>
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-3 mt-4">
                <button
                      @click="pingDevice"
                      class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Ping
                </button>
                <button
                      @click="monitorDevice"
                      class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Actualiser
                </button>
                <button
                      @click="$emit('close')"
                      class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Fermer
                </button>
            </div>
        </div>

        <!-- Monitor Tab -->
        <div v-if="activeTab === 'monitor'" class="bg-white">
            <DeviceMonitor
                  :device="device"
                  @update:device="$emit('update:device', $event)"
                  @edit-device="$emit('edit')"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDevicesStore } from '~/stores/devices';
import { formatDate } from '~/utils/formatters';

const props = defineProps({
    device: {
        type: Object,
        required: true
    },
    pollingResults: {
        type: Object,
        default: () => ({})
    }
});

defineEmits(['close', 'update:device', 'edit']);

const activeTab = ref('details');
const devicesStore = useDevicesStore();

// Actions
const pingDevice = async () => {
    await devicesStore.pingDevice(props.device._id);
};

const monitorDevice = async () => {
    await devicesStore.monitorDevice(props.device._id);
};
</script>