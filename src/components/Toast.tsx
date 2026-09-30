import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold z-50 flex items-center space-x-2 border border-slate-700 backdrop-blur-md animate-fade-in pointer-events-none">
      <span>{message}</span>
    </div>
  );
};
