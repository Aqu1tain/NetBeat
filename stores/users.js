// stores/users.js
import { defineStore } from 'pinia';
import { useActivityStore } from './activity';

export const useUsersStore = defineStore('users', {
    state: () => ({
        usersList: [],
        usersCount: 0,
        adminCount: 0
    }),

    actions: {
        async fetchUsers() {
            if (process.server) return;

            try {
                const response = await $fetch('/api/users', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                this.usersList = response.users || [];
                this.usersCount = this.usersList.length;
                this.adminCount = this.usersList.filter(u => u.role === 'admin').length;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        // Get username from ID (for admin view)
        getUsername(userId) {
            if (!userId) return 'Inconnu';

            if (typeof userId === 'object' && userId.username) {
                return userId.username;
            }

            const foundUser = this.usersList.find(u => u._id === userId);
            return foundUser ? foundUser.username : 'Utilisateur #' + userId;
        },

        // Toggle user role (admin only)
        async toggleUserRole(userId, newRole) {
            try {
                await $fetch(`/api/users/${userId}/role`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: {
                        role: newRole
                    }
                });

                // Refresh users
                await this.fetchUsers();

                // Add to recent activity
                const activityStore = useActivityStore();
                activityStore.addActivity({
                    type: 'user_role_changed',
                    message: `Utilisateur #${userId.substring(0, 6)} ${newRole === 'admin' ? 'promu administrateur' : 'rétrogradé utilisateur'}`,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Error updating user role:', error);
                alert('Erreur lors de la mise à jour du rôle utilisateur');
            }
        }
    }
});