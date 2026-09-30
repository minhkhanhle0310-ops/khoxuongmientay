export function readVietnameseNumber(num: number): string {
  if (isNaN(num) || num <= 0) return '';
  if (num >= 1_000_000_000) {
    const ty = num / 1_000_000_000;
    const formattedTy = Number.isInteger(ty) ? ty.toString() : ty.toFixed(2).replace('.', ',');
    return `${formattedTy} Tỷ đồng`;
  } else if (num >= 1_000_000) {
    const trieu = num / 1_000_000;
    const formattedTrieu = Number.isInteger(trieu) ? trieu.toString() : trieu.toFixed(2).replace('.', ',');
    return `${formattedTrieu} Triệu đồng`;
  } else if (num >= 1_000) {
    const nghin = num / 1_000;
    const formattedNghin = Number.isInteger(nghin) ? nghin.toString() : nghin.toFixed(2).replace('.', ',');
    return `${formattedNghin} Nghìn đồng`;
  }
  return `${num.toLocaleString('vi-VN')} đồng`;
}

export function formatVND(num: number): string {
  return num.toLocaleString('vi-VN');
}
