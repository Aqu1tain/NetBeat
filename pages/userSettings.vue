<!-- components/dashboard/settings/UserSettingsPanel.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-6 mx-10 mt-6">
        <div class="border-b border-gray-200 pb-4 mb-6">
            <h2 class="text-xl font-semibold">Paramètres utilisateur</h2>
            <p class="text-gray-600 mt-1">Personnalisez vos préférences système</p>
        </div>

        <div class="space-y-6 px-8">
            <!-- NetBeat Canary Toggle -->
            <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="font-medium">NetBeat Canary (expérimental)</h3>
                        <p class="text-sm text-gray-600 mt-1">
                            Activez les fonctionnalités expérimentales et mises à jour anticipées
                        </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input
                              type="checkbox"
                              v-model="netBeatCanaryEnabled"
                              @change="updateSetting"
                              class="sr-only peer"
                        />
                        <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div v-if="netBeatCanaryEnabled" class="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm">
                    <div class="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        <p>
                            Attention : Cette option est expérimentale. Les mises à jour anticipées peuvent causer des problèmes de stabilité ou réduire l'efficacité du système.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end px-2">
                <button
                      @click="saveSettings"
                      class="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Enregistrer les modifications
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';

// User settings state
const netBeatCanaryEnabled = ref(false);

// Toast notifications
const { showToast } = useToast();

// Lifecycle hooks
onMounted(async () => {
    // Load user settings from API or localStorage
    loadUserSettings();
});

// Load user settings from storage or API
const loadUserSettings = () => {
    // In a real app, you would fetch these from an API
    // For demo purposes, using localStorage
    netBeatCanaryEnabled.value = localStorage.getItem('netBeatCanary') === 'true';
};

// Update setting
const updateSetting = () => {
    localStorage.setItem('netBeatCanary', netBeatCanaryEnabled.value);
    // In a real app, you would call an API endpoint here
    console.log("NetBeat Canary Enabled:", netBeatCanaryEnabled.value);
};

// Save settings and show confirmation
const saveSettings = () => {
    updateSetting();

    showToast({
        message: 'Paramètres enregistrés avec succès',
        type: 'success',
        duration: 3000
    });
};

// Define page metadata
definePageMeta({
    middleware: ['auth'],
    layout: 'main',
});
</script>