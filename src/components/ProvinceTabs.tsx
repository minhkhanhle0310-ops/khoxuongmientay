import React from 'react';
import { PROVINCES_13 } from '../types';

interface ProvinceTabsProps {
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
}

export const ProvinceTabs: React.FC<ProvinceTabsProps> = ({
  selectedProvince,
  onSelectProvince,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 shadow-xs py-3 sticky top-[61px] z-30 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto custom-scrollbar">
        <div className="flex items-center space-x-2 whitespace-nowrap py-1">
          <button
            onClick={() => onSelectProvince('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              selectedProvince === ''
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tất cả (13 Tỉnh)
          </button>
          {PROVINCES_13.map((prov) => {
            const isActive = selectedProvince === prov;
            return (
              <button
                key={prov}
                onClick={() => onSelectProvince(prov)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {prov}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
