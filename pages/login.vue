<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
            <h1 class="text-2xl font-bold text-center">Connexion</h1>
            <form @submit.prevent="login" class="space-y-4">
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
                <button type="submit" class="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                    Se connecter
                </button>
            </form>
            <p v-if="error" class="text-center text-red-500">{{ error }}</p>
            <p class="text-center">
                Pas encore inscrit ?
                <NuxtLink class="text-blue-600 hover:underline" to="/register">S'inscrire</NuxtLink>
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

async function login() {
    try {
        const res = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { username: username.value, password: password.value },
        });
        localStorage.setItem('token', res.token);
        router.push('/dashboard');
    } catch (err) {
        error.value = err.data?.message || 'Échec de la connexion';
    }
}
</script>
