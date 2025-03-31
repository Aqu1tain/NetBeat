<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
            <h1 class="text-2xl font-bold text-center">Inscription</h1>
            <form @submit.prevent="registerUser" class="space-y-4">
                <input
                      v-model="username"
                      type="text"
                      placeholder="Nom d'utilisateur"
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input
                      v-model="password"
                      type="password"
                      placeholder="Mot de passe"
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button type="submit" class="w-full py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700">
                    S'inscrire
                </button>
            </form>
            <p v-if="error" class="text-center text-red-500">{{ error }}</p>
            <p class="text-center">
                Déjà inscrit ?
                <NuxtLink class="text-blue-600 hover:underline" to="/login">Se connecter</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function registerUser() {
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: { username: username.value, password: password.value },
        });
        router.push('/login');
    } catch (err) {
        error.value = err.data?.message || "Échec de l'inscription";
    }
}
</script>
