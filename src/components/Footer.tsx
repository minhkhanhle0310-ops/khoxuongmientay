import React from 'react';
import { Warehouse, Phone, MessageSquare, MapPin } from 'lucide-react';
import { PROVINCES_13 } from '../types';

interface FooterProps {
  onSelectProvince: (prov: string) => void;
  onOpenLeadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectProvince,
  onOpenLeadModal,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-auto border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
                <Warehouse className="w-5 h-5" />
              </div>
              <span className="font-black text-base uppercase">
                KHO XƯỞNG MIỀN TÂY
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kênh kết nối thông tin mua bán và cho thuê nhà xưởng sản xuất, kho trung chuyển logistics, đất công nghiệp SKC tại 13 tỉnh thành Đồng bằng Sông Cửu Long.
            </p>
            <div className="space-y-1.5 text-slate-300 font-medium">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Hotline / Zalo:{' '}
                  <a href="tel:0946373066" className="text-amber-400 font-bold hover:underline">
                    0946.373.066
                  </a>{' '}
                  (Anh Khánh)
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Địa bàn hoạt động: TP. Cần Thơ & 12 Tỉnh Tây Nam Bộ</span>
              </p>
            </div>
          </div>

          {/* Quick links for provinces */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider">
              Kho Xưởng Theo Tỉnh Thành
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {PROVINCES_13.map((prov) => (
                <button
                  key={prov}
                  onClick={() => {
                    onSelectProvince(prov);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="text-left text-slate-400 hover:text-amber-400 transition py-1 text-xs cursor-pointer flex items-center space-x-1"
                >
                  <span>•</span>
                  <span>Kho xưởng {prov}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Services & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider">
              Dịch Vụ & Hỗ Trợ Doanh Nghiệp
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>✔ Tìm kiếm kho xưởng theo yêu cầu diện tích từ 500m² - 50.000m²</li>
              <li>✔ Thẩm định pháp lý đất SKC, chủ quyền hoàn công kho xưởng</li>
              <li>✔ Hỗ trợ trạm biến áp KVA, nghiệm thu hệ thống PCCC</li>
              <li>✔ Kết nối giao thương & logistics vận chuyển đường bộ, đường thủy</li>
            </ul>
            <button
              onClick={onOpenLeadModal}
              className="mt-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Đăng Ký Tư Vấn Ngay</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="text-center text-slate-500 space-y-1">
          <p className="text-white font-extrabold text-sm uppercase">
            KHO XƯỞNG MIỀN TÂY - KHÁNH (0946.373.066)
          </p>
          <p>© 2026 Kho Xưởng Miền Tây. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
