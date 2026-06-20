export type Role = "guest" | "member" | "staff" | "admin";

export type SessionStatus =
  | "open"
  | "few-spots"
  | "waitlist"
  | "live"
  | "completed";

export type BookingStatus =
  | "pending-payment"
  | "confirmed"
  | "checked-in"
  | "waiting"
  | "playing"
  | "waitlisted"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "manual-review";

export type CourtStatus =
  | "available"
  | "playing"
  | "ending-soon"
  | "time-up"
  | "maintenance";

export interface Club {
  id: string;
  name: string;
  city: string;
  logo: string;
  timezone: string;
  phone: string;
  email: string;
}

export interface Person {
  id: string;
  fullName: string;
  firstName: string;
  role?: Role;
  avatar?: string;
  tag?: string;
  skillLevel?: string;
}

export interface Session {
  id: string;
  name: string;
  dayLabel: string;
  dateLabel: string;
  timeLabel: string;
  level: string;
  price: number;
  courts: number;
  capacity: number;
  booked: number;
  checkedIn: number;
  waiting: number;
  status: SessionStatus;
  hero: string;
  rules: string[];
  announcements: string[];
  durationMinutes: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: "stripe";
  checkoutUrl?: string;
}

export interface Booking {
  id: string;
  sessionId: string;
  player: Person;
  bookingType: "guest" | "member";
  bookingSource: "public-web" | "admin" | "walk-in";
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  holdExpiresAt?: string;
  note?: string;
}

export interface QueueEntry {
  id: string;
  sessionId: string;
  position: number;
  player: Person;
  eta: string;
}

export interface CourtAssignment {
  id: string;
  sessionId: string;
  courtName: string;
  status: CourtStatus;
  endsInSeconds?: number;
  teamA: Person[];
  teamB: Person[];
  nextUp?: Person[];
}

export interface RealtimeEvent {
  id: string;
  timestamp: string;
  label: string;
  detail: string;
}
