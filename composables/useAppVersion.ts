// composables/useAppVersion.js
import packageJson from '~/package.json';

export const useAppVersion = () => {
    return packageJson.version;
};