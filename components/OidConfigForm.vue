<template>
    <div class="border p-4 rounded-md bg-gray-50 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">OID</label>
                <input
                      v-model="oid.oid"
                      type="text"
                      class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="1.3.6.1.2.1.1.1.0"
                      required
                />
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                <input
                      v-model="oid.name"
                      type="text"
                      class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="sysDescr"
                      required
                />
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input
                      v-model="oid.description"
                      type="text"
                      class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Description du système"
                />
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Type de graphique</label>
                <select
                      v-model="oid.graphType"
                      class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="line">Ligne</option>
                    <option value="bar">Histogramme</option>
                    <option value="gauge">Jauge</option>
                    <option value="none">Aucun</option>
                </select>
            </div>
            <div>
                <div class="flex items-center h-full pt-4">
                    <label class="flex items-center">
                        <input
                              type="checkbox"
                              v-model="oid.alert.enabled"
                              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span class="ml-2 text-sm text-gray-700">Activer les alertes</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Alert Configuration (only visible if enabled) -->
        <div v-if="oid.alert && oid.alert.enabled" class="border p-3 rounded bg-white mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Configuration des alertes</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Seuil</label>
                    <input
                          v-model.number="oid.alert.threshold"
                          type="number"
                          step="any"
                          class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Valeur seuil"
                    />
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Condition</label>
                    <select
                          v-model="oid.alert.condition"
                          class="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="above">Au-dessus du seuil</option>
                        <option value="below">En-dessous du seuil</option>
                        <option value="equal">Égal au seuil</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center">
            <button
                  v-if="canTest"
                  type="button"
                  @click="testOid"
                  class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  :disabled="isTesting"
            >
                <svg v-if="isTesting" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isTesting ? 'Test...' : 'Tester' }}</span>
            </button>

            <button
                  type="button"
                  @click="$emit('remove')"
                  class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
                Supprimer
            </button>
        </div>

        <!-- Test Results -->
        <div v-if="testResult" class="mt-3 p-3 rounded" :class="testResult.error ? 'bg-red-50' : 'bg-green-50'">
            <h4 class="text-sm font-medium mb-1" :class="testResult.error ? 'text-red-700' : 'text-green-700'">
                {{ testResult.error ? 'Erreur' : 'Résultat du test' }}
            </h4>
            <p v-if="testResult.error" class="text-sm text-red-600">{{ testResult.error }}</p>
            <p v-else class="text-sm text-green-600">{{ testResult.value }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps({
    value: {
        type: Object,
        required: true
    },
    deviceIp: {
        type: String,
        default: ''
    },
    deviceCommunity: {
        type: String,
        default: 'public'
    },
    deviceVersion: {
        type: String,
        default: '2c'
    }
});

const emit = defineEmits(['update:value', 'remove']);

// Local state with reactive binding
const oid = reactive({
    oid: props.value.oid || '',
    name: props.value.name || '',
    description: props.value.description || '',
    graphType: props.value.graphType || 'line',
    alert: {
        enabled: props.value.alert?.enabled || false,
        threshold: props.value.alert?.threshold || 0,
        condition: props.value.alert?.condition || 'above'
    }
});

// State for testing
const isTesting = ref(false);
const testResult = ref(null);

// Computed property to check if testing is possible
const canTest = computed(() => {
    return oid.oid && props.deviceIp;
});

// Watch for changes and emit update
watch(oid, (newValue) => {
    emit('update:value', {
        oid: newValue.oid,
        name: newValue.name,
        description: newValue.description,
        graphType: newValue.graphType,
        alert: {
            enabled: newValue.alert.enabled,
            threshold: newValue.alert.threshold,
            condition: newValue.alert.condition
        }
    });
}, { deep: true });

// Test the OID
const testOid = async () => {
    if (!canTest.value || isTesting.value) return;

    isTesting.value = true;
    testResult.value = null;

    try {
        const response = await $fetch('/api/devices/poll', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: {
                ipAddress: props.deviceIp,
                community: props.deviceCommunity,
                version: props.deviceVersion,
                oids: [oid.oid]
            }
        });

        if (response.success && response.results && response.results.length > 0) {
            const result = response.results[0];
            if (result.error) {
                testResult.value = { error: result.error };
            } else {
                testResult.value = { value: result.value };
            }
        } else {
            testResult.value = { error: 'Aucun résultat reçu' };
        }
    } catch (error) {
        console.error('Error testing OID:', error);
        testResult.value = { error: error.message || 'Failed to test OID' };
    } finally {
        isTesting.value = false;
    }
};
</script>