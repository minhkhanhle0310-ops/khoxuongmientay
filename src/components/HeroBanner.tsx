import React from 'react';
import { Search, ShieldCheck, Warehouse, MapPin, Filter } from 'lucide-react';
import { PROVINCES_13 } from '../types';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProvince: string;
  onProvinceChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedProvince,
  onProvinceChange,
  selectedType,
  onTypeChange,
}) => {
  return (
    <section className="hero-gradient text-white py-12 sm:py-16 md:py-20 px-4 text-center relative overflow-hidden">
      {/* Background overlay warehouse texture */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2.5 bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-amber-500/40 shadow-sm leading-relaxed backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Tư Vấn & Kết Nối Kho Xưởng 13 Tỉnh ĐBSCL</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight py-1">
          CHUYÊN MUA BÁN & CHO THUÊ <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-100 pb-1 inline-block drop-shadow-sm">
            KHO XƯỞNG MIỀN TÂY
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-200 text-xs sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
          Hỗ trợ tìm kho xưởng sản xuất, kho chứa hàng, đất công nghiệp phù hợp diện tích & ngân sách tại 13 Tỉnh Miền Tây. Liên hệ chính chủ anh Khánh:{' '}
          <a
            href="tel:0946373066"
            className="text-amber-400 font-extrabold hover:text-amber-300 underline decoration-amber-400/50 underline-offset-4 transition"
          >
            0946.373.066
          </a>
        </p>

        {/* Search & Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-800 text-left border border-slate-100/20">
          {/* Keyword Search */}
          <div className="flex items-center bg-slate-50 px-3.5 py-3 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên kho, diện tích..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Province Filter */}
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full bg-slate-50 px-3.5 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none font-medium border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer appearance-none pr-8"
            >
              <option value="">-- Tất cả 13 Tỉnh Thành --</option>
              {PROVINCES_13.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full bg-slate-50 px-3.5 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none font-medium border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition cursor-pointer appearance-none pr-8"
            >
              <option value="">-- Cho Thuê & Bán --</option>
              <option value="Cho Thuê">Cho Thuê Kho Xưởng</option>
              <option value="Bán">Bán Kho Xưởng / Đất</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
