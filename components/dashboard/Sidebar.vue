<!-- components/dashboard/Sidebar.vue -->
<template>
    <div class="w-full md:w-64 mb-6 md:mb-0">
        <div class="bg-white rounded-lg shadow p-4">
            <div class="font-medium text-gray-500 uppercase tracking-wider text-xs mb-2">Menu principal</div>

            <nav class="space-y-1">
                <!-- Common Menu Items -->
                <a
                      href="#dashboard"
                      @click.prevent="$emit('update:active-tab', 'dashboard')"
                      class="flex items-center px-3 py-2 rounded-md transition-colors"
                      :class="activeTab === 'dashboard' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                >
          <span class="mr-3">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
                    Tableau de bord
                </a>

                <a
                      href="#tickets"
                      @click.prevent="$emit('update:active-tab', 'tickets')"
                      class="flex items-center px-3 py-2 rounded-md transition-colors"
                      :class="activeTab === 'tickets' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                >
          <span class="mr-3">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
                    Tickets
                </a>

                <!-- Admin-only Menu Items -->
                <template v-if="isAdmin">
                    <div class="pt-2 mt-2 border-t border-gray-200">
                        <div class="font-medium text-gray-500 uppercase tracking-wider text-xs mt-2 mb-2">Administration</div>

                        <a
                              href="#devices"
                              @click.prevent="$emit('update:active-tab', 'devices')"
                              class="flex items-center px-3 py-2 rounded-md transition-colors"
                              :class="activeTab === 'devices' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                        >
              <span class="mr-3">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </span>
                            Gestion des appareils
                        </a>

                        <a
                              href="#users"
                              @click.prevent="$emit('update:active-tab', 'users')"
                              class="flex items-center px-3 py-2 rounded-md transition-colors"
                              :class="activeTab === 'users' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                        >
              <span class="mr-3">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
                            Gestion des utilisateurs
                        </a>

                        <a
                              href="#logs"
                              @click.prevent="$emit('update:active-tab', 'logs')"
                              class="flex items-center px-3 py-2 rounded-md transition-colors"
                              :class="activeTab === 'logs' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                        >
              <span class="mr-3">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
                            Journaux système
                        </a>
                    </div>
                </template>
            </nav>
        </div>
    </div>
</template>

<script setup>
defineProps({
    activeTab: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:active-tab']);
</script>