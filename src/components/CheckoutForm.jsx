/**
 * ==============================
 * Imports
 * ==============================
 */
import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

import Picker from 'react-mobile-picker';

// Helper: Generate or retrieve a UUID from localStorage
const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        // Generate a random UUID-like string
        deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
};

/**
 * ==============================
 * Component: CheckoutForm
 * Description: Form for user to input order details and submit order.
 * Features:
 * - Name, Phone, Note inputs
 * - Custom Time Picker (mobile-friendly)
 * - Order Summary display
 * - Google Apps Script integration for submission
 * ==============================
 */
const CheckoutForm = () => {
    /**
     * ==============================
     * State & Hooks
     * ==============================
     */
    const { cartItems, totalPrice, clearCart } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    // -- Form State --
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        time: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    // -- Time Picker State --
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerValue, setPickerValue] = useState('12:00');

    /**
     * ==============================
     * Helper Functions
     * ==============================
     */

    const generateTimeOptions = () => {
        const options = [];
        for (let h = 11; h <= 21; h++) {
            for (let m = 0; m < 60; m += 15) {
                if (h === 11 && m < 30) continue;
                if (h === 21 && m > 0) continue;
                options.push({
                    hour: h < 10 ? `0${h}` : `${h}`,
                    minute: m === 0 ? '00' : `${m}`
                });
            }
        }
        return options;
    };

    const timeOptions = generateTimeOptions();
    // For single column picker, we format them as HH:mm strings
    const formattedTimeOptions = timeOptions.map(t => `${t.hour}:${t.minute}`);


    /**
     * ==============================
     * Handlers
     * ==============================
     */

    // Update picker value when scrolling/selecting
    const handlePickerChange = (value) => {
        setPickerValue(value);
    };

    const confirmPicker = () => {
        setFormData(prev => ({ ...prev, time: pickerValue }));
        setIsPickerOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for time
        if (!formData.time) {
            alert(t('time') + ' ' + t('required')); // or custom message
            setIsPickerOpen(true);
            return;
        }

        setLoading(true);

        const payload = {
            deviceId: getOrCreateDeviceId(),
            name: formData.name,
            phone: formData.phone,
            time: formData.time,
            note: formData.note,
            language: language,
            // Strictly passing only id and quantity as required for backend verification
            items: cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))
        };

        const scriptUrl = import.meta.env.VITE_API_URL;

        try {
            if (scriptUrl) {
                // 發送給 GAS 的標準解法：用 URLSearchParams 確保不會踩到任何前端 fetch 原生限制與 CORS preflight 問題
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: new URLSearchParams({ payload: JSON.stringify(payload) })
                });

                const result = await response.json();

                if (result.status === "error") {
                    // Check if it's a rate limit error specifically
                    if (result.error_code === 429) {
                        throw new Error(t('rateLimitError') || "送出過於頻繁，請於 60 秒後再試。 / Please wait 60 seconds before submitting again.");
                    }
                    throw new Error(result.message || "Server rejected the order");
                }
            } else {
                // Mock submission for dev
                console.log("Mock Order Submission:", payload);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Redirect to success page
            navigate('/success');
        } catch (error) {
            console.error("Error submitting order:", error);
            alert(t('submitError') + (error.message ? `\n\nDetail: ${error.message}` : ''));
        } finally {
            // Restore button state
            setLoading(false);
        }
    };

    /**
     * ==============================
     * Effects & Scrolls
     * ==============================
     */

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/');
        }
    }, [cartItems, navigate]);

    const timeRef = useRef(null);
    const isScrollingRef = useRef(false); // To prevent scroll loop if needed

    // Scroll to initial position when picker opens
    useEffect(() => {
        if (isPickerOpen && timeRef.current) {
            setTimeout(() => {
                const index = formattedTimeOptions.indexOf(pickerValue);
                if (index !== -1) {
                    timeRef.current.scrollTop = index * 40;
                }
            }, 0);
        }
    }, [isPickerOpen, pickerValue]);

    const handleScroll = (e) => {
        clearTimeout(isScrollingRef.current);
        isScrollingRef.current = setTimeout(() => {
            const target = e.target;
            const scrollTop = target.scrollTop;
            const index = Math.round(scrollTop / 40);

            if (formattedTimeOptions[index]) {
                const newValue = formattedTimeOptions[index];
                if (pickerValue !== newValue) {
                    setPickerValue(newValue);
                }
            }
        }, 100);
    };

    /**
     * ==============================
     * Render
     * ==============================
     */
    if (cartItems.length === 0) {
        navigate('/');
        return null; // Don't render if empty cart
    }

    return (
        <div className="checkout-container">
            {/* Page Title */}
            <h2>{t('checkoutTitle')}</h2>

            {/* Main Form */}
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
                    <div
                        className="time-picker-trigger"
                        onClick={() => setIsPickerOpen(true)}
                        style={{
                            padding: '12px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            color: formData.time ? '#333' : '#aaa'
                        }}
                    >
                        {formData.time || t('time')}
                    </div>
                    {/* Hidden input to ensure validation works if needed, or simply rely on state check in handleSubmit */}
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

            {/* Mobile Time Picker Modal */}
            {isPickerOpen && (
                <div className="picker-overlay" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }} onClick={() => setIsPickerOpen(false)}>
                    <div className="picker-content" style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        animation: 'slideUp 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <div className="picker-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '15px',
                            fontSize: '1.1rem',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '10px'
                        }}>
                            <span onClick={() => setIsPickerOpen(false)} style={{ color: '#888', cursor: 'pointer' }}>Cancel</span>
                            <span style={{ fontWeight: 'bold' }}>{t('time')}</span>
                            <span onClick={confirmPicker} style={{ color: '#007aff', cursor: 'pointer', fontWeight: 'bold' }}>Confirm</span>
                        </div>

                        <div className="custom-picker" style={{ display: 'flex', justifyContent: 'center', height: '200px', overflow: 'hidden', position: 'relative' }}>
                            {/* Highlight Bar */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                right: 0,
                                transform: 'translateY(-50%)',
                                height: '40px',
                                borderTop: '1px solid #ddd',
                                borderBottom: '1px solid #ddd',
                                pointerEvents: 'none',
                                zIndex: 1
                            }}></div>

                            {/* Combined Time Column */}
                            <div
                                ref={timeRef}
                                onScroll={handleScroll}
                                style={{ flex: 1, overflowY: 'scroll', textAlign: 'center', scrollSnapType: 'y mandatory', padding: '80px 0' }}
                                className="no-scrollbar"
                            >
                                {formattedTimeOptions.map(timeOption => (
                                    <div
                                        key={timeOption}
                                        onClick={() => {
                                            handlePickerChange(timeOption);
                                            // Smooth scroll to clicked item
                                            const index = formattedTimeOptions.indexOf(timeOption);
                                            if (timeRef.current) {
                                                timeRef.current.scrollTo({
                                                    top: index * 40,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        style={{
                                            height: '40px',
                                            lineHeight: '40px',
                                            scrollSnapAlign: 'center',
                                            color: pickerValue === timeOption ? '#007aff' : '#333',
                                            fontWeight: pickerValue === timeOption ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s, font-weight 0.2s'
                                        }}
                                    >
                                        {timeOption}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutForm;
