import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <CartProvider>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;