import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  adminPass: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  adminPass,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPass) {
      setErrorMsg('');
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg('Mật khẩu quản trị không chính xác! (Mặc định: admin123)');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="bg-slate-900 text-amber-400 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-2 shadow-xs">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Đăng Nhập Quản Trị</h3>
          <p className="text-[11px] text-slate-500">
            Dành riêng cho Anh Khánh (Chủ hệ thống)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu quản trị (*)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                placeholder="Nhập mật khẩu..."
                className="w-full bg-slate-50 pl-3 pr-9 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-600 font-bold mt-1.5 leading-snug">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
          >
            Đăng Nhập Quản Trị
          </button>
        </form>
      </div>
    </div>
  );
};
