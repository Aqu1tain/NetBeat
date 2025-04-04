// plugins/auth.ts
export default defineNuxtPlugin(nuxtApp => {
    // Initialize auth on app startup
    const { initAuth, setupTokenRefresh } = useAuth();

    // Skip on server side
    if (process.client) {
        // Only run on client-side
        nuxtApp.hook('app:mounted', () => {
            // Verify token and set up refresh if valid
            initAuth().then(isAuthenticated => {
                if (isAuthenticated) {
                    setupTokenRefresh();
                }
            });
        });
    }
});
