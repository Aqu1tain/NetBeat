// plugins/auth.ts
export default defineNuxtPlugin(() => {
    // Initialize auth on app startup
    const { initAuth, setupTokenRefresh } = useAuth();

    // Verify token and set up refresh if valid
    initAuth().then(isAuthenticated => {
        if (isAuthenticated) {
            setupTokenRefresh();
        }
    });
});