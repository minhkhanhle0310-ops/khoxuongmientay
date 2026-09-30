import React from 'react';
import { Warehouse, Send, Lock, Phone, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenLeadModal: () => void;
  onOpenAdminModal: () => void;
  isAdminLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLeadModal,
  onOpenAdminModal,
  isAdminLoggedIn,
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-xl backdrop-blur-md bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 p-2.5 rounded-2xl font-black text-xl shadow-lg group-hover:scale-105 transition transform duration-200">
            <Warehouse className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white uppercase flex items-center gap-2">
              KHO XƯỞNG MIỀN TÂY
            </h1>
            <p className="text-xs text-amber-400 font-semibold tracking-wide">
              Chủ Web: Khánh (<span className="text-amber-300 font-bold">0946.373.066</span>)
            </p>
          </div>
        </a>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenLeadModal}
            className="hidden md:flex bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs items-center space-x-2 transition shadow-md hover:shadow-amber-500/20 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đăng Ký Tìm Kho</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdminModal}
            className={`font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-md border ${
              isAdminLoggedIn
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            }`}
            title={isAdminLoggedIn ? "Mở Bảng Quản Trị Admin" : "Đăng Nhập Quản Trị"}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? "Trang Quản Trị" : "Admin"}</span>
          </button>

          {/* Call button on mobile */}
          <a
            href="tel:0946373066"
            className="md:hidden bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center transition shadow-md"
            title="Gọi ngay 0946.373.066"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Zalo button */}
          <a
            href="https://zalo.me/0946373066"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-md hover:shadow-blue-600/30 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zalo Khánh</span>
            <span className="sm:hidden">Zalo</span>
          </a>
        </div>
      </div>
    </header>
  );
};
