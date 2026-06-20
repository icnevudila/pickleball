# Deployment and Operations Plan

## Environments

Use three environments:

```txt
development
staging
production
```

## Environment Variables

Frontend:

```txt
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SOCKET_URL
NEXT_PUBLIC_APP_NAME
```

Backend:

```txt
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
STORAGE_PROVIDER
STORAGE_BUCKET
PAYMENT_PROVIDER
PAYMENT_SECRET_KEY
PAYMENT_WEBHOOK_SECRET
SOCKET_CORS_ORIGIN
```

## Deployment Architecture

Recommended MVP:

```txt
Frontend: Vercel
Backend: Railway / Render / VPS
Database: Managed PostgreSQL
Storage: S3-compatible storage
Realtime: Socket.IO on backend
```

## Deployment Checklist

### Before Deployment

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Admin user seeded
- [ ] Club seeded
- [ ] Courts seeded if needed
- [ ] CORS configured
- [ ] Payment webhook URL configured if payment enabled
- [ ] Storage configured
- [ ] TV route tested

### After Deployment

- [ ] Login works
- [ ] Session creation works
- [ ] Booking works
- [ ] Payment status works
- [ ] Check-in works
- [ ] Queue works
- [ ] Court assignment works
- [ ] TV liveboard works
- [ ] Realtime update works
- [ ] Health check passes
