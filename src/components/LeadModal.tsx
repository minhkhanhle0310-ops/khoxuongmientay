import React, { useState } from 'react';
import { X, Warehouse, Send } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string, name?: string) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }
    setError('');
    onSubmit(phone.trim(), name.trim() || 'Khách đăng ký từ Popup');
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg p-2 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="bg-amber-100 text-amber-600 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl shadow-xs">
            <Warehouse className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Đăng Ký Tư Vấn Xem Kho
          </h3>
          <p className="text-xs text-slate-500">
            Nhập SĐT của bạn, Anh Khánh sẽ gửi thông tin chi tiết qua Zalo ngay!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ & Tên khách hàng
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Anh Minh / Chị Linh"
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số điện thoại (*)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ví dụ: 0912.xxx.xxx"
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {error && (
              <p className="text-xs text-red-600 font-bold mt-1.5">
                ⚠ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg transition flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Gửi Yêu Cầu & Kết Nối Zalo</span>
          </button>
        </form>
      </div>
    </div>
  );
};
