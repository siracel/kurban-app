# Kurban Takip / Otomasyon Sistemi

Kurumların kurban organizasyonunu yönettiği bir web uygulaması: projeler (yıllar),
kurbanlar, hisse grupları, hissedarlar, kesim süreç adımları ve hissedarlara
SMS bilgilendirme. Hissedarlar, SMS ile gelen herkese açık bir sayfadan kurbanlarının
durumunu canlı takip edebilir.

## Teknolojiler
- **Frontend:** React (CRA), Redux Toolkit + redux-persist, Tailwind CSS, @dnd-kit
- **Backend:** Node.js + Express (ESM), Mongoose
- **Veritabanı:** MongoDB (Atlas)
- **Dosya depolama:** AWS S3 (kurban fotoğrafı)
- **SMS:** Harici SMS sağlayıcı API'leri (kurum bazlı tanımlı)

## Yapı / Bölümler

### 1. Kurum Paneli — `/kurum`
Kurumun kendi organizasyonunu yönettiği ana panel:
- **Projeler** — her yıl/dönem bir proje. Aktif proje belirgin; proje adı düzenlenebilir.
- **Hissedarlar** — kurum geneli hissedar rehberi (arama, alfabetik, telefon standardı `0XXX XXX XX XX`). Aynı isim+telefon mükerrer eklenmez.
- **Hisse Grupları** — projeye özel fiyat/hisse grupları.
- **İşlem Adımları** — kesim süreç adımları (KAYIT → KESİLDİ → ...), kuruma özel, sıralanabilir.
- **Mesaj Şablonları** — SMS metin şablonları.
- **Dashboard (proje içi)** — kurbanlar listesi: sürükle-bırak sıralama, durum değiştirme, hissedar ekleme (modal), SMS gönderme (önizlemeli), kurban bilgi sayfası linki.
- **Ayarlar** — hesap bilgileri, WhatsApp ve SMS API ayarları.

### 2. Admin Paneli — `/admin`
Platform yöneticisi seviyesi:
- Sistemdeki tüm kurumları listeler; bir kuruma tıklayınca o kurumun paneline yeni sekmede geçer (impersonation).
- Kurum **onaylama** (onaysız kurum giriş yapamaz).
- SMS API tanımları yönetimi.

### 3. Herkese Açık Sayfalar
- **`/`** — sade "KURBAN TAKİP" karşılama sayfası (Kurum Giriş / Kayıt butonları).
- **`/kurban-info/:kod`** — hissedara SMS ile giden, mobil öncelikli kurban takip sayfası (durum, süreç adımları, hissedarlar, foto/video embed).

## Kurulum

```bash
# Backend bağımlılıkları
npm install

# Frontend bağımlılıkları
cd client && npm install --legacy-peer-deps
```

`config/config.env` dosyası oluşturun:

```env
PORT=5001
JWT_SECRET=kurbanapp            # middleware ile aynı olmalı (zorunlu)
CLIENT_URL_LOCAL=http://localhost:3000
SERVER_URL_LOCAL=http://localhost:5001
# Production:
CLIENT_URL_PROD=https://kurban.hayathaber.com
# Fotoğraf yükleme için (S3):
AWS_S3_ACCESS_KEY_ID=...
AWS_S3_SECRET_ACCESS_KEY=...
```

> **Önemli:** `JWT_SECRET`, `middleware/kurum.js` ve `middleware/admin.js` içindeki
> doğrulama anahtarıyla aynı olmalıdır (`kurbanapp`), aksi halde korumalı istekler 401 verir.

## Çalıştırma

İki ayrı terminalde:

```bash
# Backend (port 5001)
npm start

# Frontend (port 3000)
cd client && npm start
```

- Kurum girişi: `http://localhost:3000/kurum/login`
- Admin girişi: `http://localhost:3000/admin/login`

## Notlar
- Veritabanı bağlantısı `config/db.js` içindedir.
- Kurban videoları **embed** (YouTube/Rumble/Vidyome) olarak eklenir; doğrudan dosya yükleme yoktur. Fotoğraf yükleme S3 ile yapılır.
- Production ortam değişkenleri (JWT_SECRET, CLIENT_URL_PROD, AWS_S3_*) sunucuda tanımlı olmalıdır.

## İletişim
muhammetakkuss34@gmail.com
