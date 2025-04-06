// utils/formatters.js

/**
 * Format date for display in French locale
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Truncate a string and add ellipsis if needed
 * @param {string} str - String to truncate
 * @param {number} length - Max length before truncation
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Format a number as a percentage
 * @param {number} value - Value to format
 * @param {number} total - Total value for percentage calculation
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, total, decimals = 0) => {
    if (!total) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format bytes to human readable format (KB, MB, etc)
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted size string
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};