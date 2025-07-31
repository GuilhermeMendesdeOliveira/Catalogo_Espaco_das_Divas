import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Import da Logo
import LogoPng from '../assets/LogoPng.png';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular autenticação (substituir por API real)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      login(credentials.username);
      navigate('/admin');
    } else {
      setError('Usuário ou senha incorretos');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-pink-200 to-pink-300 p-3 rounded-lg inline-block mb-4">
              <img src={LogoPng} alt="Logo" className="h-12 w-auto" />
            </div>
            <h1 className="text-2xl font-light text-gray-800 mb-2">
              Área Administrativa
            </h1>
            <p className="text-gray-600">
              Faça login para acessar o painel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder="Digite seu usuário"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Credenciais de Demonstração:</h3>
            <p className="text-sm text-gray-600">Usuário: <code className="bg-white px-2 py-1 rounded">admin</code></p>
            <p className="text-sm text-gray-600">Senha: <code className="bg-white px-2 py-1 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;