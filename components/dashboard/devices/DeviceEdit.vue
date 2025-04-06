<!-- components/dashboard/devices/DeviceEdit.vue -->
<template>
    <div class="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h5 class="font-medium mb-4">Modifier l'appareil</h5>

        <form @submit.prevent="updateDevice" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                          v-model="editDeviceForm.name"
                          type="text"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Adresse IP</label>
                    <input
                          v-model="editDeviceForm.ipAddress"
                          type="text"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Communauté SNMP</label>
                    <input
                          v-model="editDeviceForm.snmpCommunity"
                          type="text"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Version SNMP</label>
                    <select
                          v-model="editDeviceForm.snmpVersion"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="1">1</option>
                        <option value="2c">2c</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                          v-model="editDeviceForm.status"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Intervalle de monitoring (minutes)</label>
                    <input
                          v-model.number="editDeviceForm.monitoringInterval"
                          type="number"
                          min="1"
                          max="1440"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                      v-model="editDeviceForm.description"
                      rows="2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
            </div>

            <!-- Edit OIDs Section -->
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">OIDs à surveiller</label>
                    <button
                          type="button"
                          @click="addEditOid"
                          class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Ajouter un OID
                    </button>
                </div>

                <!-- OID Template Picker for Edit Form -->
                <div class="mt-2 mb-3">
                    <div class="flex flex-wrap gap-2">
                        <button
                              type="button"
                              @click="applyEditDeviceTemplate('system')"
                              class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                            Système
                        </button>
                        <button
                              type="button"
                              @click="applyEditDeviceTemplate('router')"
                              class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                        >
                            Router
                        </button>
                        <button
                              type="button"
                              @click="applyEditDeviceTemplate('switch')"
                              class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                        >
                            Switch
                        </button>
                        <button
                              type="button"
                              @click="applyEditDeviceTemplate('host')"
                              class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                        >
                            Host
                        </button>
                    </div>
                </div>

                <!-- OID items would go here, see below how we'd use a component -->
                <div v-for="(oid, index) in editDeviceForm.oids" :key="index" class="border p-3 rounded mb-2">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                            <label class="block text-xs font-medium text-gray-700">OID</label>
                            <input
                                  v-model="oid.oid"
                                  type="text"
                                  placeholder="1.3.6.1.2.1.1.1.0"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700">Nom</label>
                            <input
                                  v-model="oid.name"
                                  type="text"
                                  placeholder="sysDescr"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700">Description</label>
                            <input
                                  v-model="oid.description"
                                  type="text"
                                  placeholder="Description"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <button
                              type="button"
                              @click="removeEditOid(index)"
                              class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>

                <div v-if="editDeviceForm.oids.length === 0" class="text-center py-4 text-gray-500 bg-white rounded-md border border-gray-200">
                    <p class="text-sm">Aucun OID configuré. Utilisez un template ou ajoutez manuellement des OIDs.</p>
                </div>
            </div>

            <div class="flex justify-end space-x-3">
                <button
                      type="button"
                      @click="$emit('close')"
                      class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                      type="submit"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      :disabled="isSubmittingEdit"
                >
                    <span v-if="isSubmittingEdit">Mise à jour...</span>
                    <span v-else>Mettre à jour</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDevicesStore } from '~/stores/devices';

const props = defineProps({
    deviceId: {
        type: String,
        required: true
    }
});

defineEmits(['close']);

const devicesStore = useDevicesStore();

// Form state from store
const editDeviceForm = computed({
    get: () => devicesStore.editDeviceForm,
    set: (value) => devicesStore.editDeviceForm = value
});

const isSubmittingEdit = computed(() => devicesStore.isSubmittingEdit);

// Actions for OID management
const addEditOid = () => devicesStore.addEditOid();
const removeEditOid = (index) => devicesStore.removeEditOid(index);
const applyEditDeviceTemplate = (templateType) => devicesStore.applyEditDeviceTemplate(templateType);

// Update device
const updateDevice = async () => {
    await devicesStore.updateDevice(props.deviceId);
};

// Initialize edit form when component is mounted
onMounted(() => {
    // Ensure the device is loaded in the edit form
    if (props.deviceId) {
        devicesStore.editDevice(props.deviceId);
    }
});
</script>