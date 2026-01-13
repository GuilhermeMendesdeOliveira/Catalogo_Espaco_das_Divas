import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from './LoadingSpinner';
import { stripHtmlTags } from '../utils/regexHtml';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../api/endpoints'

const ProductModal = ({ product, onClose }) => {
  const [variations, setVariations] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchVariations();
  }, [product.id]);

  const fetchVariations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.produtos.findAllVariacoes}${product.id}`);
      console.log(response, "RESPONSE VARIAÇÕES")

      if (response.ok) {
        const data = await response.json();
        const filtered = data.produtos.filter(variation => variation.ativo);
        setVariations(filtered);
        setQuantities(
          filtered.reduce((acc, variation) => {
            acc[variation.id] = 1;
            return acc;
          }, {})
        );
      }
    } catch (err) {
      console.error('Erro ao buscar variações:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = (item, quantity) => {
    addToCart({
      id: item.id,
      nome: item.nome,
      codigo: item.codigo,
      preco: item.preco,
      quantidade: quantity,
      variacao: item.id !== product.id
    });

    toast.success('Produto adicionado ao carrinho!');
    // onClose();
  };

  const handleQuantityChangeVariation = (variationId, delta) => {
    setQuantities(prev => {
      const newQty = (prev[variationId] || 1) + delta;
      if (newQty >= 1) {
        return { ...prev, [variationId]: newQty };
      }
      return prev;
    });
  };

  const handleQuantityChangeProduct = (delta) => {
    const newQty = productQuantity + delta;
    if (newQty >= 1) {
      setProductQuantity(newQty);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-800">Detalhes do Produto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="p-6">
            {/* Produto Pai */}
            <div className="mb-6 border rounded-lg p-4">
              <div className="mb-2">
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded">
                  {product.codigo}
                </span>
              </div>
              <h3 className="text-2xl font-medium text-gray-800 mb-3">{product.nome}</h3>
              {product.descricao_curta && (
                <p className="text-gray-600 mb-4">{stripHtmlTags(product.descricao_curta)}</p>
              )}
              <div className="text-3xl font-semibold text-pink-600 mb-2">
                {formatPrice(product.preco)}
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`h-3 w-3 rounded-full ${product.estoque === 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className={`text-sm ${product.estoque === 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {product.estoque === 0 ? 'Sem estoque' : `${product.estoque} em estoque`}
                </span>
              </div>

              {/* Se não tiver variações, exibe seletor quantidade e botão adicionar */}
              {variations.length === 0 && (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      onClick={() => handleQuantityChangeProduct(-1)}
                      disabled={productQuantity <= 1}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-medium min-w-[3rem] text-center">{productQuantity}</span>
                    <button
                      onClick={() => handleQuantityChangeProduct(1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-500">Máximo: {product.estoque}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product, productQuantity)}
                    className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </>
              )}
            </div>

            {/* Variações */}
            {variations.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Variações</h4>
                <div className="space-y-4">
                  {variations.map((variation) => {
                    const qty = quantities[variation.id] || 1;

                    return (
                      <div key={variation.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-sm">{variation.nome}</h3>
                          <p className="text-pink-600 font-semibold">{formatPrice(variation.preco)}</p>
                          <p className="text-sm text-gray-500">Estoque: {variation.estoque}</p>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center mb-2">
                            <button
                              onClick={() => handleQuantityChangeVariation(variation.id, -1)}
                              disabled={qty <= 1}
                              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-8 text-center">{qty}</span>
                            <button
                              onClick={() => handleQuantityChangeVariation(variation.id, 1)}
                              disabled={qty >= variation.estoque}
                              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(variation, qty)}
                            className="text-black border-2 border-gray-200 hover:bg-pink-400 transition-colors px-4 py-2 rounded text-sm flex items-center"
                          >
                            <ShoppingCart className="inline-block mr-1 h-4 w-4" />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
