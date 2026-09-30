import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

interface ChangePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewPass: (newPass: string, currentPass?: string) => Promise<{ success: boolean; message: string }>;
}

export const ChangePassModal: React.FC<ChangePassModalProps> = ({
  isOpen,
  onClose,
  onSaveNewPass,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.trim().length < 4) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 4 ký tự!');
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg('Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await onSaveNewPass(newPass.trim(), currentPass.trim() || undefined);
      if (res.success) {
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setErrorMsg('');
        onClose();
      } else {
        setErrorMsg(res.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại!');
      }
    } catch {
      setErrorMsg('Có lỗi xảy ra khi đồng bộ mật khẩu. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="bg-amber-100 text-amber-700 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-lg mb-2 shadow-xs">
            <Key className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-0.5">
            Đổi Mật Khẩu Quản Trị
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Mật khẩu mới sẽ được <strong className="text-amber-600">đồng bộ trên tất cả thiết bị</strong> ngay sau khi lưu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPass}
                onChange={(e) => {
                  setCurrentPass(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full bg-slate-50 pl-3 pr-9 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu mới (*)
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Tối thiểu 4 ký tự..."
                className="w-full bg-slate-50 pl-3 pr-9 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Xác nhận mật khẩu mới (*)
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Nhập lại mật khẩu mới..."
              className="w-full bg-slate-50 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-600 font-bold mt-1.5 leading-snug">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu và đồng bộ...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lưu & Đồng Bộ Mật Khẩu</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
