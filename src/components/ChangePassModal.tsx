import React, { useState } from 'react';
import { X, Key, Eye, EyeOff } from 'lucide-react';

interface ChangePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewPass: (newPass: string) => void;
}

export const ChangePassModal: React.FC<ChangePassModalProps> = ({
  isOpen,
  onClose,
  onSaveNewPass,
}) => {
  const [newPass, setNewPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.trim().length < 4) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 4 ký tự!');
      return;
    }
    onSaveNewPass(newPass.trim());
    setNewPass('');
    setErrorMsg('');
    onClose();
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

        <div className="text-center mb-3">
          <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-2xl mx-auto flex items-center justify-center text-lg mb-2 shadow-xs">
            <Key className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Đổi Mật Khẩu Admin
          </h3>
          <p className="text-[11px] text-slate-500">
            Nhập mật khẩu mới bên dưới và ghi nhớ kỹ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu mới (*)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                placeholder="Nhập mật khẩu mới..."
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
            Lưu Mật Khẩu Mới
          </button>
        </form>
      </div>
    </div>
  );
};
