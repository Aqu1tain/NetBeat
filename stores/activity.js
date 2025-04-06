// stores/activity.js
import { defineStore } from 'pinia';

export const useActivityStore = defineStore('activity', {
    state: () => ({
        activities: []
    }),

    actions: {
        // Add a new activity to the log
        addActivity(activity) {
            this.activities.unshift({
                id: Date.now(), // Simple unique ID for demo
                ...activity,
                timestamp: activity.timestamp || new Date()
            });
        },

        // Initialize with default sample activities
        initializeDefaultActivities() {
            this.activities = [
                {
                    id: 1,
                    type: 'ticket_created',
                    message: 'Nouveau ticket créé: "Problème de connexion réseau"',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
                },
                {
                    id: 2,
                    type: 'ticket_closed',
                    message: 'Ticket #a12b3c marqué comme résolu',
                    timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
                },
                {
                    id: 3,
                    type: 'user_login',
                    message: 'Connexion à l\'application',
                    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
                }
            ];
        },

        // Get color for activity type
        activityTypeColor(type) {
            const colors = {
                'ticket_created': 'bg-blue-500',
                'ticket_closed': 'bg-green-500',
                'ticket_reopened': 'bg-yellow-500',
                'user_login': 'bg-purple-500',
                'device_created': 'bg-indigo-500',
                'device_updated': 'bg-cyan-500',
                'device_deleted': 'bg-red-500',
                'device_polled': 'bg-teal-500',
                'default': 'bg-gray-500'
            };
            return colors[type] || colors.default;
        }
    }
});