# Pickle Pulse — Agent Rules

Bu dosya, bu projede çalışan tüm AI agent'ların uyması gereken kurallardır.
Plan detayları: `docs/MASTER_PLAN.md`

---

## Ürün Kimliği

- **Ürün adı:** Pickle Pulse
- **Alan:** Pickleball / Padel tesis yönetimi (B2B SaaS)
- **Hedef müşteri:** Tesis işletmecileri (kulüp sahibi/yöneticisi)
- **Son kullanıcı:** Oyuncular (guest + member), staff, admin
- **Dil:** İngilizce (UI), Türkçe (internal docs)

---

## Tasarım Kuralları

### Renk & Atmosfer
- **"Sunset Court" paleti**: Sıcak coral-orange (#F04F2A) + cream (#FFF8F1) + charcoal (#1A1614)
- Public sayfalar: Açık/sıcak tema (cream arka plan, beyaz kartlar, warm shadow)
- Admin + Liveboard: Koyu tema (#0B1512 arka plan)
- ASLA soğuk mavi, gri veya steril beyaz kullanma
- ASLA generic placeholder renk kullanma — her renk CSS custom property'den gelmeli

### Component Kuralları
- Tüm component'lar `src/components/ui/` altındaki temel parçaları kullanmalı
- Inline Tailwind renkleri yerine CSS custom property'leri (`var(--brand)`, `var(--surface)`, vb.) kullan
- Her component'ta `className` prop'u dışarıdan override'a açık olmalı (`cx()` veya `cn()` ile merge)
- Hardcoded string (session ID, booking ID, kulüp adı) YASAK — her zaman prop veya mock-data'dan al

### Tipografi
- Heading: `font-family: var(--font-heading)` (Sora)
- Body: `font-family: var(--font-sans-ui)` (Manrope)
- Mono: `font-family: var(--font-mono)` (IBM Plex Mono)
- Hero title: 48-72px, tracking-[-0.08em], font-weight 760
- Section title: 32-40px, tracking-[-0.07em]
- Body: 14-16px, leading-7

### Spacing
- 8px grid sistemi: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Card padding: 24px (mobile) / 32px (desktop)
- Section gap: 48px (mobile) / 64px (desktop)
- Border radius: 12px (buttons) / 16px (cards) / 28px (panels)

---

## Kod Kuralları

### Genel
- TypeScript strict mode — `any` YASAK
- Her component'a açıklayıcı TypeScript interface/type tanımla
- Dosya isimleri: kebab-case (`session-card.tsx`, `stat-card.tsx`)
- Import sırası: React/Next → external → internal → relative → types
- `"use client"` sadece gerektiğinde (state, hooks, event handlers)

### Dosya Yapısı
- UI primitives: `src/components/ui/`
- Domain components: `src/components/{domain}/` (booking, admin, liveboard, membership)
- Layout: `src/components/layout/`
- Sayfalar: `src/app/`
- Veri: `src/lib/`
- Tipler: `src/lib/types.ts`

### Mock Data Geçişi
- Şu an tüm veri `src/lib/mock-data.ts`'den geliyor
- Yeni component'lar mock-data'yı prop olarak almalı (doğrudan import etmemeli)
- Supabase entegrasyonu gelince, veri page.tsx'de fetch edilip component'a prop olarak geçilecek

---

## Korunacak Parçalar — DOKUNMA

Bu dosyalar iyi çalışıyor. Değiştirme veya çok dikkatli değiştir:

1. `src/app/liveboard/tv/[sessionSlug]/page.tsx` — TV liveboard (en olgun sayfa)
2. `src/components/liveboard/*` — 7 liveboard component'ı
3. `src/lib/liveboard/source.ts` — Hybrid data source
4. `src/lib/liveboard/mock-snapshot.ts`
5. `src/lib/liveboard/types.ts`
6. `src/lib/liveboard/event-presets.ts`
7. `src/lib/liveboard/actions.ts`
8. `supabase/final_schema.sql` — Veritabanı şeması
9. `src/lib/supabase/*` — Supabase client/server

---

## Sprint Sırası

1. **Sprint 0**: Tasarım sistemi — UI component library (Button, Input, Card, Badge, Modal, Tabs, Avatar, StatCard)
2. **Sprint 1**: Public yüzey yeniden tasarımı — Landing, Sessions, Booking flow, Header, Footer
3. **Sprint 2**: Auth + Hesap — Login, Register, Account, Membership sayfaları
4. **Sprint 3**: Admin paneli — Dashboard, Sessions, Courts, Queue, Members, Payments
5. **Sprint 4**: Üyelik & Sadakat sistemi
6. **Sprint 5**: Supabase + Stripe gerçek entegrasyonu
7. **Sprint 6**: Realtime + Liveboard polish

Her sprint bittiğinde `npm run build` ile build kontrolü yap.

---

## Branding Düzeltmeleri (Hemen)

- "Padel booking and court operations" → "Pickleball booking & court ops"
- "PadelOS Demo Club" → kaldır veya "Pickle Pulse" yap
- Hardcoded session ID'leri (`friday-open-play`) → dinamik yap
- Hardcoded booking ID'leri (`bkg-1002`) → dinamik yap
