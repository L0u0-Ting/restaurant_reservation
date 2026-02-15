import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
    const { totalItems } = useCart();
    const { t, setLanguage, language } = useLanguage();

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">{t('appTitle')}</Link>
            </div>
            <nav className="nav-container">
                <div className="nav-links">
                    <Link to="/" className="nav-link">{t('menu')}</Link>
                    <Link to="/cart" className="nav-link cart-link">
                        {t('cart')} {totalItems > 0 && <span className="badge">{totalItems}</span>}
                    </Link>
                </div>
                <div className="lang-switcher">
                    <button
                        className={`lang-btn ${language === 'zh' ? 'active' : ''}`}
                        onClick={() => setLanguage('zh')}
                    >
                        繁
                    </button>
                    <button
                        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`lang-btn ${language === 'jp' ? 'active' : ''}`}
                        onClick={() => setLanguage('jp')}
                    >
                        日
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
