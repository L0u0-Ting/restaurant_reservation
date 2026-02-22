import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartAnimating, setIsCartAnimating] = useState(false);

    const triggerCartAnimation = () => {
        setIsCartAnimating(true);
        setTimeout(() => setIsCartAnimating(false), 500);
    };

    const addToCart = (item, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.id === item.id);
            if (existingItem) {
                const currentQty = parseInt(existingItem.quantity) || 0;
                const addedQty = parseInt(quantity) || 1;
                const newQuantity = Math.min(99, currentQty + addedQty);
                return prevItems.map((i) =>
                    i.id === item.id ? { ...i, quantity: newQuantity } : i
                );
            }
            const initialQty = Math.min(99, parseInt(quantity) || 1);
            return [...prevItems, { ...item, quantity: initialQty }];
        });
        triggerCartAnimation();
    };

    const updateCartItemQuantity = (id, quantity) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity };
            }
            return item;
        }));
    };

    const deleteFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.reduce((acc, item) => {
                if (item.id === id) {
                    if ((parseInt(item.quantity) || 0) > 1) {
                        acc.push({ ...item, quantity: (parseInt(item.quantity) || 1) - 1 });
                    }
                } else {
                    acc.push(item);
                }
                return acc;
            }, [])
        );
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * (parseInt(item.quantity) || 0),
        0
    );

    const totalItems = cartItems.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                deleteFromCart,
                updateCartItemQuantity,
                clearCart,
                totalPrice,
                totalItems,
                isCartAnimating,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
