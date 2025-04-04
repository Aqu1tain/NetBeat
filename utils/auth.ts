import { ref, computed } from 'vue';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'vue-router';

interface UserSession {
    id: string;
    username: string;
    role: 'user' | 'admin';
    exp?: number;
}

interface AuthResponse {
    token: string;
}

export const useAuth = () => {
    const user = ref<UserSession | null>(null);
    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    const router = useRouter();

    // Accès sécurisé à localStorage (uniquement côté client)
    const getToken = (): string | null => {
        if (process.server) return null;
        return localStorage.getItem('token');
    };

    const setToken = (token: string): void => {
        if (process.server) return;
        localStorage.setItem('token', token);
    };

    const removeToken = (): void => {
        if (process.server) return;
        localStorage.removeItem('token');
    };

    // Vérifie si le token est expiré
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded: any = jwt_decode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    // Récupère le temps restant de session en minutes
    const getSessionTimeRemaining = (): number | null => {
        const token = getToken();
        if (!token) return null;

        try {
            const decoded: any = jwt_decode(token);
            const remainingTime = decoded.exp * 1000 - Date.now();
            return Math.max(0, Math.floor(remainingTime / 60000));
        } catch (error) {
            return null;
        }
    };

    // Initialise l'état d'authentification depuis localStorage
    const initAuth = async () => {
        if (process.server) return false;

        const token = getToken();

        if (!token) {
            user.value = null;
            return false;
        }

        if (isTokenExpired(token)) {
            removeToken();
            user.value = null;
            return false;
        }

        try {
            const decoded: UserSession = jwt_decode(token);
            user.value = decoded;
            return true;
        } catch (error) {
            console.error('Failed to decode token:', error);
            removeToken();
            user.value = null;
            return false;
        }
    };

    // Fonction de login
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await $fetch<AuthResponse>('/api/auth/login', {
                method: 'POST',
                body: { username, password },
            });

            if (res.token) {
                setToken(res.token);
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

    // Fonction de logout
    const logout = () => {
        removeToken();
        user.value = null;
        router.push('/login');
    };

    // Vérifie que l'utilisateur dispose du rôle requis
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

    // Rafraîchit le token
    const refreshToken = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const res = await $fetch<AuthResponse>('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.token) {
                setToken(res.token);
                const decoded: UserSession = jwt_decode(res.token);
                user.value = decoded;
                setupTokenRefresh();
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    // Met en place le rafraîchissement automatique du token
    const setupTokenRefresh = () => {
        if (process.server) return;
        if (!user.value) return;

        const remainingTime = getSessionTimeRemaining();
        if (remainingTime === null) return;

        // Rafraîchit immédiatement si moins de 10 minutes restantes
        if (remainingTime < 10) {
            void refreshToken();
            return;
        }

        // Rafraîchit 5 minutes avant expiration
        const timeToRefresh = (remainingTime - 5) * 60 * 1000;
        setTimeout(() => {
            void refreshToken();
        }, timeToRefresh);
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
