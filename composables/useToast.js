// composables/useToast.js
import { ref } from 'vue';

const toasts = ref([]);
let toastTimeout = null;

export function useToast() {
    const showToast = ({ message, type = 'info', duration = 3000 }) => {
        const id = Date.now();

        // Add new toast to the array
        toasts.value.push({
            id,
            message,
            type,
            show: true
        });

        // Remove toast after duration
        setTimeout(() => {
            const index = toasts.value.findIndex(toast => toast.id === id);
            if (index !== -1) {
                // First set show to false for animation
                toasts.value[index].show = false;

                // Then remove from array after animation completes
                setTimeout(() => {
                    toasts.value = toasts.value.filter(toast => toast.id !== id);
                }, 300);
            }
        }, duration);
    };

    const clearToasts = () => {
        toasts.value = [];
    };

    return {
        toasts,
        showToast,
        clearToasts
    };
}