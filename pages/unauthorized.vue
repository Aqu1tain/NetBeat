<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow text-center">
            <div class="text-red-500 text-6xl mb-4">
                <i class="fas fa-ban"></i> <!-- You can replace with your preferred icon -->
            </div>
            <h1 class="text-2xl font-bold text-red-700">Accès non autorisé</h1>
            <p class="text-gray-600 mb-6">
                Vous n'avez pas les droits suffisants pour accéder à cette page.
            </p>
            <div class="flex flex-col space-y-3">
                <button
                      @click="goToDashboard"
                      class="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Retour au tableau de bord
                </button>
                <button
                      @click="logout"
                      class="w-full py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const { logout } = useAuth();

function goToDashboard() {
    router.push('/dashboard');
}
</script>