import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMenuData } from '../services/menuService';

const MenuContext = createContext();

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(0);

    // Cache duration in milliseconds (e.g., 30 minutes)
    const CACHE_DURATION = 30 * 60 * 1000;

    const loadMenu = async (force = false) => {
        const now = Date.now();

        // If we have data and it's fresh enough, don't re-fetch unless forced
        if (!force && items.length > 0 && (now - lastFetched < CACHE_DURATION)) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await fetchMenuData();
            setItems(data);
            setLastFetched(now);
        } catch (err) {
            console.error(err);
            // If we have stale data, keep showing it but log error?
            // Or show error state? For now, standard error state.
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial pre-fetch on mount
    useEffect(() => {
        loadMenu();
    }, []);

    return (
        <MenuContext.Provider value={{ items, loading, error, refreshMenu: () => loadMenu(true) }}>
            {children}
        </MenuContext.Provider>
    );
};
