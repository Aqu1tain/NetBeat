// utils/auth.ts
import jwt_decode from 'jwt-decode';

interface UserSession {
    id: string;
    username: string;
    role: 'user' | 'admin';
    exp?: number;
}

export const useAuth = () => {
    const user = ref<UserSession | null>(null);
    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    const router = useRouter();

    // Check if token is expired
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded: any = jwt_decode(token);
            // Check if the expiration time has passed
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    // Get remaining session time in minutes
    const getSessionTimeRemaining = (): number | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decoded: any = jwt_decode(token);
            const remainingTime = decoded.exp * 1000 - Date.now();
            return Math.max(0, Math.floor(remainingTime / 60000)); // Convert to minutes
        } catch (error) {
            return null;
        }
    };

    // Initialize auth state from localStorage
    const initAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            user.value = null;
            return false;
        }

        if (isTokenExpired(token)) {
            // Token expired, clear it and redirect to login
            localStorage.removeItem('token');
            user.value = null;
            return false;
        }

        try {
            // Decode and set the user
            const decoded: UserSession = jwt_decode(token);
            user.value = decoded;
            return true;
        } catch (error) {
            console.error('Failed to decode token:', error);
            localStorage.removeItem('token');
            user.value = null;
            return false;
        }
    };

    // Login function
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await $fetch('/api/auth/login', {
                method: 'POST',
                body: { username, password },
            });

            if (res.token) {
                localStorage.setItem('token', res.token);
                const decoded: UserSession = jwt_decode(res.token);
                user.value = decoded;
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Login error:', error);
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        user.value = null;
        router.push('/login');
    };

    // Check if user has required role
    const requireAuth = async (requiredRole?: 'admin' | 'user') => {
        const isAuthed = await initAuth();

        if (!isAuthed) {
            router.push('/login');
            return false;
        }

        if (requiredRole && user.value?.role !== requiredRole && !(requiredRole === 'user' && user.value?.role === 'admin')) {
            router.push('/unauthorized');
            return false;
        }

        return true;
    };

    // Set up auto refresh before token expiration
    const setupTokenRefresh = () => {
        if (!user.value) return;

        const remainingTime = getSessionTimeRemaining();
        if (!remainingTime) return;

        // If less than 10 minutes remaining, refresh now
        if (remainingTime < 10) {
            refreshToken();
            return;
        }

        // Set timer to refresh 5 minutes before expiration
        const timeToRefresh = (remainingTime - 5) * 60 * 1000;
        setTimeout(() => refreshToken(), timeToRefresh);
    };

    // Refresh the token
    const refreshToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await $fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.token) {
                localStorage.setItem('token', res.token);
                const decoded: UserSession = jwt_decode(res.token);
                user.value = decoded;
                setupTokenRefresh();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, log out
            logout();
        }
    };

    return {
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        initAuth,
        requireAuth,
        setupTokenRefresh,
        getSessionTimeRemaining
    };
};