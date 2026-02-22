import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useMenu } from '../context/MenuContext';
import ScrollableQuantity from './ScrollableQuantity';

// Loading Skeleton Component
const MenuSkeleton = () => (
    <div className="menu-grid">
        {[1, 2, 3, 4].map((n) => (
            <div key={n} className="menu-item skeleton-item" style={{ height: '380px', backgroundColor: '#f9f9f9' }}>
                <div style={{ height: '220px', backgroundColor: '#eee', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: '1.8rem' }}>
                    <div style={{ height: '20px', width: '60%', backgroundColor: '#eee', marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '15px', width: '90%', backgroundColor: '#eee', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '15px', width: '80%', backgroundColor: '#eee', animation: 'pulse 1.5s infinite' }} />
                </div>
            </div>
        ))}
    </div>
);

// Error Component with "Warm" message
const MenuError = ({ onRetry, t }) => (
    <div className="menu-error-container">
        <div className="error-icon">☕</div>
        <h3>廚房正在準備特別的料理...</h3>
        <p>目前無法載入菜單，請稍後再試。</p>
        <p className="sub-text">The kitchen is preparing something special. Please try again later.</p>
        <button onClick={onRetry} className="retry-btn">
            {t('retry') || '重新載入 / Reload'}
        </button>
    </div>
);

const Menu = () => {
    const { addToCart } = useCart();
    const { t, language } = useLanguage();

    // Use global menu context instead of local state
    const { items, loading, error, refreshMenu } = useMenu();

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Helper to extract localized string
    const getLocalizedText = (obj, lang) => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj['en'] || obj['zh'] || Object.values(obj)[0] || '';
    };

    // Handlers
    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setQuantity(1);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleAddToCart = () => {
        if (selectedItem) {
            addToCart(selectedItem, parseInt(quantity) || 1);

            const itemName = getLocalizedText(selectedItem.name, language);
            // Simple toast message
            setToastMessage(`${itemName} x ${(parseInt(quantity) || 1)}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            handleCloseModal();
        }
    };

    // Group items by category and sort by price
    const groupedItems = items.reduce((acc, item) => {
        // Skip items without a category completely
        if (!item.category) return acc;

        // Parse category column if it's a string representation of an object (e.g., Google Sheet output)
        let categoryObj = item.category;
        if (typeof categoryObj === 'string' && categoryObj.trim().startsWith('{')) {
            try {
                // Try converting pseudo-JSON from sheet into standard JSON
                const validJsonStrings = categoryObj
                    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Add quotes to keys
                    .replace(/:\s*'([^']*)'/g, ':"$1"'); // Replace single quotes with double quotes
                categoryObj = JSON.parse(validJsonStrings);
            } catch (e) {
                // If it fails to parse, treat it as a primary category string
                categoryObj = { zh: item.category, en: item.category, jp: item.category };
            }
        } else if (typeof categoryObj === 'string') {
            categoryObj = { zh: categoryObj, en: categoryObj, jp: categoryObj };
        }

        const categoryName = getLocalizedText(categoryObj, language);
        if (!categoryName) return acc; // Extra safety

        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {});

    Object.keys(groupedItems).forEach(category => {
        groupedItems[category].sort((a, b) => Number(a.price) - Number(b.price));
    });

    const categoryKeys = Object.keys(groupedItems);

    const scrollToCategory = (category) => {
        const element = document.getElementById(`category-${category}`);
        if (element) {
            // Adjust offset for the sticky header + sticky category bar
            const y = element.getBoundingClientRect().top + window.scrollY - 160;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="menu-container">
            <h2 className="section-title">{t('menu')}</h2>

            {loading ? (
                <MenuSkeleton />
            ) : error ? (
                <MenuError onRetry={refreshMenu} t={t} />
            ) : (
                <>
                    {/* Category Navigation Bar */}
                    <div className="category-nav-bar">
                        {categoryKeys.map((category) => (
                            <button
                                key={`nav-${category}`}
                                className="category-nav-btn"
                                onClick={() => scrollToCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="menu-categories">
                        {categoryKeys.map((category) => (
                            <div key={category} id={`category-${category}`} className="menu-category-section">
                                <h3 className="category-title">{category}</h3>
                                <div className="menu-grid">
                                    {groupedItems[category].map((item) => (
                                        <div key={item.id} className="menu-item fade-in">
                                            <div className="image-container">
                                                <img
                                                    src={item.image?.startsWith('/')
                                                        ? `${import.meta.env.BASE_URL}${item.image.substring(1)}`
                                                        : item.image}
                                                    alt={getLocalizedText(item.name, language)}
                                                    className="item-image"
                                                    onClick={() => handleOpenModal(item)}
                                                    style={{ cursor: 'pointer' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/400x300?text=Delicious';
                                                    }}
                                                />
                                            </div>
                                            <div className="item-details">
                                                <h3 onClick={() => handleOpenModal(item)} style={{ cursor: 'pointer' }}>
                                                    {getLocalizedText(item.name, language)}
                                                </h3>
                                                <p>{getLocalizedText(item.description, language)}</p>
                                                <div className="item-action">
                                                    <span className="price">{t('currency')} {item.price}</span>
                                                    <button
                                                        className="add-btn"
                                                        onClick={() => handleOpenModal(item)}
                                                    >
                                                        {t('addToCart')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Quantity Selection Modal */}
            {selectedItem && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>{getLocalizedText(selectedItem.name, language)}</h3>
                        <p className="modal-price">{t('currency')} {selectedItem.price}</p>

                        <div className="quantity-control">
                            <button onClick={() => setQuantity(Math.max(1, (parseInt(quantity) || 1) - 1))}>-</button>
                            <ScrollableQuantity
                                quantity={quantity}
                                setQuantity={setQuantity}
                                min={1}
                                max={99}
                            />
                            <button onClick={() => setQuantity(Math.min(99, (parseInt(quantity) || 1) + 1))}>+</button>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={handleCloseModal}>
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button className="confirm-btn" onClick={handleAddToCart}>
                                {t('addToCart')} - {t('currency')} {selectedItem.price * (parseInt(quantity) || 1)}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="check-icon">✓</span>
                        <span>{t('added') || 'Added'} {toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
