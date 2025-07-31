import React from 'react';
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateSubtotal = (item) => {
    return item.preco * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = "*🛍️ Pedido - Espaço das Divas*\n\n";
    message += "*Produtos:*\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.nome}\n`;
      message += `   • Código: ${item.codigo}\n`;
      message += `   • Quantidade: ${item.quantity}\n`;
      message += `   • Valor unitário: ${formatPrice(item.preco)}\n`;
      message += `   • Subtotal: ${formatPrice(calculateSubtotal(item))}\n\n`;
    });
    
    message += `*Total do Pedido: ${formatPrice(calculateTotal())}*\n\n`;
    message += "Gostaria de finalizar este pedido! 😊";
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    if (cartItems.length === 0) {
      alert('Carrinho vazio!');
      return;
    }
    
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-6">
            Explore nossos produtos e adicione os que mais gostar!
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            <span>Ver Produtos</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          Carrinho de Compras
        </h1>
        <p className="text-gray-600">
          Revise seus produtos antes de finalizar o pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-8 w-8 text-pink-300" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800 mb-1">
                            {item.nome}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Código: {item.codigo}
                          </p>
                          <div className="text-lg font-semibold text-pink-600">
                            {formatPrice(item.preco)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-lg font-semibold text-gray-800">
                          {formatPrice(calculateSubtotal(item))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Resumo do Pedido
            </h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.nome} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(calculateSubtotal(item))}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-pink-600">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Enviar Pedido</span>
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-gray-600 hover:text-red-600 py-2 text-sm font-medium transition-colors"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;