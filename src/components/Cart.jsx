/**
 * ==============================
 * Imports
 * ==============================
 */
import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ScrollableQuantity from './ScrollableQuantity';

/**
 * ==============================
 * Component: Cart
 * Description: Displays the items in the shopping cart and allows modification.
 * Features:
 * - List of selected items with quantity controls
 * - Total price
 * - Proceed to checkout
 * ==============================
 */
const Cart = () => {
    /**
     * ==============================
     * Hooks & State
     * ==============================
     */
    const { cartItems, removeFromCart, deleteFromCart, addToCart, totalPrice, clearCart, updateCartItemQuantity } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    /**
     * ==============================
     * Render
     * ==============================
     */
    // -- Empty State --
    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <h2>{t('cartEmpty')}</h2>
                <button onClick={() => navigate('/menu')}>{t('backToMenu')}</button>
            </div>
        );
    }

    // -- Cart List --
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
                        <div className="item-quantity" style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={() => removeFromCart(item.id)}
                            >-</button>
                            <ScrollableQuantity
                                quantity={item.quantity}
                                setQuantity={(newQty) => {
                                    if (newQty === 0) {
                                        deleteFromCart(item.id);
                                    } else {
                                        updateCartItemQuantity(item.id, newQty);
                                    }
                                }}
                                min={0}
                                max={99}
                            />
                            <button onClick={() => addToCart(item)}>+</button>
                        </div>
                        <div className="item-subtotal">
                            {t('currency')} {item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary & Actions */}
            <div className="cart-summary">
                <h3>{t('total')}: {t('currency')} {totalPrice}</h3>
                <div className="cart-actions-group" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                        {t('checkout')}
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="back-btn" onClick={() => navigate('/menu')} style={{ flex: 1 }}>
                            {t('continueOrdering')}
                        </button>
                        <button className="clear-cart-btn" onClick={clearCart} style={{ flex: 1, backgroundColor: '#ff4d4f', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {t('clearCart')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
