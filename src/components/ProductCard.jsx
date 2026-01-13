import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { stripHtmlTags } from '../utils/regexHtml';
import { API_ENDPOINTS } from '../api/endpoints';

const ProductCard = ({ product, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const isOutOfStock = product.estoque === 0;
  const hasVariations = product.temVariacoes;

  // console.log(product, "Produto Card");

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer group"
    >
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
        {product.img_url ? (
          <img
            src={`${API_ENDPOINTS.produtos.visualizarFoto}${product.img_url}`}
            alt={product.nome}
            className="w-auto h-auto object-cover rounded"
          />
        ) : (
          <Package className="h-12 w-12 text-pink-300 group-hover:scale-110 transition-transform" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2 space-x-2">
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
            {product.codigo}
          </span>
          {isOutOfStock && (
            <span className="bg-[#CF07C1] text-white px-2 py-1 rounded text-xs font-medium">
              Sem Estoque
            </span>
          )}
        </div>

        <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.nome}
        </h3>

        {product.descricao_curta && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {stripHtmlTags(product.descricao_curta)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-pink-600">
              {formatPrice(product.preco)}
            </span>
            <div className="flex items-center space-x-1 mt-1">
              {isOutOfStock ? (
                <AlertCircle className="h-3 w-3 text-red-500" />
              ) : (
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              )}
              <span className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Sem estoque' : `${product.estoque} em estoque`}
              </span>
              {hasVariations && (
                <span className=" bg-pink-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Variações
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;