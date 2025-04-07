<template>
    <div v-if="showPopup" class="popup">
        <div class="popup-content">
            <h3>Mise à jour disponible</h3>

            <div class="version-info">
                <p>Version actuelle : {{ currentVersion }}</p>
                <p>Nouvelle version : {{ latestVersion }}</p>
            </div>

            <div class="popup-actions">
                <button @click="updateApp" class="btn-update" :disabled="isUpdating">
                    <span v-if="isUpdating" class="spinner"></span>
                    <span>{{ isUpdating ? 'Mise à jour en cours...' : 'Mettre à jour' }}</span>
                </button>
                <button @click="showPopup = false" class="btn-cancel" :disabled="isUpdating">Ignorer</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppVersion } from '~/composables/useAppVersion';

const currentVersion = ref(useAppVersion());
const latestVersion = ref('');
const showPopup = ref(false);
const isUpdating = ref(false);

const checkForUpdates = async () => {
    try {
        const response = await fetch('https://api.github.com/repos/Aqu1tain/Packet-Tracer-Monitorer/releases/latest', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
        });
        const data = await response.json();
        latestVersion.value = data.tag_name.replace('v', '');

        if (latestVersion.value !== currentVersion.value) {
            showPopup.value = true;
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des mises à jour :', error);
    }
};

const updateApp = async () => {
    if (isUpdating.value) return;

    isUpdating.value = true;
    try {
        const response = await $fetch('/api/update', { method: 'POST' });
        if (response.success) {
            alert("Mise à jour terminée. L'application va redémarrer.");
            window.location.reload();
        } else {
            alert(response.message);
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour : ' + error.message);
        isUpdating.value = false;
    }
    // Ne fermez pas le popup en cas d'erreur, il sera fermé après rechargement en cas de succès
};

onMounted(() => {
    checkForUpdates();
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
    z-index: 1000;
}

.popup-content {
    background: white;
    width: 90%;
    max-width: 400px;
    padding: 24px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    text-align: center;
}

.version-info {
    margin-bottom: 20px;
}

.version-info p {
    margin: 8px 0;
    text-align: center;
    color: #333;
}

.popup-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
}

button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
}

.btn-update {
    background-color: #4a90e2;
    color: white;
}

.btn-update:hover {
    background-color: #3a80d2;
}

.btn-update:disabled {
    background-color: #78a7e4;
    cursor: not-allowed;
}

.btn-cancel {
    background-color: #f1f1f1;
    color: #333;
}

.btn-cancel:hover {
    background-color: #e4e4e4;
}

.btn-cancel:disabled {
    background-color: #f1f1f1;
    color: #999;
    cursor: not-allowed;
}

.spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>