<!-- components/dashboard/devices/DeviceForm.vue -->
<template>
    <div class="border-b border-gray-200 p-6 bg-gray-50">
        <form @submit.prevent="createDevice" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="device-name" class="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                          id="device-name"
                          v-model="deviceForm.name"
                          type="text"
                          placeholder="Nom de l'appareil"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                    />
                </div>
                <div>
                    <label for="device-ip" class="block text-sm font-medium text-gray-700">Adresse IP</label>
                    <input
                          id="device-ip"
                          v-model="deviceForm.ipAddress"
                          type="text"
                          placeholder="192.168.1.1"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                    />
                </div>
                <div>
                    <label for="device-community" class="block text-sm font-medium text-gray-700">Communauté SNMP</label>
                    <input
                          id="device-community"
                          v-model="deviceForm.snmpCommunity"
                          type="text"
                          placeholder="public"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label for="device-version" class="block text-sm font-medium text-gray-700">Version SNMP</label>
                    <select
                          id="device-version"
                          v-model="deviceForm.snmpVersion"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="1">1</option>
                        <option value="2c">2c</option>
                        <option value="3">3</option>
                    </select>
                </div>
            </div>
            <div>
                <label for="device-description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                      id="device-description"
                      v-model="deviceForm.description"
                      placeholder="Description de l'appareil"
                      rows="2"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
            </div>

            <!-- OIDs Section -->
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="block text-sm font-medium text-gray-700">OIDs à surveiller</label>
                    <button
                          type="button"
                          @click="addOid"
                          class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Ajouter un OID
                    </button>
                </div>

                <!-- OID Template Picker -->
                <div class="mt-2 mb-4">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Templates d'OIDs</label>
                    <div class="flex flex-wrap gap-2">
                        <button
                              type="button"
                              @click="applyDeviceTemplate('system')"
                              class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                            Système
                        </button>
                        <button
                              type="button"
                              @click="applyDeviceTemplate('router')"
                              class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                        >
                            Router
                        </button>
                        <button
                              type="button"
                              @click="applyDeviceTemplate('switch')"
                              class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                        >
                            Switch
                        </button>
                        <button
                              type="button"
                              @click="applyDeviceTemplate('host')"
                              class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                        >
                            Host
                        </button>
                    </div>
                </div>

                <div v-for="(oid, index) in deviceForm.oids" :key="index" class="border p-3 rounded mb-2">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                            <label :for="`oid-value-${index}`" class="block text-xs font-medium text-gray-700">OID</label>
                            <input
                                  :id="`oid-value-${index}`"
                                  v-model="oid.oid"
                                  type="text"
                                  placeholder="1.3.6.1.2.1.1.1.0"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                            />
                        </div>
                        <div>
                            <label :for="`oid-name-${index}`" class="block text-xs font-medium text-gray-700">Nom</label>
                            <input
                                  :id="`oid-name-${index}`"
                                  v-model="oid.name"
                                  type="text"
                                  placeholder="sysDescr"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                            />
                        </div>
                        <div>
                            <label :for="`oid-desc-${index}`" class="block text-xs font-medium text-gray-700">Description</label>
                            <input
                                  :id="`oid-desc-${index}`"
                                  v-model="oid.description"
                                  type="text"
                                  placeholder="Description du système"
                                  class="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <button
                              type="button"
                              @click="testOid(index)"
                              class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Tester
                        </button>
                        <button
                              type="button"
                              @click="removeOid(index)"
                              class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                    <div v-if="oid.testResult" class="mt-2 p-2 bg-gray-100 rounded text-xs">
                        <p v-if="oid.testResult.error" class="text-red-600">
                            Erreur: {{ oid.testResult.error }}
                        </p>
                        <p v-else class="text-green-600">
                            Valeur: {{ oid.testResult.value }}
                        </p>
                    </div>
                </div>

                <p v-if="deviceForm.oids.length === 0" class="text-sm text-gray-500 italic">
                    Aucun OID ajouté. Cliquez sur "Ajouter un OID" pour commencer.
                </p>
            </div>

            <div class="flex justify-end space-x-3">
                <button
                      type="button"
                      @click="$emit('cancel')"
                      class="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                      type="submit"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      :disabled="isSubmittingDevice"
                >
                    <span v-if="isSubmittingDevice">Création...</span>
                    <span v-else>Créer l'appareil</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDevicesStore } from '~/stores/devices';

defineEmits(['cancel']);

const devicesStore = useDevicesStore();

// Form state from store
const deviceForm = computed({
    get: () => devicesStore.deviceForm,
    set: (value) => devicesStore.deviceForm = value
});

const isSubmittingDevice = computed(() => devicesStore.isSubmittingDevice);

// Add/remove OIDs
const addOid = () => devicesStore.addOid();
const removeOid = (index) => devicesStore.removeOid(index);

// Test OID
const testOid = async (index) => {
    await devicesStore.testOid(index);
};

// Apply template
const applyDeviceTemplate = (templateType) => {
    devicesStore.applyDeviceTemplate(templateType);
};

// Submit form
const createDevice = async () => {
    await devicesStore.createDevice();
};
</script>