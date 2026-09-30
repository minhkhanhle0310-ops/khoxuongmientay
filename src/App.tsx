import React, { useState, useEffect, useMemo } from 'react';
import { Boxes, Warehouse, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProvinceTabs } from './components/ProvinceTabs';
import { LeadBanner } from './components/LeadBanner';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { LeadModal } from './components/LeadModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ChangePassModal } from './components/ChangePassModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingContact } from './components/FloatingContact';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Listing, CustomerLead } from './types';
import { SAMPLE_LISTINGS } from './data/initialData';

export default function App() {
  // Persistence State
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('kx_listings');
      return saved ? JSON.parse(saved) : SAMPLE_LISTINGS;
    } catch {
      return SAMPLE_LISTINGS;
    }
  });

  const [leads, setLeads] = useState<CustomerLead[]>(() => {
    try {
      const saved = localStorage.getItem('kx_leads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminPass, setAdminPass] = useState<string>(() => {
    try {
      return localStorage.getItem('kx_admin_pass') || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Modals
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [activeDetailListing, setActiveDetailListing] = useState<Listing | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kx_listings', JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('kx_leads', JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('kx_admin_pass', adminPass);
    } catch (e) {
      console.error('Failed to save admin password to localStorage', e);
    }
  }, [adminPass]);

  // Keyboard Shortcuts (Esc to close, Ctrl+Shift+A for Admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLeadModalOpen(false);
        setIsAdminLoginModalOpen(false);
        setIsChangePassModalOpen(false);
        setActiveDetailListing(null);
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Save Lead Function
  const handleSaveLead = (phone: string, name?: string) => {
    const now = new Date();
    const timeString = now.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const newLead: CustomerLead = {
      id: Date.now(),
      time: timeString,
      name: name || 'Khách hàng gửi yêu cầu',
      phone,
    };

    setLeads((prev) => [newLead, ...prev]);
    showToast('Gửi thông tin thành công! Đang chuyển tiếp sang Zalo Anh Khánh...');
    window.open('https://zalo.me/0946373066', '_blank');
  };

  // Create Listing
  const handleCreateListing = (newListingData: Omit<Listing, 'id'>) => {
    const newListing: Listing = {
      ...newListingData,
      id: Date.now(),
    };
    setListings((prev) => [newListing, ...prev]);
    showToast('Đăng bài thành công với bộ ảnh kho xưởng mới!');
  };

  // Update Listing
  const handleUpdateListing = (id: number, updatedListingData: Omit<Listing, 'id'>) => {
    const updatedItem: Listing = {
      ...updatedListingData,
      id,
    };
    setListings((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
    if (activeDetailListing?.id === id) {
      setActiveDetailListing(updatedItem);
    }
    showToast(`Đã cập nhật bài đăng kho xưởng #${id} thành công!`);
  };

  // Delete Listing
  const handleDeleteListing = (id: number) => {
    setListings((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('kx_listings', JSON.stringify(updated));
      } catch (e) {
        console.error('Lỗi khi lưu danh sách sau khi xóa:', e);
      }
      return updated;
    });
    if (activeDetailListing?.id === id) {
      setActiveDetailListing(null);
    }
    showToast('Đã xóa tin đăng thành công!');
  };

  // Delete Lead
  const handleDeleteLead = (id: number) => {
    setLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem('kx_leads', JSON.stringify(updated));
      } catch (e) {
        console.error('Lỗi khi lưu danh sách leads sau khi xóa:', e);
      }
      return updated;
    });
    showToast('Đã xóa thông tin khách hàng thành công!');
  };

  // Social Sharing
  const handleShareFacebook = (item: Listing) => {
    const currentUrl = window.location.href.split('#')[0];
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}&quote=${encodeURIComponent(
      `${item.title} - Giá: ${item.price} - LH Anh Khánh: 0946.373.066`
    )}`;
    window.open(shareUrl, '_blank', 'width=650,height=480');
  };

  const handleShareZalo = (item: Listing) => {
    const currentUrl = window.location.href.split('#')[0];
    const shareText = `🔗 ${item.title}\n💰 Giá: ${item.price}\n📍 Tỉnh: ${item.province}\n📞 Liên hệ chính chủ Anh Khánh: 0946.373.066\n🌐 Chi tiết: ${currentUrl}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Đã sao chép nội dung tin đăng! Dán (Paste) vào Zalo để gửi cho đối tác.');
      });
    }
    window.open(`https://zalo.me/share?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Filtered Listings
  const filteredListings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return listings.filter((item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q);

      const matchProv = !selectedProvince || item.province === selectedProvince;
      const matchType = !selectedType || item.type === selectedType;

      return matchQuery && matchProv && matchType;
    });
  }, [listings, searchQuery, selectedProvince, selectedType]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      <div>
        {/* Navigation Header */}
        <Header
          onOpenLeadModal={() => setIsLeadModalOpen(true)}
          onOpenAdminModal={() => {
            if (isAdminLoggedIn) {
              setIsAdminDashboardOpen(true);
            } else {
              setIsAdminLoginModalOpen(true);
            }
          }}
          isAdminLoggedIn={isAdminLoggedIn}
        />

        {/* Hero Section */}
        <HeroBanner
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProvince={selectedProvince}
          onProvinceChange={setSelectedProvince}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {/* Province Filter Tabs */}
        <ProvinceTabs
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
        />

        {/* Lead Capture Banner */}
        <LeadBanner onSubmitLead={handleSaveLead} />

        {/* Main Listings */}
        <main className="max-w-7xl mx-auto px-4 my-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center">
                <Boxes className="w-6 h-6 text-amber-500 mr-2.5" />
                <span>Danh Mục Kho Xưởng Đang Đăng</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Cập nhật liên tục kho xưởng chính chủ tại các tỉnh Miền Tây (ĐBSCL)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedProvince && (
                <button
                  onClick={() => setSelectedProvince('')}
                  className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg hover:bg-amber-200 transition cursor-pointer"
                >
                  ✕ Xóa lọc: {selectedProvince}
                </button>
              )}
              <span className="text-xs font-bold bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl shadow-xs">
                {filteredListings.length} kho xưởng
              </span>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center text-slate-500 shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <Warehouse className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-base text-slate-800">
                Chưa có kho xưởng nào phù hợp với bộ lọc hiện tại.
              </p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Liên hệ ngay anh Khánh (0946.373.066) để được tìm kiếm kho theo diện tích yêu cầu!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProvince('');
                    setSelectedType('');
                  }}
                  className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  Xem tất cả kho xưởng
                </button>
                <a
                  href="https://zalo.me/0946373066"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition"
                >
                  Chat Zalo Anh Khánh
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onOpenDetail={(item) => setActiveDetailListing(item)}
                  onShareFacebook={handleShareFacebook}
                  onShareZalo={handleShareZalo}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Buttons */}
      <FloatingContact />

      {/* Footer */}
      <Footer
        onSelectProvince={(prov) => setSelectedProvince(prov)}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
      />

      {/* Modals */}
      <ListingDetailModal
        listing={activeDetailListing}
        onClose={() => setActiveDetailListing(null)}
        onShareFacebook={handleShareFacebook}
        onShareZalo={handleShareZalo}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSubmit={handleSaveLead}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        adminPass={adminPass}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminLoginModalOpen(false);
          setIsAdminDashboardOpen(true);
          showToast('Đăng nhập quản trị thành công!');
        }}
      />

      <ChangePassModal
        isOpen={isChangePassModalOpen}
        onClose={() => setIsChangePassModalOpen(false)}
        onSaveNewPass={(newP) => {
          setAdminPass(newP);
          showToast('Đã lưu mật khẩu mới thành công! Hãy ghi nhớ mật khẩu này.');
        }}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setIsAdminDashboardOpen(false);
          showToast('Đã đăng xuất khỏi tài khoản Admin.');
        }}
        onOpenChangePass={() => setIsChangePassModalOpen(true)}
        listings={listings}
        leads={leads}
        onCreateListing={handleCreateListing}
        onUpdateListing={handleUpdateListing}
        onDeleteListing={handleDeleteListing}
        onDeleteLead={handleDeleteLead}
        onViewListing={(item) => {
          setIsAdminDashboardOpen(false);
          setActiveDetailListing(item);
        }}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
