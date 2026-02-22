/**
 * ==============================
 * Service: Menu Service
 * Description: Fetches menu data from Google Apps Script.
 * ==============================
 */

// Fallback data in case the API fails or is not set up yet
import { menuItems as mockMenuItems } from './mockData';

const MENU_API_URL = import.meta.env.VITE_API_URL;

export const fetchMenuData = async () => {
    // If no URL is configured, throw an error to be handled by the component
    if (!MENU_API_URL) {
        console.warn('Google Apps Script URL not found.');
        throw new Error('Configuration Error: Menu API URL not found.');
    }

    try {
        const response = await fetch(MENU_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Apps Script Response:', result); // Debug log

        if (result.status === 'success' && Array.isArray(result.data)) {
            return result.data.map(item => ({
                ...item,
                // Ensure price is a number
                price: Number(item.price),
                // Ensure id is present
                id: item.id || Math.random().toString(36).substr(2, 9)
            }));
        } else {
            // If the API returns an error or unexpected format, throw to trigger fallback/error handling
            console.error('API Error:', result);
            throw new Error(result.error || 'Invalid data format');
        }

    } catch (error) {
        console.error('Failed to fetch menu:', error);
        throw error;
    }
};
