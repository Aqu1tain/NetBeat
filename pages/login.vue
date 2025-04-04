<!-- pages/login.vue -->
<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
            <h1 class="text-2xl font-bold text-center">Connexion</h1>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                    <input
                          id="username"
                          v-model="username"
                          type="text"
                          placeholder="Nom d'utilisateur"
                          class="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          :class="{ 'border-red-500': formErrors.username }"
                    />
                    <p v-if="formErrors.username" class="mt-1 text-sm text-red-500">{{ formErrors.username }}</p>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                          id="password"
                          v-model="password"
                          type="password"
                          placeholder="Mot de passe"
                          class="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          :class="{ 'border-red-500': formErrors.password }"
                    />
                    <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">{{ formErrors.password }}</p>
                </div>

                <div class="flex items-center">
                    <input
                          id="remember"
                          type="checkbox"
                          v-model="rememberMe"
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="remember" class="block ml-2 text-sm text-gray-700">Se souvenir de moi</label>
                </div>

                <button
                      type="submit"
                      class="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
                      :disabled="isLoading"
                >
          <span v-if="isLoading">
            <svg class="inline w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion en cours...
          </span>
                    <span v-else>Se connecter</span>
                </button>
            </form>

            <!-- Error message -->
            <div v-if="errorMessage" class="p-3 text-sm text-center text-red-700 bg-red-100 rounded">
                {{ errorMessage }}
            </div>

            <!-- Sign up link -->
            <p class="text-center text-sm">
                Pas encore inscrit ?
                <NuxtLink class="text-blue-600 hover:underline font-semibold" to="/register">S'inscrire</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { login, isAuthenticated } = useAuth();

// Form state
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const formErrors = reactive({
    username: '',
    password: '',
});

// Check if already logged in
onMounted(async () => {
    if (isAuthenticated.value) {
        router.push('/dashboard');
    }
});

// Form validation
const validateForm = () => {
    let isValid = true;
    formErrors.username = '';
    formErrors.password = '';

    if (!username.value.trim()) {
        formErrors.username = "Le nom d'utilisateur est requis";
        isValid = false;
    }

    if (!password.value) {
        formErrors.password = "Le mot de passe est requis";
        isValid = false;
    }

    return isValid;
};

// Handle login form submission
const handleLogin = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        errorMessage.value = '';

        const success = await login(username.value, password.value);

        if (success) {
            // If "remember me" is checked, could add additional persistence logic here
            router.push('/dashboard');
        } else {
            errorMessage.value = "Échec de la connexion. Veuillez vérifier vos identifiants.";
        }
    } catch (err) {
        console.error('Login error:', err);
        errorMessage.value = err?.data?.message || "Une erreur est survenue lors de la connexion";
    } finally {
        isLoading.value = false;
    }
};
</script>