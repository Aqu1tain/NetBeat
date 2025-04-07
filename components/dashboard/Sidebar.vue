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
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    </span>
                    <p>Tableau de bord</p>
                </a>

                <a
                      href="#tickets"
                      @click.prevent="$emit('update:active-tab', 'tickets')"
                      class="flex items-center px-3 py-2 rounded-md transition-colors"
                      :class="activeTab === 'tickets' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                >
                    <span class="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                    </span>
                    <p>Tickets</p>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cpu-icon lucide-cpu"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                            </span>
                            <p>Gestion des appareils</p>
                        </a>

                        <a
                              href="#users"
                              @click.prevent="$emit('update:active-tab', 'users')"
                              class="flex items-center px-3 py-2 rounded-md transition-colors"
                              :class="activeTab === 'users' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                        >
                            <span class="mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>                            </span>
                            <p>Gestion des utilisateurs</p>
                        </a>

                        <a
                              href="#logs"
                              @click.prevent="$emit('update:active-tab', 'logs')"
                              class="flex items-center px-3 py-2 rounded-md transition-colors"
                              :class="activeTab === 'logs' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                        >
                          <span class="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>                          </span>
                            <p>Journaux système</p>
                        </a>
                    </div>
                </template>

                <div class="pt-2 mt-2 border-t border-gray-200">
                    <div class="font-medium text-gray-500 uppercase tracking-wider text-xs mt-2 mb-2">System</div>
                    <a
                          href="#version"
                          @click.prevent="$emit('update:active-tab', 'version')"
                          class="flex items-center px-3 py-2 rounded-md transition-colors"
                          :class="activeTab === 'version' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'"
                    >
                        <span class="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                        </span>
                        <p>Notes de version</p>
                    </a>
                </div>
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