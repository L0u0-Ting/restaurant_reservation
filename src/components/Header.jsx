/**
 * ==============================
 * Imports
 * ==============================
 */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

import Logo from './Logo';

/**
 * ==============================
 * Icons Components
 * ==============================
 */
const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const GlobeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

/**
 * ==============================
 * Component: Header
 * Description: The main navigation header of the application.
 * Contains:
 * - Logo/Home link
 * - Navigation links (Menu, Cart) with Icons
 * - Language switcher (Dropdown)
 * ==============================
 */
const Header = () => {
    /**
     * ==============================
     * Hooks & Context
     * ==============================
     */
    const { totalItems, isCartAnimating } = useCart();
    const { t, setLanguage, language } = useLanguage();
    const location = useLocation();

    // Dropdown State
    const [isLangOpen, setIsLangOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setIsLangOpen(false);
    };

    /**
     * ==============================
     * Render
     * ==============================
     */
    return (
        <header className="header">
            <div className="header-container">
                {/* Logo Section */}
                <div className="logo">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Logo />
                    </Link>
                </div>

                {/* Navigation Container */}
                <nav className="nav-container">
                    {/* Main Navigation Links */}
                    <div className="nav-links">
                        <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>
                            <span className="icon"><MenuIcon /></span>
                            <span className="text">{t('menu')}</span>
                        </Link>
                        <Link to="/cart" className={`nav-link cart-link ${isCartAnimating ? 'cart-shake' : ''} ${location.pathname === '/cart' ? 'active' : ''}`}>
                            <span className="icon"><CartIcon /></span>
                            <span className="text">{t('cart')}</span>
                            {totalItems > 0 && <span className="badge">{totalItems}</span>}
                        </Link>
                        <Link to="/location" className={`nav-link ${location.pathname === '/location' ? 'active' : ''}`}>
                            <span className="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </span>
                            <span className="text">{t('location')}</span>
                        </Link>
                    </div>

                    {/* Language Switcher Dropdown */}
                    <div className="lang-switcher-container" ref={dropdownRef}>
                        <button
                            className={`lang-toggle ${isLangOpen ? 'active' : ''}`}
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            aria-label="Change Language"
                        >
                            <GlobeIcon />
                        </button>

                        {isLangOpen && (
                            <div className="lang-dropdown">
                                <button
                                    className={`lang-option ${language === 'zh' ? 'active' : ''}`}
                                    onClick={() => handleLanguageSelect('zh')}
                                >
                                    繁體中文
                                </button>
                                <button
                                    className={`lang-option ${language === 'en' ? 'active' : ''}`}
                                    onClick={() => handleLanguageSelect('en')}
                                >
                                    English
                                </button>
                                <button
                                    className={`lang-option ${language === 'jp' ? 'active' : ''}`}
                                    onClick={() => handleLanguageSelect('jp')}
                                >
                                    日本語
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
