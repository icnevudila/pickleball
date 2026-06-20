# Pickle Pulse — Master Plan

> Pickleball/padel tesis işletmelerine satılacak B2B SaaS.
> Oyuncular online kort ayırtır, gelince check-in yapar, admin kort atar, TV'de canlı takip.
> Üyelik + sadakat sistemiyle tekrar gelişi sağlar.

---

## 1. Ürün Tanımı

**Pickle Pulse**, tek bir pickleball/padel tesisi için hepsi bir arada işletim sistemi:

- **Oyuncu** → Online seans rezervasyonu + ödeme + check-in
- **Üye** → İndirimli fiyat + öncelikli booking + sadakat puanı
- **Staff** → Walk-in girişi + kuyruk yönetimi + kort ataması + oyun timer
- **Admin** → Seans/kort yönetimi + üyelik planları + gelir raporu + ayarlar
- **TV** → Bekleme salonunda canlı kort durumu, sıra, zamanlayıcı

Tesis işletmecisi aylık abonelik ($49-149) + işlem komisyonu (%1-2) öder.

---

## 2. 4 Yüzey Mimarisi

### Yüzey 1 — Public (Oyuncu)
Rota: `/`, `/sessions`, `/sessions/[id]`, `/checkout`, `/login`, `/register`

| Sayfa | İşlev |
|-------|-------|
| Landing | Hero + "Kort Ayırt" CTA + bugünkü seanslar + kulüp bilgisi |
| Seanslar | Tarih şeridi → Bento Grid slot kartları (saat + doluluk + fiyat) |
| Seans Detay | Seans özeti → kişi sayısı seç → bilgi gir → checkout'a git |
| Checkout | Stripe ödeme + özet → onay |
| Giriş / Kayıt | Üye girişi + yeni üye kaydı |

### Yüzey 2 — Member (Hesap)
Rota: `/account`, `/account/bookings`, `/account/membership`

| Sayfa | İşlev |
|-------|-------|
| Profil | Avatar, isim, seviye rozeti, istatistikler |
| Rezervasyonlarım | Geçmiş/gelecek, iptal seçeneği |
| Üyelik | Mevcut plan, yükseltme, kredi/puan bakiyesi |

### Yüzey 3 — Admin / Staff
Rota: `/admin/*`

| Sayfa | İşlev |
|-------|-------|
| Dashboard | Bento grid: doluluk %, gelir, aktif kortlar, kuyruk özeti |
| Seanslar | CRUD: seans oluştur, düzenle, fiyat/kapasite ayarla |
| Kortlar | Görsel grid, durum değiştir, bakım planla |
| Kuyruk | Check-in, sıra yönet, kort ata, oyun başlat/bitir |
| Üyeler | Üye listesi, plan atama, arama |
| Ödemeler | Günlük/haftalık gelir raporu |
| Ayarlar | Kulüp bilgisi, çalışma saatleri, personel |

### Yüzey 4 — TV Liveboard
Rota: `/liveboard/tv/[sessionSlug]`

Koyu tema, büyük tipografi, tam ekran. Mevcut liveboard iyi çalışıyor — korunacak ve geliştirilecek.

---

## 3. Tasarım Sistemi — "Sunset Court"

### Renk Paleti
```
--background:     #FFF8F1   (warm cream)
--foreground:     #1A1614   (near-black)
--surface:        #FFFFFF   (white cards)
--surface-soft:   #FFF4EC   (warm tint)
--surface-muted:  #FFF9F4   (barely warm)
--line:           #F0D6CA   (warm border)
--line-strong:    #DFBEB0   (strong border)
--brand:          #F04F2A   (vibrant coral-orange)
--brand-deep:     #B83A22   (deep coral)
--brand-soft:     #FFE2D8   (light coral bg)
--accent-lime:    #C8FF4D   (neon lime — badges)
--accent-amber:   #F5A623   (amber — warnings)
--green:          #1F9D55   (success)
--red:            #C0392B   (danger)
--muted:          #7D6D66   (warm gray text)
```

### Dark Theme (Admin + Liveboard)
```
--dark-bg:        #0B1512   (deep dark green-black)
--dark-surface:   #141E1A   (elevated surface)
--dark-border:    #1E2D27   (subtle border)
--dark-text:      #E8E0D8   (warm white)
--dark-muted:     #6B7E74   (muted text)
```

### Tipografi
- **Heading:** Sora (variable weight, tight tracking)
- **Body:** Manrope (clean, readable)
- **Mono:** IBM Plex Mono (stats, codes)

### Spacing
8px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Component Library (Sprint 0'da oluşturulacak)
- `Button` — primary, secondary, ghost, danger, sizes (sm, md, lg)
- `Input` — label, error, icon, disabled
- `Card` — surface, warm, elevated
- `Badge` — status renkleri (live, open, full, maintenance)
- `Modal` — overlay + card + close
- `Tabs` — underline style
- `Avatar` — image + initials fallback
- `StatCard` — sayı + etiket + ikon + trend
- `EmptyState` — ikon + mesaj + CTA

---

## 4. Teknoloji Kararları

| Alan | Seçim | Not |
|------|-------|-----|
| Framework | Next.js 16 App Router | Mevcut, SSR + API routes |
| UI | Tailwind CSS v4 + CSS custom props | Mevcut, tutarlılaştırılacak |
| State | React state (local) + Zustand (global) | Basit, yeterli |
| DB | Supabase PostgreSQL | Mevcut şema hazır |
| Auth | Supabase Auth | Mevcut iskelet |
| Payment | Stripe Checkout | Mevcut iskelet |
| Realtime | Supabase Realtime | Liveboard için |
| Deploy | Vercel | Mevcut config |
| Fonts | Sora + Manrope + IBM Plex Mono | Mevcut |

---

## 5. Sprint Planı

### Sprint 0 — Tasarım Temeli
- [ ] `src/components/ui/` altında Button, Input, Card, Badge, Modal, Tabs, Avatar, StatCard oluştur
- [ ] `globals.css` genişlet: dark theme vars, animation keyframes, yeni utility classes
- [ ] Her component TSX + TypeScript prop'ları

### Sprint 1 — Public Yüzey Redesign
- [ ] Landing page yeniden yaz (hero + CTA + seans kartları + kulüp bilgisi)
- [ ] Session listing yeniden yaz (tarih şeridi + Bento Grid)
- [ ] Session detail yeniden yaz (adım adım booking wizard)
- [ ] SiteHeader yeniden yaz (logo + nav + "Kort Ayırt" CTA)
- [ ] PublicFooter yeniden yaz (kulüp bilgisi + linkler)
- [ ] Mobil responsive: tüm public sayfalar

### Sprint 2 — Auth + Hesap
- [ ] Login sayfası yeniden yaz (sıcak tasarım + Supabase auth)
- [ ] Register sayfası yeniden yaz (üyelik faydaları + onboarding)
- [ ] Account profil sayfası yeniden yaz
- [ ] Account bookings sayfası yeniden yaz
- [ ] Membership sayfası oluştur (yeni)
- [ ] Supabase Auth tam bağlantı + middleware

### Sprint 3 — Admin Paneli
- [ ] Admin dashboard yeniden yaz (bento grid stat kartları)
- [ ] Admin sessions CRUD
- [ ] Admin courts yönetimi
- [ ] Admin queue/check-in operasyonları
- [ ] Admin members sayfası
- [ ] Admin payments raporu
- [ ] Admin settings sayfası

### Sprint 4 — Üyelik & Sadakat
- [ ] Üyelik planı yönetimi (admin tarafı)
- [ ] Üyelik katmanları UI (public tarafı)
- [ ] Kredi paketi satışı
- [ ] Sadakat puanı izleme
- [ ] Referans bonusu

### Sprint 5 — Backend Entegrasyonu
- [ ] Supabase Auth → tüm sayfalara bağla
- [ ] CRUD: Sessions, Bookings, Courts, Queue
- [ ] Stripe gerçek ödeme akışı
- [ ] RLS politikaları
- [ ] Middleware route koruması

### Sprint 6 — Liveboard + Realtime
- [ ] Mevcut liveboard'u koru ve parlatma
- [ ] Supabase Realtime bağlantısı
- [ ] Admin aksiyon → TV yansıması
- [ ] Sesli bildirim sistemi (mevcut, geliştirilecek)

---

## 6. Mevcut Koddan Korunacaklar

Bu parçalar iyi çalışıyor, **dokunma veya dikkatli güncelle:**

1. `src/app/liveboard/tv/[sessionSlug]/page.tsx` — TV liveboard (367 satır, en olgun sayfa)
2. `src/components/liveboard/*` — 7 liveboard component'ı (cue engine, ticker, alert center, court card, countdown timer, player chip, live clock)
3. `src/lib/liveboard/source.ts` — Hybrid data source (Supabase + mock fallback)
4. `src/lib/types.ts` — TypeScript type tanımları
5. `src/lib/mock-data.ts` — Mock veri yapısı (geçiş sürecinde kullanılmaya devam edecek)
6. `supabase/final_schema.sql` — Veritabanı şeması (production-grade)
7. `src/lib/supabase/*` — Supabase client/server setup
8. `src/lib/stripe.ts` — Stripe client setup

---

## 7. Bilinen Buglar (Düzeltilecek)

1. SiteHeader'da "Padel booking and court operations" yazıyor → "Pickleball" olmalı
2. StatusBadge'de "cyan" tone aslında orange sınıfları kullanıyor
3. Session detail sayfasında hardcoded booking ID (`bkg-1002`)
4. Admin sidebar'da hardcoded session ID (`friday-open-play`)
5. Admin courts sayfasında inline hardcoded data (mock-data kullanılmalı)
6. TV liveboard'da hardcoded skor ("11 - 8")
7. Footer'da "PadelOS Demo Club" yazıyor → branding tutarsızlığı

---

## 8. Dosya Yapısı (Hedef)

```
src/
├── app/
│   ├── (public)/          # Oyuncu sayfaları
│   │   ├── page.tsx       # Landing
│   │   ├── sessions/      # Seans listesi + detay
│   │   ├── checkout/      # Ödeme
│   │   ├── login/         # Giriş
│   │   └── register/      # Kayıt
│   ├── (account)/         # Üye hesabı
│   │   ├── account/       # Profil
│   │   ├── bookings/      # Rezervasyonlarım
│   │   └── membership/    # Üyelik
│   ├── admin/             # Yönetim paneli
│   │   ├── page.tsx       # Dashboard
│   │   ├── sessions/      # Seans yönetimi
│   │   ├── courts/        # Kort yönetimi
│   │   ├── queue/         # Kuyruk operasyonları
│   │   ├── members/       # Üye yönetimi
│   │   ├── payments/      # Ödeme raporu
│   │   └── settings/      # Ayarlar
│   ├── liveboard/         # TV ekranı
│   └── api/               # API rotaları
├── components/
│   ├── ui/                # Temel UI component'ları
│   ├── booking/           # Booking domain component'ları
│   ├── admin/             # Admin domain component'ları
│   ├── liveboard/         # Liveboard component'ları (mevcut, korunacak)
│   ├── membership/        # Üyelik component'ları
│   └── layout/            # Header, Footer, Sidebar
├── lib/
│   ├── supabase/          # Supabase client/server
│   ├── liveboard/         # Liveboard data source
│   ├── types.ts           # TypeScript types
│   ├── mock-data.ts       # Mock veriler
│   ├── utils.ts           # Utility fonksiyonları
│   └── stripe.ts          # Stripe client
└── stores/                # Zustand stores (gerekirse)
```
