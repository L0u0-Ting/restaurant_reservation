import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, addToCart, totalPrice } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>{t('cartEmpty')}</h2>
                <button onClick={() => navigate('/')}>{t('backToMenu')}</button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>{t('cartList')}</h2>
            <div className="cart-list">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <h3>{item.name[language]}</h3>
                            <p>{t('currency')} {item.price}</p>
                        </div>
                        <div className="item-quantity">
                            <button
                                onClick={() => removeFromCart(item.id)}
                            >-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => addToCart(item)}>+</button>
                        </div>
                        <div className="item-subtotal">
                            {t('currency')} {item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>{t('total')}: {t('currency')} {totalPrice}</h3>
                <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                    {t('checkout')}
                </button>
                <button className="back-btn" onClick={() => navigate('/')}>
                    {t('continueOrdering')}
                </button>
            </div>
        </div>
    );
};

export default Cart;
