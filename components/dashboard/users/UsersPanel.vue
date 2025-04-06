<!-- components/dashboard/users/UsersPanel.vue -->
<template>
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in usersList" :key="user._id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user._id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                {{ user.role }}
              </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                              @click="toggleUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')"
                        >
                            {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir admin' }}
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUsersStore } from '~/stores/users';

const usersStore = useUsersStore();

// Get users list from store
const usersList = computed(() => usersStore.usersList);

// Toggle user role
const toggleUserRole = async (userId, newRole) => {
    await usersStore.toggleUserRole(userId, newRole);
};

// Ensure users are loaded
onMounted(() => {
    usersStore.fetchUsers();
});
</script>