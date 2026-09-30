import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  return (
    <aside aria-label="Kênh liên hệ nhanh" className="fixed bottom-5 right-5 z-40 flex flex-col space-y-3">
      {/* Zalo Floating Button */}
      <a
        href="https://zalo.me/0946373066"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo Anh Khánh 0946.373.066"
        className="relative group flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-pulse-ring pointer-events-none" />
        <MessageSquare className="w-6 h-6 relative z-10" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none border border-slate-700">
          Zalo: 0946.373.066
        </span>
      </a>

      {/* Phone Floating Button */}
      <a
        href="tel:0946373066"
        aria-label="Gọi điện thoại trực tiếp cho Anh Khánh 0946.373.066"
        className="flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition group relative active:scale-95"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none border border-slate-700">
          Gọi Khánh: 0946.373.066
        </span>
      </a>
    </aside>
  );
};
