# Developer Brief

Bu paket kalan sayfalar için component geliştirme kaynağıdır. Public landing/login/signup/public booking flow ayrı pakettedir.

Öncelik sırası:
1. Shared design tokens + shell components
2. Admin bookings calendar
3. Member account/dashboard/bookings/membership
4. Wallet + split payment
5. Admin dashboard/sessions/courts/members
6. Settings/roles/analytics/notifications
7. Kiosk + Liveboard TV

Backend bağlanırken her sayfa için önce mock data ile görsel parity sağlanmalı, sonra API bağlanmalıdır. Özellikle calendar ve split payment alanları gerçek veriyle uzun isim/çok kayıt testinden geçmelidir.
