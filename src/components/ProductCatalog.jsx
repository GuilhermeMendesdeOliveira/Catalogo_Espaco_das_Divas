import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import LoadingSpinner from './LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const productsPerPage = 50;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:54863/produto/findAllByProdutiPai');
      if (!response.ok) throw new Error('Erro ao carregar produtos');

      const data = await response.json();
      const ativos = data.produtos.filter((produto) => produto.ativo === true);
      setProducts(ativos);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    const filtered = products
      .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));
    setFilteredProducts(filtered);
    setCurrentPage(1); // resetar página ao pesquisar
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-medium">Erro ao carregar produtos</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">Nossos Produtos</h1>
        <p className="text-gray-600">Descubra nossa seleção de cosméticos premium</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar produto pelo nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-pink-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProductCatalog;
