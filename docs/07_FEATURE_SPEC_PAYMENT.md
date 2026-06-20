# Feature Specification: Payment

## Purpose

The payment module tracks and optionally processes payments for session bookings.

The MVP must support manual payment status even if online payment is not enabled yet.

## Payment Strategy

Use a payment adapter pattern.

Why?

- Payment providers differ by country.
- Provider availability can change.
- Some clubs may prefer cash, bank transfer, or local wallets.
- Online payment setup can be delayed by account approval.

## MVP Payment Modes

### Mode 1: Manual Payment

Admin manually updates payment status.

Use cases:

- Cash at club
- Bank transfer
- Local wallet outside system
- Demo mode

### Mode 2: Online Payment

System creates checkout and receives webhook confirmation.

Use cases:

- Card payment
- Wallet payment
- Online checkout

## Payment Adapter Interface

```ts
interface PaymentProvider {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verifyWebhook(payload: unknown, headers: unknown): Promise<WebhookResult>;
  refundPayment(input: RefundPaymentInput): Promise<RefundResult>;
}
```

## Payment Statuses

```txt
UNPAID
PENDING
PAID
FAILED
REFUNDED
EXPIRED
```

## Booking Payment Flow

```txt
Player creates booking
↓
Payment required?
↓
Yes
↓
Create payment record with PENDING
↓
Create checkout session
↓
Redirect player to checkout
↓
Webhook confirms payment
↓
payment.status = PAID
booking.status = CONFIRMED
```

## Security Requirements

- Player cannot mark payment as paid.
- Only admin can manually modify payment status.
- Webhook endpoint should not require normal user auth, but must verify provider signature.
- Payment amount must be generated server-side, not trusted from client.
- Currency must be stored.
