import React from 'react';

import { useEffect, useState } from 'react';

const LoadingSpinner = ({
  title = 'Processando...',
  messages = [],
  interval = 10000,
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!messages.length) return;

    const timer = setInterval(() => {
      setCurrentMessage((prev) =>
        prev === messages.length - 1 ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5 bg-white px-8 py-7 rounded-2xl shadow-xl max-w-sm text-center">
        
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-pink-200" />
          <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
        </div>

        {/* Título */}
        <h3 className="text-base font-semibold text-gray-800">
          {title}
        </h3>

        {/* Mensagem rotativa */}
        {messages.length > 0 && (
          <p
            key={currentMessage}
            className="text-sm text-gray-600 transition-opacity duration-500"
          >
            {messages[currentMessage]}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
