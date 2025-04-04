import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  ssr: true,
  modules: [
    'nuxt-mongoose',
  ],
  compatibilityDate: "2025-03-31",
  css: ['~/assets/css/main.css'],
  plugins: [
    '~/plugins/auth'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})