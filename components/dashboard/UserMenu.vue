<!-- components/dashboard/UserMenu.vue -->
<template>
    <div class="relative" ref="userMenuRef">
        <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
        >
            <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {{ firstCharUppercase }}
            </div>
            <span class="hidden md:inline">{{ user?.username }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
        >
            <div class="px-4 py-2 text-sm text-gray-500 border-b">
                Connecté en tant que <span class="font-semibold">{{ user?.username }}</span>
                <p class="text-xs text-gray-500">Rôle: {{ user?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
            </div>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon profil</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
            <button
                  @click="$emit('logout')"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
                Déconnexion
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

defineEmits(['logout']);

const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

// Get first character of username in uppercase
const firstCharUppercase = computed(() => {
    return props.user?.username?.charAt(0)?.toUpperCase() || '?';
});

// Toggle user menu
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Detect clicks outside user menu to close it (client-side only)
if (process.client) {
    onClickOutside(userMenuRef, () => {
        isUserMenuOpen.value = false;
    });
}
</script>