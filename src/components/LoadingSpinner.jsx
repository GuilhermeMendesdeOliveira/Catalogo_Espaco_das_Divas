import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;