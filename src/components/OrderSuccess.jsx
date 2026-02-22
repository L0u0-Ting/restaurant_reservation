import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart on success page load
        clearCart();

        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // multiple origins
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="success-container" style={{ textAlign: 'center', padding: '50px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div className="success-content" style={{ zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#2ecc71', fontSize: '3rem', marginBottom: '20px' }}>🎉 {t('orderSuccessTitle') || '預約成功！'}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }}>
                    {t('orderSuccessMessage') || '謝謝您的預約，我們期待您的光臨！'}
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 30px',
                        fontSize: '1.1rem',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {t('backToHome') || '返回首頁'}
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;
