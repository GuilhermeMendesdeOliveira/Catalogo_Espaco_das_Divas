import React, { useState, useEffect } from 'react';
import { Package, Edit3, ToggleLeft, ToggleRight, Upload, ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { stripHtmlTags } from '../utils/regexHtml';
import ElegantModal from './ElegantModal';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [selectedProductForToggle, setSelectedProductForToggle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const productsPerPage = 150;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://aw8kco8ck8k4c8s4ckcg440g.217.15.170.97.sslip.io/produto/findAllByProdutiPai');
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      const data = await response.json();
      setProducts(Array.isArray(data.produtos) ? data.produtos : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const atualizarProdutosAPI = async () => {
    try {
      toast.info('Iniciando atualização dos produtos...');
      const response = await fetch('http://aw8kco8ck8k4c8s4ckcg440g.217.15.170.97.sslip.io/produto/getProdutosAPI');
      if (!response.ok) throw new Error('Erro ao atualizar os produtos.');
      toast.success('Atualização iniciada com sucesso!');
      fetchProducts();
    } catch (err) {
      toast.error('Erro ao atualizar produtos: ' + err.message);
    }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('imagem', file);
    try {
      setUploadingImage(productId);
      const response = await fetch(`http://aw8kco8ck8k4c8s4ckcg440g.217.15.170.97.sslip.io/produto/updateFoto/${productId}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        toast.success('Imagem enviada com sucesso!');
        fetchProducts();
      } else {
        throw new Error('Erro ao fazer upload da imagem');
      }
    } catch (err) {
      toast.error('Erro ao fazer upload da imagem: ' + err.message);
    } finally {
      setUploadingImage(null);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const response = await fetch(`http://aw8kco8ck8k4c8s4ckcg440g.217.15.170.97.sslip.io/produto/changeAtivo/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        setProducts(products.map(p => p.id === productId ? { ...p, ativo: !currentStatus } : p));
        toast.success('Status atualizado com sucesso!');
      } else throw new Error('Erro ao atualizar status');
    } catch (err) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const precoTotalEstoque = products.reduce((acc, p) => acc + (p.preco * (p.estoque || 0)), 0);
  const totalProdutos = products.length;
  const totalAtivos = products.filter(p => p.ativo).length;
  const totalInativos = totalProdutos - totalAtivos;

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'todos' ||
        (filterStatus === 'ativos' && p.ativo) ||
        (filterStatus === 'inativos' && !p.ativo);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome)); // ← Ordenação alfabética aqui

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie os produtos da loja</p>
        </div>
        <button
          onClick={() => setModalUpdateOpen(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 transition"
        >
          <RefreshCcw className="h-4 w-4" /> Atualizar Produtos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Preço Total do Estoque</h4>
          <p className="text-xl font-semibold text-pink-600">{formatPrice(precoTotalEstoque)}</p>
        </div>
        <div className="bg-white border p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Qtd. Produtos no Banco</h4>
          <p className="text-xl font-semibold">{totalProdutos}</p>
        </div>
        <div className="bg-white border p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Produtos Ativos</h4>
          <p className="text-xl font-semibold text-green-600">{totalAtivos}</p>
        </div>
        <div className="bg-white border p-4 rounded-lg">
          <h4 className="text-sm text-gray-500">Produtos Inativos</h4>
          <p className="text-xl font-semibold text-red-600">{totalInativos}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          className="px-4 py-2 border rounded-lg w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
        >
          <option value="todos">Todos</option>
          <option value="ativos">Apenas Ativos</option>
          <option value="inativos">Apenas Inativos</option>
        </select>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Produto</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Código</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Preço</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Estoque</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProducts.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${!product.ativo ? 'opacity-60' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {product.img_url ? (
                        <img
                          src={`http://tkg8ksk8ckw0swss0gco0008.217.15.170.97.sslip.io/uploads/${product.img_url}`}
                          alt={product.nome}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <Package className="h-12 w-12 text-pink-300 group-hover:scale-110 transition-transform" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">{product.nome}</h3>
                        {product.descricao_curta && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {stripHtmlTags(product.descricao_curta)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-mono text-gray-600">
                    {product.codigo}
                  </td>
                  <td className="py-4 px-6 font-medium text-pink-600">
                    {formatPrice(product.preco)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-sm ${product.estoque === 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {product.estoque === 0 ? 'Sem estoque' : `${product.estoque} unidades`}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => {
                        setSelectedProductForToggle(product);
                        setModalOpen(true);
                      }}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${product.ativo
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                    >
                      {product.ativo ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      <span>{product.ativo ? 'Ativo' : 'Inativo'}</span>
                    </button>

                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {/* Image Upload */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageUpload(product.id, file);
                            }
                          }}
                        />
                        <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                          {uploadingImage === product.id ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Foto</span>
                        </div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmação de ativação/inativação */}
      <ElegantModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProductForToggle(null);
        }}
        title="Alterar status do produto"
      >
        <p className="text-gray-700 mb-4">
          Tem certeza que deseja {selectedProductForToggle?.ativo ? 'desativar' : 'ativar'} o produto <strong>{selectedProductForToggle?.nome}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              toggleProductStatus(selectedProductForToggle.id, selectedProductForToggle.ativo);
              setModalOpen(false);
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Confirmar
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </ElegantModal>

      {/* Modal de atualização */}
      <ElegantModal
        isOpen={modalUpdateOpen}
        onClose={() => setModalUpdateOpen(false)}
        title="Atualizar produtos"
      >
        <p className="text-gray-700 mb-4">
          Essa atualização pode levar cerca de <strong>5 minutos</strong>. Deseja continuar?
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              atualizarProdutosAPI();
              setModalUpdateOpen(false);
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Confirmar
          </button>
          <button
            onClick={() => setModalUpdateOpen(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </ElegantModal>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
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
    </div>
  );
};

export default AdminPanel;
