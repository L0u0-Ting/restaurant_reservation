import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Location = () => {
    const { t } = useLanguage();

    return (
        <div className="location-container fade-in">
            <h2 className="section-title">{t('location') || '店鋪位置'}</h2>

            <div className="location-content">
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2624.031991795193!2d-123.39590822334253!3d-48.87666667133463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDjCsDUyJzM2LjAiUyAxMjPCsDIzJzM2LjAiVw!5e0!3m2!1szh-TW!2sjp!4v1771568805718!5m2!1szh-TW!2sjp"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '16px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Restaurant Location Map"
                    ></iframe>
                </div>

                <div className="location-details">
                    <div className="info-card">
                        <h3>📍 {t('addressTitle') || '地址'}</h3>
                        <p>{t('addressDetails') || '海洋難抵極'} <br />
                            <span className="sub-text">{t('addressSubtext') || '(尼莫點)'}</span>
                        </p>
                    </div>

                    <div className="info-card">
                        <h3>🚇 {t('transportTitle') || '交通方式'}</h3>
                        <ul className="transport-list">
                            <li><strong>{t('transportMrtLabel') || '捷運：'}</strong> {t('transportMrtDesc') || '搭乘至「西門站」6 號出口，步行約 5 分鐘。'}</li>
                            <li><strong>{t('transportBusLabel') || '公車：'}</strong> {t('transportBusDesc') || '可搭乘 12, 202, 212 等路線至「中華路北站」下車，步行 2 分鐘。'}</li>
                            <li><strong>{t('transportParkingLabel') || '停車：'}</strong> {t('transportParkingDesc') || '附近設有嘟嘟房西門中華站，或是直接停放於峨眉立體停車場。'}</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h3>📞 {t('contactTitle') || '聯絡方式'}</h3>
                        <p>{t('contactPhone') || '電話：(02) 2345-6789'}</p>
                        <p>{t('contactHours') || '營業時間：11:30 - 21:00 (週一公休)'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;
