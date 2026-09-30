import React from 'react';
import {
  MapPin,
  Ruler,
  Images,
  Maximize2,
  Phone,
  MessageSquare,
  Eye,
  Share2,
} from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onOpenDetail: (listing: Listing) => void;
  onShareFacebook: (listing: Listing) => void;
  onShareZalo: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenDetail,
  onShareFacebook,
  onShareZalo,
}) => {
  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [listing.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'];
  const primaryImg = images[0];

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-slate-200/80 flex flex-col justify-between group">
      <div>
        {/* Card Image Banner */}
        <div
          className="relative h-56 overflow-hidden bg-slate-900 cursor-pointer"
          onClick={() => onOpenDetail(listing)}
        >
          <img
            src={primaryImg}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Type Badge */}
          <span
            className={`absolute top-3 left-3 font-black text-xs px-3 py-1 rounded-full shadow-md ${
              listing.type === 'Bán'
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {listing.type}
          </span>

          {/* Province Badge */}
          <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
            <MapPin className="w-3 h-3 text-amber-400 mr-0.5" />
            <span>{listing.province}</span>
          </span>

          {/* Images Count Badge */}
          {images.length > 1 && (
            <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1">
              <Images className="w-3.5 h-3.5 text-amber-400 mr-1" />
              <span>{images.length} ảnh</span>
            </span>
          )}

          {/* View Details Hint */}
          <div className="absolute bottom-3 right-3 bg-slate-900/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs opacity-90 group-hover:bg-blue-600 transition flex items-center space-x-1">
            <Maximize2 className="w-3 h-3" />
            <span>Xem Chi Tiết</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <h4
            className="font-black text-slate-900 text-base line-clamp-2 cursor-pointer hover:text-blue-600 transition leading-snug"
            onClick={() => onOpenDetail(listing)}
            title={listing.title}
          >
            {listing.title}
          </h4>

          {/* Key Specs: Area & Price */}
          <div className="flex justify-between items-center text-xs font-bold py-2.5 border-y border-slate-100 gap-2">
            <span className="text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl flex items-center space-x-1">
              <Ruler className="w-3.5 h-3.5 text-blue-600 mr-1" />
              <span>{listing.area}</span>
            </span>
            <span className="text-red-600 text-xs sm:text-sm font-black text-right line-clamp-1">
              {listing.price}
            </span>
          </div>

          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="https://zalo.me/0946373066"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 rounded-xl text-xs text-center transition flex items-center justify-center space-x-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Zalo</span>
          </a>
          <a
            href="tel:0946373066"
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl text-xs text-center transition flex items-center justify-center space-x-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi Ngay</span>
          </a>
          <button
            onClick={() => onOpenDetail(listing)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs text-center transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Chi Tiết</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => onShareFacebook(listing)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-xl text-[11px] transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
            title="Chia sẻ lên Facebook"
          >
            <Share2 className="w-3 h-3" />
            <span>Chia sẻ Facebook</span>
          </button>
          <button
            onClick={() => onShareZalo(listing)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-1.5 rounded-xl text-[11px] transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
            title="Chia sẻ qua Zalo"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Chia sẻ Zalo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
