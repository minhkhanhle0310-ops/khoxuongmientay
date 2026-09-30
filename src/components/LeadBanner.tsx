import React, { useState } from 'react';
import { Send, PhoneCall } from 'lucide-react';

interface LeadBannerProps {
  onSubmitLead: (phone: string, name?: string) => void;
}

export const LeadBanner: React.FC<LeadBannerProps> = ({ onSubmitLead }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }
    setError('');
    onSubmitLead(phone.trim(), 'Khách đăng ký từ Banner trang chủ');
    setPhone('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6 sm:mt-8">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center lg:text-left relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Tư Vấn Miễn Phí 24/7</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Cần Tìm Kho Xưởng Theo Diện Tích Yêu Cầu?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Hãy để lại Số Điện Thoại, anh Khánh sẽ gọi điện tư vấn trực tiếp và gửi album thông tin kho phù hợp qua Zalo ngay!
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2.5 relative z-10"
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập Số điện thoại của Anh/Chị..."
              className="bg-white/10 border border-white/25 px-4 py-3 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 w-full lg:w-80 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm whitespace-nowrap transition shadow-lg flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Cho Khánh</span>
            </button>
          </form>
          {error && (
            <p className="text-xs text-amber-300 font-bold mt-1.5 text-center sm:text-left">
              ⚠ {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
