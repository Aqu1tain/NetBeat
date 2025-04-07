<template>
    <div v-if="showPopup" class="popup">
        <div class="popup-content">
            <h3>Mise à jour disponible</h3>
            <p>Version actuelle : {{ currentVersion }}</p>
            <p>Nouvelle version : {{ latestVersion }}</p>
            <button @click="updateApp">Mettre à jour</button>
            <button @click="showPopup = false">Ignorer</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppVersion } from '~/composables/useAppVersion'; // Nouveau nom

const currentVersion = ref(useAppVersion()); // Récupère la version locale
const latestVersion = ref('');
const showPopup = ref(false);

const checkForUpdates = async () => {
    try {
        const response = await fetch('https://api.github.com/repos/Aqu1tain/Packet-Tracer-Monitorer/releases/latest', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
        });
        const data = await response.json();
        latestVersion.value = data.tag_name.replace('v', ''); // Ex: "1.0.1"

        if (latestVersion.value !== currentVersion.value) {
            showPopup.value = true;
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour :', error);
    }
};

const updateApp = async () => {
    try {
        const response = await $fetch('/api/update', { method: 'POST' });
        if (response.success) {
            alert('Mise à jour terminée. L’application va redémarrer.');
            // Optionnel : Forcer un rechargement de la page
            window.location.reload();
        } else {
            alert(response.message);
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour : ' + error.message);
    }
    showPopup.value = false;
};

onMounted(() => {
    checkForUpdates();
    // Vérifier toutes les heures (optionnel)
    setInterval(checkForUpdates, 60 * 60 * 1000);
});
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.popup-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}
button {
    margin: 10px;
    padding: 8px 16px;
}
</style>