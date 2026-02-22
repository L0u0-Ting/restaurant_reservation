import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Menu from './components/Menu';
import Location from './components/Location';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './components/OrderSuccess';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

import { MenuProvider } from './context/MenuContext';

function App() {
  return (
    <LanguageProvider>
      <MenuProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <CartProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/location" element={<Location />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<CheckoutForm />} />
                  <Route path="/success" element={<OrderSuccess />} />
                </Routes>
              </main>
              <footer className="footer">
                <p>&copy; 2026 棲所 The Haven. All rights reserved. | 聯絡我們 | 隱私政策</p>
              </footer>
            </div>
          </CartProvider>
        </Router>
      </MenuProvider>
    </LanguageProvider>
  );
}
export default App;
