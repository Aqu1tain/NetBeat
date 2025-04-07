<template>
    <div class="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <!-- Header avec informations -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Historique des versions</h2>
            <div class="mt-2 md:mt-0 flex items-center">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {{ releases.length }} version{{ releases.length > 1 ? 's' : '' }}
                </span>
            </div>
        </div>

        <!-- État de chargement -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-500">Chargement des versions...</p>
        </div>

        <!-- Message d'erreur -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm text-red-700">{{ error }}</p>
                <button
                      @click="fetchReleases"
                      class="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </div>

        <!-- Contenu principal -->
        <div v-else>
            <!-- Version Actuelle -->
            <div v-if="currentVersion" class="mb-8 relative">
                <div class="absolute -top-3 left-4">
                <span class="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Version actuelle
                </span>
                </div>
                <div class="border border-blue-200 bg-blue-50 rounded-lg p-5 pt-6">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h3 class="text-xl font-semibold text-blue-800">{{ currentVersion.tag_name }}</h3>
                        <div class="mt-2 sm:mt-0 flex items-center space-x-3">
                        <span class="text-gray-500 text-sm">
                            {{ formatDate(currentVersion.published_at) }}
                        </span>
                            <span v-if="currentVersion.prerelease" class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Pré-version
                        </span>
                        </div>
                    </div>
                    <div class="prose prose-blue max-w-none">
                        <MarkdownRenderer :content="currentVersion.body || 'Aucune description disponible.'" />
                    </div>
                </div>
            </div>

            <!-- Séparateur pour les versions précédentes -->
            <div v-if="otherReleases.length > 0" class="flex items-center my-8">
                <div class="flex-grow border-t border-gray-200"></div>
                <span class="flex-shrink-0 text-gray-500 text-sm px-4">Versions précédentes</span>
                <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <!-- Liste des versions précédentes -->
            <div v-if="otherReleases.length > 0" class="space-y-6">
                <div
                      v-for="release in otherReleases"
                      :key="release.id"
                      class="border border-gray-200 hover:border-gray-300 rounded-lg p-5 transition-all duration-200 hover:shadow-sm"
                      :class="{ 'border-yellow-200 bg-yellow-50': release.prerelease }"
                >
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div class="flex items-center">
                            <h3 class="text-lg font-medium text-gray-800">{{ release.tag_name }}</h3>
                            <span v-if="isNewerThanCurrent(release)" class="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Plus récente
                        </span>
                        </div>
                        <div class="mt-2 sm:mt-0 flex items-center space-x-3">
                        <span class="text-gray-500 text-sm">
                            {{ formatDate(release.published_at) }}
                        </span>
                            <span v-if="release.prerelease" class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Pré-version
                        </span>
                        </div>
                    </div>

                    <div class="prose max-w-none">
                        <MarkdownRenderer :content="release.body || 'Aucune description disponible.'" />
                    </div>

                    <div v-if="isNewerThanCurrent(release)" class="mt-4 flex justify-end">
                        <button
                              @click="updateToVersion(release.tag_name)"
                              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                            Mettre à jour vers cette version
                        </button>
                    </div>
                </div>
            </div>

            <!-- Message si aucune autre version -->
            <div v-else-if="!currentVersion" class="text-center py-8 text-gray-500">
                Aucune version disponible
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineComponent } from 'vue';
import MarkdownIt from 'markdown-it';
import { useAppVersion } from '~/composables/useAppVersion';

// Initialize markdown-it with Tailwind-friendly options
const md = new MarkdownIt({
    breaks: true,
    html: true,
    typographer: true,
});

// MarkdownRenderer component
const MarkdownRenderer = defineComponent({
    props: {
        content: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const renderedContent = computed(() => md.render(props.content));
        return () => h('div', {
            innerHTML: renderedContent.value,
            class: 'markdown-body'
        });
    }
});

// Variables réactives
const releases = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Récupérer la version locale
const currentLocalVersion = useAppVersion();

// Fonction pour formater les dates
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Calculer la version actuelle et les autres versions
const currentVersion = computed(() => {
    return releases.value.find((release) => release.tag_name.replace('v', '') === currentLocalVersion) || null;
});

const otherReleases = computed(() => {
    return releases.value.filter((release) => release.tag_name.replace('v', '') !== currentLocalVersion);
});

// Vérifier si une version est plus récente que la version actuelle
const isNewerThanCurrent = (release: any) => {
    if (!currentVersion.value) return false;

    const releaseVersion = release.tag_name.replace('v', '').split('.').map(Number);
    const currentVersionParts = currentVersion.value.tag_name.replace('v', '').split('.').map(Number);

    for (let i = 0; i < Math.max(releaseVersion.length, currentVersionParts.length); i++) {
        const releaseComponent = releaseVersion[i] || 0;
        const currentComponent = currentVersionParts[i] || 0;

        if (releaseComponent > currentComponent) return true;
        if (releaseComponent < currentComponent) return false;
    }

    return false;
};

// Fonction pour mettre à jour vers une version spécifique
const updateToVersion = async (version: string) => {
    try {
        // Implémentez ici la logique de mise à jour
        const response = await $fetch('/api/update', {
            method: 'POST',
            body: { version: version.replace('v', '') }
        });

        if (response.success) {
            alert('Mise à jour terminée. L\'application va redémarrer.');
            window.location.reload();
        } else {
            alert(response.message || 'Erreur lors de la mise à jour');
        }
    } catch (error: any) {
        alert('Erreur lors de la mise à jour : ' + (error.message || 'Erreur inconnue'));
    }
};

// Fonction pour récupérer les releases depuis GitHub
const fetchReleases = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await fetch('https://api.github.com/repos/Aqu1tain/Packet-Tracer-Monitorer/releases', {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: Impossible de récupérer les versions`);
        }

        const data = await response.json();
        releases.value = data.sort((a: any, b: any) =>
              new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
    } catch (err: any) {
        error.value = err.message || 'Une erreur est survenue lors de la récupération des versions';
    } finally {
        loading.value = false;
    }
};

// Charger les releases au démarrage
onMounted(() => {
    fetchReleases();
});
</script>

<style scoped>
/* Styles pour le contenu markdown */
.markdown-content h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.markdown-content h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
}

.markdown-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.markdown-content p {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

.markdown-content ul,
.markdown-content ol {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
}

.markdown-content ul {
    list-style-type: disc;
}

.markdown-content ol {
    list-style-type: decimal;
}

.markdown-content li {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
}

.markdown-content a {
    color: #2563eb;
    text-decoration: none;
}

.markdown-content a:hover {
    text-decoration: underline;
}

.markdown-content blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    font-style: italic;
    color: #6b7280;
    margin: 1rem 0;
}

.markdown-content code {
    font-family: monospace;
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
}

.markdown-content pre {
    background-color: #f3f4f6;
    padding: 0.75rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1rem 0;
}

.markdown-content pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
}

.markdown-content img {
    max-width: 100%;
    border-radius: 0.375rem;
    margin: 1rem 0;
}

.markdown-content hr {
    height: 1px;
    background-color: #e5e7eb;
    border: none;
    margin: 1.5rem 0;
}

.markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.markdown-content th,
.markdown-content td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem 0.75rem;
}

.markdown-content th {
    background-color: #f9fafb;
    font-weight: 600;
}
</style>
