import React from 'react';
import { menuItems } from '../services/mockData';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Menu = () => {
    const { addToCart } = useCart();
    const { t, language } = useLanguage();

    return (
        <div className="menu-container">
            <h2>{t('menu')}</h2>
            <div className="menu-grid">
                {menuItems.map((item) => (
                    <div key={item.id} className="menu-item">
                        <img src={item.image} alt={item.name[language]} className="item-image" />
                        <div className="item-details">
                            <h3>{item.name[language]}</h3>
                            <p>{item.description[language]}</p>
                            <div className="item-action">
                                <span className="price">{t('currency')} {item.price}</span>
                                <button onClick={() => addToCart(item)} className="add-btn">
                                    {t('addToCart')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
