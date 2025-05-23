import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  ssr: true,
  modules: [
    'nuxt-mongoose',
    '@pinia/nuxt',
  ],
  compatibilityDate: "2025-03-31",
  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/auth'
  ],
  runtimeConfig: {
    public: {
      gitRepo: process.env.GITREPO || 'Aqu1tain/Packet-Tracer-Monitorer', // Fallback value
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})