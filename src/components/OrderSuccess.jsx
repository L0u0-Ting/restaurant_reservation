import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const OrderSuccess = () => {
    const { t } = useLanguage();

    return (
        <div className="success-container">
            <h2>{t('orderSuccessTitle')}</h2>
            <p>{t('orderSuccessMessage')}</p>
            <Link to="/" className="home-btn">{t('backToHome')}</Link>
        </div>
    );
};

export default OrderSuccess;
