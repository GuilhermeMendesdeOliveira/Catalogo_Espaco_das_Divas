import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Crown, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Import da Logo
import LogoPng from '../assets/LogoPng.png';

const Header = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={LogoPng} alt="Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-[#CF07C1]">Espaço das Divas</h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-[#CF07C1]' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              Produtos
            </Link>
            <Link 
              to="/carrinho" 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                location.pathname === '/carrinho' 
                  ? 'text-pink-600' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Carrinho</span>
              {cartItemsCount > 0 && (
                <span className="bg-pink-500 text-white rounded-full text-xs px-2 py-0.5 ml-1">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin" 
                  className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Cart Icon */}
          <div className="md:hidden">
            <Link to="/carrinho" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;