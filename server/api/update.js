import { execSync } from 'child_process';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        // Exécuter les commandes Git pour mettre à jour
        execSync('git fetch', { stdio: 'inherit' });
        execSync('git reset --hard', { stdio: 'inherit' });
        execSync('git pull origin main', { stdio: 'inherit' });
        execSync('npm install', { stdio: 'inherit' });

        return { success: true, message: 'Mise à jour terminée.' };
    } catch (error) {
        return { success: false, message: `Erreur : ${error.message}` };
    }
});