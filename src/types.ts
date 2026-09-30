export interface Listing {
  id: number;
  title: string;
  province: string;
  type: 'Cho Thuê' | 'Bán';
  area: string;
  areaValue?: number;
  price: string;
  priceValue?: number;
  priceMode?: 'month' | 'sqm';
  image: string;
  images: string[];
  description: string;
  power?: string;
  pccc?: string;
  road?: string;
  createdAt?: string;
}

export interface CustomerLead {
  id: number;
  time: string;
  name: string;
  phone: string;
  note?: string;
}

export const PROVINCES_13 = [
  'Cần Thơ',
  'Long An',
  'Tiền Giang',
  'Bến Tre',
  'Đồng Tháp',
  'Vĩnh Long',
  'An Giang',
  'Kiên Giang',
  'Hậu Giang',
  'Sóc Trăng',
  'Bạc Liêu',
  'Cà Mau',
  'Trà Vinh'
] as const;

export type Province = typeof PROVINCES_13[number];
