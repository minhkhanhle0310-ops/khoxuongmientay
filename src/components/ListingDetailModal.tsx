import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Ruler,
  Zap,
  Flame,
  Truck,
  Phone,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { Listing } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onShareFacebook: (listing: Listing) => void;
  onShareZalo: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onShareFacebook,
  onShareZalo,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [listing]);

  if (!listing) return null;

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'];

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          title="Thoát xem chi tiết (Esc)"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-white flex items-center space-x-1.5 transition transform hover:scale-105 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="text-xs">Thoát</span>
        </button>

        <div className="space-y-4">
          {/* Main Photo Banner */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
            <img
              src={currentImage}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <span
              className={`absolute top-3 left-3 font-black text-xs px-3 py-1.5 rounded-xl shadow ${
                listing.type === 'Bán'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {listing.type}
            </span>
            <span className="absolute top-3 right-3 bg-slate-900/90 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{listing.province}</span>
            </span>
          </div>

          {/* Thumbnails Gallery */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {images.map((url, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      isActive
                        ? 'border-amber-500 scale-95 ring-2 ring-amber-400/50'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Title & Tag */}
          <div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Mã Kho Xưởng #{listing.id}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2 leading-snug">
              {listing.title}
            </h3>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                Diện tích sàn
              </span>
              <span className="font-black text-slate-800 text-sm flex items-center space-x-1">
                <Ruler className="w-4 h-4 text-blue-600 mr-1" />
                <span>{listing.area}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                Mức giá
              </span>
              <span className="font-black text-red-600 text-sm">{listing.price}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                Tỉnh / Thành
              </span>
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500 mr-0.5" />
                <span>{listing.province}</span>
              </span>
            </div>
            {listing.power && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                  Trạm Điện
                </span>
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" />
                  <span>{listing.power}</span>
                </span>
              </div>
            )}
            {listing.pccc && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                  PCCC
                </span>
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-red-500 mr-1" />
                  <span>{listing.pccc}</span>
                </span>
              </div>
            )}
            {listing.road && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-extrabold pb-0.5">
                  Đường Giao Thông
                </span>
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  <span>{listing.road}</span>
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Mô tả thông tin kho xưởng chi tiết:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Quick Direct Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href="https://zalo.me/0946373066"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs text-center transition shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Zalo Anh Khánh (0946.373.066)</span>
            </a>
            <a
              href="tel:0946373066"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs text-center transition shadow-lg flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Xem Kho Trực Tiếp (0946.373.066)</span>
            </a>
          </div>

          {/* Share Section */}
          <div className="bg-slate-100 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 flex items-center">
              <Share2 className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              <span>Chia sẻ tin này lên mạng xã hội:</span>
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => onShareFacebook(listing)}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => onShareZalo(listing)}
                className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Zalo</span>
              </button>
            </div>
          </div>

          {/* Bottom Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 font-bold py-2.5 rounded-xl text-xs text-center transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Đóng Cửa Sổ Xem Kho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
