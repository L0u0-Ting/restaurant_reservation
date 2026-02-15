import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        time: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            ...formData,
            items: cartItems.map(item => `${item.name[language]} x${item.quantity}`).join(', '),
            totalPrice: totalPrice,
            language: language
        };

        const scriptUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

        try {
            if (scriptUrl) {
                await fetch(scriptUrl, {
                    method: 'POST',
                    body: JSON.stringify(orderData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                console.log("Mock Order Submission:", orderData);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            clearCart();
            navigate('/success');
        } catch (error) {
            console.error("Error submitting order:", error);
            alert(t('submitError'));
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div className="checkout-container">
            <h2>{t('checkoutTitle')}</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label htmlFor="name">{t('name')}</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('namePlaceholder')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">{t('phone')}</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder={t('phonePlaceholder')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time">{t('time')}</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="note">{t('note')}</label>
                    <textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder={t('notePlaceholder')}
                    ></textarea>
                </div>

                <div className="order-summary">
                    <h3>{t('orderSummary')}</h3>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                {item.name[language]} x {item.quantity} - {t('currency')} {item.price * item.quantity}
                            </li>
                        ))}
                    </ul>
                    <p className="total">{t('total')}: {t('currency')} {totalPrice}</p>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? t('submitting') : t('submitOrder')}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
