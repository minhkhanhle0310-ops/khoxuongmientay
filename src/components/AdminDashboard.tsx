import React, { useState, useRef } from 'react';
import {
  X,
  PlusCircle,
  PhoneCall,
  Trash2,
  Phone,
  Key,
  LogOut,
  Upload,
  Calculator,
  ListFilter,
  CheckCircle2,
  ExternalLink,
  Tag,
  Pencil,
  RotateCcw,
  Image as ImageIcon,
  Loader2,
  Star,
  Link as LinkIcon,
} from 'lucide-react';
import { Listing, CustomerLead, PROVINCES_13 } from '../types';
import { readVietnameseNumber } from '../utils/numberToWords';
import { compressImage } from '../utils/imageCompressor';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenChangePass: () => void;
  listings: Listing[];
  leads: CustomerLead[];
  onCreateListing: (newListing: Omit<Listing, 'id'>) => void;
  onUpdateListing: (id: number, updatedListing: Omit<Listing, 'id'>) => void;
  onDeleteListing: (id: number) => void;
  onDeleteLead: (id: number) => void;
  onViewListing: (listing: Listing) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  onOpenChangePass,
  listings,
  leads,
  onCreateListing,
  onUpdateListing,
  onDeleteListing,
  onDeleteLead,
  onViewListing,
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing state: null when creating new, or number ID when editing existing listing
  const [editingListingId, setEditingListingId] = useState<number | null>(null);

  // Deletion Confirmation States
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<CustomerLead | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [province, setProvince] = useState<string>(PROVINCES_13[0]);
  const [type, setType] = useState<'Cho Thuê' | 'Bán'>('Cho Thuê');
  const [areaText, setAreaText] = useState('');
  const [priceMode, setPriceMode] = useState<'month' | 'sqm'>('month');
  const [rawPriceInput, setRawPriceInput] = useState('');
  const [description, setDescription] = useState('');
  const [power, setPower] = useState('');
  const [pccc, setPccc] = useState('');
  const [road, setRoad] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Price formatting and words conversion
  const rawDigits = rawPriceInput.replace(/\D/g, '');
  const priceNum = rawDigits ? parseInt(rawDigits, 10) : 0;
  const areaDigits = parseInt(areaText.replace(/\D/g, ''), 10) || 0;

  let priceInWordsDisplay = '';
  if (priceNum > 0) {
    if (type === 'Bán') {
      priceInWordsDisplay = `=> ${priceNum.toLocaleString('vi-VN')} VNĐ (${readVietnameseNumber(priceNum)})`;
    } else {
      if (priceMode === 'sqm' && areaDigits > 0) {
        const totalRent = priceNum * areaDigits;
        priceInWordsDisplay = `Đơn giá: ${priceNum.toLocaleString('vi-VN')} đ/m² ➔ Tổng tiền: ${totalRent.toLocaleString('vi-VN')} VNĐ/tháng (${readVietnameseNumber(totalRent)})`;
      } else if (priceMode === 'sqm' && areaDigits === 0) {
        priceInWordsDisplay = `=> ${priceNum.toLocaleString('vi-VN')} đ/m² (Nhập diện tích sàn để tính tổng tiền thuê)`;
      } else {
        priceInWordsDisplay = `=> ${priceNum.toLocaleString('vi-VN')} VNĐ / tháng (${readVietnameseNumber(priceNum)})`;
      }
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setRawPriceInput('');
      return;
    }
    const num = parseInt(val, 10);
    setRawPriceInput(num.toLocaleString('vi-VN'));
  };

  // Image Upload with Canvas Compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (uploadedImages.length + files.length > 10) {
      setImageWarning('Tối đa chỉ được tải lên 10 hình ảnh cho mỗi kho xưởng!');
      setTimeout(() => setImageWarning(null), 4000);
    }

    const remainingSlots = 10 - uploadedImages.length;
    if (remainingSlots <= 0) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setIsCompressing(true);

    try {
      const compressedList: string[] = [];
      for (const file of filesToProcess) {
        try {
          const compressed = await compressImage(file, 1200, 900, 0.78);
          compressedList.push(compressed);
        } catch (err) {
          console.error('Lỗi khi nén ảnh:', err);
        }
      }
      setUploadedImages((prev) => [...prev, ...compressedList]);
    } finally {
      setIsCompressing(false);
      // Reset input value so user can upload more photos or re-select
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add Image via Direct URL
  const handleAddCustomImageUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    if (uploadedImages.length >= 10) {
      setImageWarning('Đã đạt giới hạn tối đa 10 hình ảnh!');
      setTimeout(() => setImageWarning(null), 4000);
      return;
    }
    setUploadedImages((prev) => [...prev, trimmed]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setUploadedImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  // Start Editing an existing Listing
  const handleStartEdit = (item: Listing) => {
    setEditingListingId(item.id);
    setTitle(item.title);
    setProvince(item.province);
    setType(item.type);
    setAreaText(item.area);
    setPriceMode(item.priceMode || 'month');

    // Extract price number
    let num = item.priceValue;
    if (!num) {
      const digits = item.price.replace(/\D/g, '');
      num = digits ? parseInt(digits, 10) : 0;
    }
    setRawPriceInput(num > 0 ? num.toLocaleString('vi-VN') : '');

    setDescription(item.description || '');
    setPower(item.power || '');
    setPccc(item.pccc || '');
    setRoad(item.road || '');

    const currentImgs =
      item.images && item.images.length > 0
        ? [...item.images]
        : item.image
        ? [item.image]
        : [];
    setUploadedImages(currentImgs);

    // Smooth scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingListingId(null);
    setTitle('');
    setProvince(PROVINCES_13[0]);
    setType('Cho Thuê');
    setAreaText('');
    setRawPriceInput('');
    setDescription('');
    setPower('');
    setPccc('');
    setRoad('');
    setUploadedImages([]);
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !areaText.trim() || !rawDigits) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc (*): Tiêu đề, Diện tích và Giá tiền!');
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setFormError(null);

    let finalPrice = '';
    if (type === 'Bán') {
      finalPrice = `${priceNum.toLocaleString('vi-VN')} VNĐ (${readVietnameseNumber(priceNum)})`;
    } else {
      if (priceMode === 'sqm' && areaDigits > 0) {
        const total = priceNum * areaDigits;
        finalPrice = `${total.toLocaleString('vi-VN')} VNĐ / tháng (${priceNum.toLocaleString('vi-VN')} đ/m²)`;
      } else {
        finalPrice = `${priceNum.toLocaleString('vi-VN')} VNĐ / tháng (${readVietnameseNumber(priceNum)})`;
      }
    }

    const imagesToUse =
      uploadedImages.length > 0
        ? uploadedImages
        : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'];

    const listingPayload = {
      title: title.trim(),
      province,
      type,
      area: areaText.includes('m') ? areaText.trim() : `${areaText.trim()} m²`,
      areaValue: areaDigits,
      price: finalPrice,
      priceValue: priceNum,
      priceMode,
      image: imagesToUse[0],
      images: imagesToUse,
      description: description.trim() || 'Kho xưởng đạt tiêu chuẩn công nghiệp, giao thông thuận tiện.',
      power: power.trim(),
      pccc: pccc.trim(),
      road: road.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (editingListingId !== null) {
      onUpdateListing(editingListingId, listingPayload);
    } else {
      onCreateListing(listingPayload);
    }

    handleCancelEdit();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 z-50 p-2 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden my-3 border border-slate-200">
        {/* Dashboard Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-xs">
                ADMIN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                QUẢN TRỊ KHO XƯỞNG MIỀN TÂY
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Xin chào Anh Khánh (<span className="text-amber-400 font-bold">0946.373.066</span>) - Chủ hệ thống
            </p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap justify-center">
            <button
              onClick={onOpenChangePass}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Đổi Mật Khẩu</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xem Website</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Section 1: Form Đăng Tin / Chỉnh Sửa Tin */}
          <div
            ref={formRef}
            className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 ${
              editingListingId !== null
                ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="flex items-center space-x-2">
                {editingListingId !== null ? (
                  <>
                    <Pencil className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-black text-slate-900">
                      Chỉnh Sửa Kho Xưởng #{editingListingId}
                    </h3>
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Đang sửa
                    </span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      Đăng BĐS Kho Xưởng Mới
                    </h3>
                  </>
                )}
              </div>

              {editingListingId !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Hủy chế độ sửa (Đăng tin mới)</span>
                </button>
              )}
            </div>

            {formError && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
                <span>⚠ {formError}</span>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="text-red-500 hover:text-red-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề tin đăng (*)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Kho xưởng 2.000m² KCN Long An"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tỉnh Thành (*)
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  {PROVINCES_13.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loại BĐS (*)
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'Cho Thuê' | 'Bán')}
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="Cho Thuê">Cho Thuê Kho Xưởng</option>
                  <option value="Bán">Bán Kho Xưởng / Đất</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diện tích sàn (m²) (*)
                </label>
                <input
                  type="text"
                  required
                  value={areaText}
                  onChange={(e) => setAreaText(e.target.value)}
                  placeholder="Ví dụ: 1.500 m²"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Price Calculation Box */}
              <div
                className={`sm:col-span-2 md:col-span-2 p-3.5 rounded-2xl border space-y-2.5 transition ${
                  type === 'Bán'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-blue-50/70 border-blue-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center">
                    {type === 'Bán' ? (
                      <>
                        <Tag className="w-4 h-4 text-amber-600 mr-1" />
                        <span>Giá Bán BĐS / Kho xưởng (*)</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 text-blue-600 mr-1" />
                        <span>Cách tính giá thuê (*)</span>
                      </>
                    )}
                  </label>

                  {type === 'Cho Thuê' && (
                    <div className="flex space-x-3 text-xs font-bold">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name="priceModeRadio"
                          checked={priceMode === 'month'}
                          onChange={() => setPriceMode('month')}
                        />
                        <span>Theo Tháng (Trọn gói)</span>
                      </label>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="radio"
                          name="priceModeRadio"
                          checked={priceMode === 'sqm'}
                          onChange={() => setPriceMode('sqm')}
                        />
                        <span>Theo Đồng / m² / tháng</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={rawPriceInput}
                      onChange={handlePriceChange}
                      placeholder={
                        type === 'Bán'
                          ? 'Nhập số tiền bán (VD: 32000000000)...'
                          : priceMode === 'sqm'
                          ? 'Nhập đơn giá m² (VD: 30000)...'
                          : 'Nhập giá thuê theo tháng (VD: 50000000)...'
                      }
                      className="w-full bg-white border border-slate-300 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                  </div>
                  <div className="flex items-center">
                    <p className="text-[11px] font-extrabold text-amber-800 leading-snug">
                      {priceInWordsDisplay}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra Specs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trạm Điện KVA
                </label>
                <input
                  type="text"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  placeholder="Ví dụ: 500 KVA"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hệ thống PCCC
                </label>
                <input
                  type="text"
                  value={pccc}
                  onChange={(e) => setPccc(e.target.value)}
                  placeholder="Ví dụ: PCCC Tự Động Sprinkler"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường xe tải / container
                </label>
                <input
                  type="text"
                  value={road}
                  onChange={(e) => setRoad(e.target.value)}
                  placeholder="Ví dụ: Container 40 feet ra vào 24/7"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Multi-Image Upload & Optimization Section */}
              <div className="sm:col-span-2 md:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Album hình ảnh kho xưởng (Tối đa 10 ảnh - Tự động nén tối ưu)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Chọn nhiều ảnh cùng lúc từ máy tính/điện thoại hoặc dán link ảnh trực tiếp bên dưới.
                    </p>
                  </div>
                  <span className="text-[11px] font-black bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    {uploadedImages.length}/10 ảnh
                  </span>
                </div>

                {imageWarning && (
                  <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between">
                    <span>⚠ {imageWarning}</span>
                    <button
                      type="button"
                      onClick={() => setImageWarning(null)}
                      className="text-amber-700 hover:text-amber-900 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Upload File Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isCompressing || uploadedImages.length >= 10}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl p-1 bg-slate-50"
                    />
                  </div>

                  {/* Add Image URL Option */}
                  <div className="flex items-center gap-1.5 sm:w-80">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="Dán link ảnh (https://...)..."
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomImageUrl();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomImageUrl}
                      disabled={!customImageUrl.trim() || uploadedImages.length >= 10}
                      className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer flex items-center space-x-1"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  </div>
                </div>

                {/* Loading Compression Feedback */}
                {isCompressing && (
                  <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang nén và tối ưu hóa bộ ảnh, vui lòng chờ trong giây lát...</span>
                  </div>
                )}

                {/* Image Previews Grid with Cover Image selector */}
                {uploadedImages.length > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[11px] font-bold text-slate-600">
                        Danh sách ảnh đã tải ({uploadedImages.length} ảnh) — Ảnh đầu tiên là <span className="text-amber-600 font-extrabold">Ảnh Đại Diện</span>:
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadedImages([])}
                        className="text-[11px] text-red-600 hover:underline font-bold"
                      >
                        Xóa tất cả ảnh
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group h-24 rounded-2xl overflow-hidden border-2 shadow-xs bg-slate-900 transition ${
                            idx === 0
                              ? 'border-amber-500 ring-2 ring-amber-400/40'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80';
                            }}
                          />

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm cursor-pointer z-10 transition transform group-hover:scale-110"
                            title="Xóa ảnh này"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          {/* Make Primary Cover Photo Button */}
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white rounded-lg p-1 text-[10px] shadow-sm cursor-pointer z-10 transition opacity-0 group-hover:opacity-100 flex items-center space-x-1"
                              title="Đặt làm ảnh đại diện"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          )}

                          {/* Badge Index / Cover Badge */}
                          <span
                            className={`absolute bottom-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs ${
                              idx === 0
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-900/80 text-white'
                            }`}
                          >
                            {idx === 0 ? '★ Ảnh Chính' : `#${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2 md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả thông tin kho xưởng chi tiết
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Đường xe container, trạm điện KVA, PCCC tự động, mặt tiền quốc lộ, nền sàn chịu lực..."
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="sm:col-span-2 md:col-span-3 flex justify-end gap-2 pt-2 border-t border-slate-200">
                {editingListingId !== null && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isCompressing}
                  className={`font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer active:scale-95 text-white ${
                    editingListingId !== null
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-600/30'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                  }`}
                >
                  {editingListingId !== null ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span className="text-slate-950 font-black">
                        Lưu Cập Nhật Kho Xưởng #{editingListingId}
                      </span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Đăng Tin Kho Xưởng Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Bảng Danh Sách Khách Hàng Gửi SĐT (Real-time leads) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center">
                <PhoneCall className="w-5 h-5 text-emerald-600 mr-2" />
                <span>Danh Sách Khách Hàng Gửi SĐT (Thời gian thực)</span>
              </h3>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                {leads.length} khách
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-200 text-slate-800 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-3">Thời gian ghi nhận</th>
                    <th className="p-3">Tên Khách Hàng</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 font-medium">
                        Chưa có khách hàng nào gửi số điện thoại. Khi khách đăng ký trên web, thông tin sẽ hiển thị ở đây ngay lập tức.
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l.id} className="border-b border-slate-200 hover:bg-slate-100 transition">
                        <td className="p-3 font-medium text-slate-600">{l.time}</td>
                        <td className="p-3 font-extrabold text-slate-900">{l.name}</td>
                        <td className="p-3 font-black text-blue-600 text-sm">
                          <a href={`tel:${l.phone}`} className="hover:underline">
                            {l.phone}
                          </a>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <a
                            href={`tel:${l.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 shadow-xs"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Gọi</span>
                          </a>
                          <button
                            onClick={() => setLeadToDelete(l)}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                            title="Xóa thông tin khách hàng này"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Bảng Quản Lý Bài Đăng BĐS Kho Xưởng */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center">
                <ListFilter className="w-5 h-5 text-blue-600 mr-2" />
                <span>Quản Lý Bài Đăng BĐS Kho Xưởng</span>
              </h3>
              <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg">
                {listings.length} bài đăng
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-200 text-slate-800 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-3">Ảnh</th>
                    <th className="p-3">Tiêu đề tin</th>
                    <th className="p-3">Tỉnh Thành</th>
                    <th className="p-3">Loại</th>
                    <th className="p-3">Giá</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-slate-400">
                        Chưa có tin đăng kho xưởng nào trong danh sách.
                      </td>
                    </tr>
                  ) : (
                    listings.map((item) => {
                      const isCurrentlyEditing = editingListingId === item.id;
                      const thumb =
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : item.image ||
                            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80';
                      const countPhotos = item.images ? item.images.length : item.image ? 1 : 0;

                      return (
                        <tr
                          key={item.id}
                          className={`border-b transition ${
                            isCurrentlyEditing
                              ? 'bg-amber-100/70 border-amber-300 font-semibold'
                              : 'border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <td className="p-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                              <img
                                src={thumb}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80';
                                }}
                              />
                              {countPhotos > 1 && (
                                <span className="absolute bottom-0 right-0 bg-slate-950/80 text-white text-[8px] px-1 rounded-tl font-bold">
                                  {countPhotos}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-semibold max-w-xs truncate" title={item.title}>
                            <div className="flex items-center space-x-1.5">
                              {isCurrentlyEditing && (
                                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                                  Đang sửa
                                </span>
                              )}
                              <span className="truncate">{item.title}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium whitespace-nowrap">{item.province}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                item.type === 'Bán'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-red-600 truncate max-w-xs">
                            {item.price}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {/* Nút Sửa Bài Đăng */}
                            <button
                              onClick={() => handleStartEdit(item)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1 transition ${
                                isCurrentlyEditing
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                              }`}
                              title="Chỉnh sửa thông tin bài đăng này"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>

                            {/* Nút Xem Chi Tiết */}
                            <button
                              onClick={() => onViewListing(item)}
                              className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                              title="Xem chi tiết giao diện khách hàng"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Xem</span>
                            </button>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => setListingToDelete(item)}
                              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer inline-flex items-center space-x-1"
                              title="Xóa bài đăng này"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Xóa</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xác Nhận Xóa Bài Đăng Kho Xưởng */}
      {listingToDelete && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setListingToDelete(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
            <button
              onClick={() => setListingToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Xác Nhận Xóa Bài Đăng?
              </h3>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
                <p className="font-extrabold text-slate-900 line-clamp-2">
                  {listingToDelete.title}
                </p>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  <span>Mã: #{listingToDelete.id}</span>
                  <span className="font-bold text-slate-700">{listingToDelete.province}</span>
                  <span className="font-bold text-red-600">{listingToDelete.type}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anh Khánh có chắc chắn muốn xóa tin này không? Tin đăng sẽ bị xóa hoàn toàn khỏi hệ thống và website ngay lập tức.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setListingToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = listingToDelete.id;
                  if (editingListingId === id) {
                    handleCancelEdit();
                  }
                  onDeleteListing(id);
                  setListingToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black py-3 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Vĩnh Viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Số Điện Thoại Khách Hàng */}
      {leadToDelete && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLeadToDelete(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative my-auto">
            <button
              onClick={() => setLeadToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Xóa Số Điện Thoại Khách?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Xác nhận xóa liên hệ của <span className="font-extrabold text-slate-900">{leadToDelete.name}</span> (<span className="font-bold text-blue-600">{leadToDelete.phone}</span>)?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLead(leadToDelete.id);
                  setLeadToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
