import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './components/OrderSuccess';
import { CartProvider } from './context/CartContext';

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/success" element={<OrderSuccess />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>&copy; 2026 溫馨小館. All rights reserved.</p>
            </footer>
          </div>
        </CartProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
