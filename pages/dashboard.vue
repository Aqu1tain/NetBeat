<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 class="text-xl font-bold">Dashboard</h1>
                <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Déconnexion
                </button>
            </div>
        </header>
        <main class="container mx-auto px-4 py-8">
            <p class="text-lg">Bienvenue, <span class="font-semibold">{{ user.username }}</span> !</p>
            <!-- Zone future pour monitoring et ticketing -->
            <section class="mt-8">
                <h2 class="text-2xl font-bold mb-4">Supervision</h2>
                <!-- Par exemple, une carte ou un tableau des équipements -->
                <div class="p-4 bg-white rounded shadow">
                    <p>Les données de monitoring s'afficheront ici...</p>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';

const user = ref({});
const router = useRouter();

onMounted(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
    } else {
        try {
            user.value = jwt_decode(token);
        } catch (error) {
            router.push('/login');
        }
    }
});

function logout() {
    localStorage.removeItem('token');
    router.push('/login');
}
</script>
