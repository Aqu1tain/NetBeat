<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" v-if="show">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-medium">SNMP Query - {{ device?.name }}</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Query Controls -->
            <div class="p-4 bg-gray-50 border-b border-gray-200">
                <div class="flex flex-col md:flex-row gap-4">
                    <!-- Quick Query Templates -->
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Templates d'OIDs</label>
                        <div class="flex flex-wrap gap-2">
                            <button
                                  v-for="(template, key) in oidTemplates"
                                  :key="key"
                                  @click="applyTemplate(key)"
                                  class="px-2 py-1 text-xs rounded border"
                                  :class="activeTemplate === key ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
                            >
                                {{ key }}
                            </button>
                        </div>
                    </div>

                    <!-- Manual OID Input -->
                    <div class="flex-1">
                        <label for="custom-oid" class="block text-sm font-medium text-gray-700 mb-1">OID personnalisé</label>
                        <div class="flex">
                            <input
                                  id="custom-oid"
                                  v-model="customOid"
                                  type="text"
                                  placeholder="e.g. 1.3.6.1.2.1.1.1.0"
                                  class="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                            <button
                                  @click="addCustomOid"
                                  class="px-3 py-2 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Selected OIDs Chips -->
                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">OIDs sélectionnés ({{ selectedOids.length }})</label>
                    <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded bg-white">
                        <div v-if="selectedOids.length === 0" class="text-gray-500 text-sm italic">
                            Aucun OID sélectionné. Utilisez un template ou ajoutez un OID personnalisé.
                        </div>
                        <div
                              v-for="(oid, index) in selectedOids"
                              :key="index"
                              class="flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
                        >
                            <span class="mr-1">{{ oid.name || oid.oid }}</span>
                            <button @click="removeOid(index)" class="text-gray-500 hover:text-red-500">
                                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-end">
                    <button
                          @click="executeQuery"
                          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                          :disabled="isLoading || selectedOids.length === 0"
                    >
                        <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ isLoading ? 'Interrogation...' : 'Interroger' }}</span>
                    </button>
                </div>
            </div>

            <!-- Results -->
            <div class="flex-1 p-4 overflow-auto">
                <div v-if="results.length === 0 && !isLoading" class="text-center py-8 text-gray-500">
                    <p>Aucun résultat à afficher</p>
                    <p class="text-sm mt-2">Sélectionnez des OIDs et cliquez sur "Interroger"</p>
                </div>

                <div v-else>
                    <div class="mb-2 flex justify-between items-center">
                        <h4 class="font-medium">Résultats</h4>
                        <span v-if="queryTimestamp" class="text-xs text-gray-500">
              Interrogé le {{ formatDate(queryTimestamp) }}
            </span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OID</th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                            </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(result, index) in results" :key="index" :class="result.error ? 'bg-red-50' : ''">
                                <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{{ result.oid }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-xs">
                                    {{ getOidName(result.oid) }}
                                </td>
                                <td class="px-4 py-3 text-xs">
                                    <span v-if="result.error" class="text-red-600">Erreur: {{ result.error }}</span>
                                    <span v-else>{{ formatValue(result.oid, result.value) }}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-200 flex justify-between">
                <button
                      v-if="results.length > 0"
                      @click="saveAsDevice"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Enregistrer comme OIDs de l'appareil
                </button>
                <button
                      @click="$emit('close')"
                      class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                    Fermer
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { commonOids, formatSnmpValue, getOidTemplateByType } from '~/utils/snmp';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    device: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'update-device']);

// State
const selectedOids = ref([]);
const customOid = ref('');
const results = ref([]);
const isLoading = ref(false);
const queryTimestamp = ref(null);
const activeTemplate = ref('');

// OID Templates
const oidTemplates = {
    'Système': commonOids.system,
    'Interfaces': commonOids.interfaces.filter(oid => !oid.isTable || oid.name === 'ifNumber'),
    'IP': commonOids.ip.filter(oid => !oid.isTable),
    'CPU/Mémoire': commonOids.cisco,
    'Router': getOidTemplateByType('router'),
    'Switch': getOidTemplateByType('switch'),
    'Host': getOidTemplateByType('host')
};

// Apply an OID template
const applyTemplate = (templateKey) => {
    // Toggle template if already active
    if (activeTemplate.value === templateKey) {
        activeTemplate.value = '';
        selectedOids.value = [];
        return;
    }

    activeTemplate.value = templateKey;
    selectedOids.value = [...oidTemplates[templateKey]];
};

// Add custom OID
const addCustomOid = () => {
    if (!customOid.value) return;

    // Check if OID already exists
    const exists = selectedOids.value.some(oid => oid.oid === customOid.value);
    if (exists) {
        alert('Cet OID est déjà dans la liste');
        return;
    }

    // Add new OID
    selectedOids.value.push({
        oid: customOid.value,
        name: 'Custom OID',
        description: ''
    });

    customOid.value = '';
    activeTemplate.value = ''; // Clear active template
};

// Remove an OID
const removeOid = (index) => {
    selectedOids.value.splice(index, 1);
    activeTemplate.value = ''; // Clear active template
};

// Execute SNMP query
const executeQuery = async () => {
    if (!props.device || selectedOids.value.length === 0) return;

    isLoading.value = true;
    results.value = [];

    try {
        const response = await $fetch('/api/devices/poll', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                ipAddress: props.device.ipAddress,
                community: props.device.snmpCommunity,
                version: props.device.snmpVersion,
                oids: selectedOids.value.map(oid => oid.oid)
            }
        });

        if (response.success && response.results) {
            results.value = response.results;
            queryTimestamp.value = new Date();
        }
    } catch (error) {
        console.error('Error polling device:', error);
        alert(`Erreur lors de l'interrogation de l'appareil: ${error.message || 'Erreur inconnue'}`);
    } finally {
        isLoading.value = false;
    }
};

// Format date
const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Get OID name
const getOidName = (oid) => {
    // Find in selected OIDs
    const selected = selectedOids.value.find(item => item.oid === oid);
    if (selected) return selected.name;

    // Search in all templates
    for (const template of Object.values(oidTemplates)) {
        const found = template.find(item => item.oid === oid);
        if (found) return found.name;
    }

    return oid;
};

// Format SNMP value
const formatValue = (oid, value) => {
    return formatSnmpValue(oid, value);
};

// Save selected OIDs to the device
const saveAsDevice = () => {
    // Filter out OIDs with errors
    const successfulOids = results.value
          .filter(result => !result.error)
          .map(result => {
              const oidInfo = selectedOids.value.find(oid => oid.oid === result.oid) || { oid: result.oid, name: getOidName(result.oid), description: '' };
              return {
                  oid: result.oid,
                  name: oidInfo.name,
                  description: oidInfo.description
              };
          });

    emit('update-device', {
        ...props.device,
        oids: successfulOids
    });

    emit('close');
};

// Initialize with device OIDs if present
onMounted(() => {
    if (props.device && props.device.oids && props.device.oids.length > 0) {
        selectedOids.value = [...props.device.oids];
        activeTemplate.value = ''; // Custom selection
    }
});
</script>