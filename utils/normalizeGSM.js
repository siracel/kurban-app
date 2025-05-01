export default function normalizeGSM(raw) {
    if (!raw) return null;
  
    // 1️⃣ Yalnızca rakamları al
    let digits = String(raw).replace(/\D/g, '');
  
    // 2️⃣ Başındaki tek +90 / 90 / 0 varyasyonlarını düzenle
    if (digits.startsWith('90')) {
      // Zaten 90 ile başlıyor → aynen bırak
    } else if (digits.startsWith('0')) {
      // 0’ı düşür, 90 ekle
      digits = '90' + digits.slice(1);
    } else if (digits.length === 10) {
      // 538… → başına 90 ekle
      digits = '90' + digits;
    } else {
      // Beklenmeyen durum → uzunsa sondan 10 haneyi al, 90 ekle
      digits = '90' + digits.slice(-10);
    }
  
    // Son kontrol → 12 hane olmalı
    return digits.length === 12 ? digits : null;
  }