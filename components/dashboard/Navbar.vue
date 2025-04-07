<!-- components/dashboard/Navbar.vue -->
<template>
    <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <NuxtLink to="/dashboard"><h1 class="text-xl font-bold font-[PT_Serif] text-gray-800">NetBeat</h1></NuxtLink>

                    <!-- Admin Badge -->
                    <span v-if="isAdmin" class="ml-3 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
            Admin
          </span>
                </div>

                <div class="flex items-center space-x-4">
                    <!-- User Info & Logout -->
                    <UserMenu v-if="user" :user="user" @logout="$emit('logout')" />
                    <div v-else class="flex items-center space-x-2">
                        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span class="hidden md:inline text-gray-500">Chargement...</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import UserMenu from './UserMenu.vue';

defineProps({
    user: {
        type: Object,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

defineEmits(['logout']);
</script>