# Data Contracts

## BookingSlot
```ts
type BookingSlot = {
  id: string;
  courtId: string;
  courtName: string;
  startAt: string;
  endAt: string;
  status: 'open' | 'booked' | 'pending_payment' | 'checked_in' | 'maintenance';
  title: string;
  subtitle?: string;
  paymentStatus?: 'paid' | 'split_pending' | 'deposit_missing' | 'unpaid';
  players?: Player[];
};
```

## Member
```ts
type Member = {
  id: string;
  name: string;
  initials: string;
  rating?: number;
  membership?: string;
  walletBalance: number;
  ltv?: number;
  riskFlags?: string[];
};
```

## SplitPayment
```ts
type SplitPayment = {
  bookingId: string;
  total: number;
  shares: Array<{ memberId: string; name: string; amount: number; status: 'paid' | 'pending' | 'failed' }>;
};
```

## AutomationFlow
```ts
type AutomationFlow = {
  id: string;
  name: string;
  trigger: string;
  channels: Array<'sms'|'email'|'push'|'tv'|'voice'>;
  enabled: boolean;
  lastRunAt?: string;
};
```
