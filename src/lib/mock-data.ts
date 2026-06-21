import type {
  Booking,
  Club,
  CourtAssignment,
  Payment,
  Person,
  QueueEntry,
  RealtimeEvent,
  Session,
} from "@/lib/types";

export const club: Club = {
  id: "club-1",
  name: "Pickle Pulse Social Club",
  city: "Istanbul",
  logo: "PP",
  timezone: "Europe/Istanbul",
  phone: "+90 212 555 0142",
  email: "hello@picklepulse.club",
};

export const sessions: Session[] = [
  {
    id: "friday-open-play",
    name: "Friday Open Play",
    dayLabel: "Tonight",
    dateLabel: "Jun 20",
    timeLabel: "18:00 - 21:00",
    level: "Intermediate",
    price: 18,
    courts: 3,
    capacity: 24,
    booked: 18,
    checkedIn: 18,
    waiting: 6,
    status: "live",
    hero: "Broadcast-grade open play with fast court turns, guest bookings, and a strong public liveboard.",
    rules: [
      "Guests can book and pay without creating an account first.",
      "Arrive 15 minutes early to keep your position active.",
      "Rotation is FIFO by default, with staff override available.",
    ],
    announcements: [
      "Court 2 is loading the next group.",
      "Front desk can convert guest bookings into member profiles after checkout.",
    ],
    durationMinutes: 12,
  },
  {
    id: "saturday-rally",
    name: "Saturday Rally",
    dayLabel: "Tomorrow",
    dateLabel: "Jun 21",
    timeLabel: "09:00 - 12:00",
    level: "Beginner Friendly",
    price: 14,
    courts: 4,
    capacity: 24,
    booked: 21,
    checkedIn: 0,
    waiting: 0,
    status: "few-spots",
    hero: "A high-conversion mobile booking flow with member speed and guest flexibility.",
    rules: [
      "Members keep saved player details for one-tap checkout.",
      "Guests can join the waitlist when the session is full.",
      "Manual review flags card failures before the slot is released.",
    ],
    announcements: ["Only 3 spots left.", "Waitlist auto-opens at capacity."],
    durationMinutes: 15,
  },
  {
    id: "advanced-night",
    name: "Advanced Night",
    dayLabel: "Sunday",
    dateLabel: "Jun 22",
    timeLabel: "19:00 - 22:00",
    level: "Advanced",
    price: 22,
    courts: 4,
    capacity: 24,
    booked: 24,
    checkedIn: 0,
    waiting: 9,
    status: "waitlist",
    hero: "Premium session control with waitlist protection and admin promotion.",
    rules: [
      "Waitlist promotion is staff-controlled in MVP.",
      "No duplicate active booking for the same session.",
      "Cancellation closes 2 hours before start.",
    ],
    announcements: ["Waitlist open.", "Members get saved preference tags."],
    durationMinutes: 15,
  },
];

export const people: Person[] = [
  { id: "p1", fullName: "Ali Kara", firstName: "Ali", tag: "Member", skillLevel: "3.5", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=AliKara" },
  { id: "p2", fullName: "Deniz Yilmaz", firstName: "Deniz", tag: "Member", skillLevel: "3.5", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=DenizYilmaz" },
  { id: "p3", fullName: "Mark Stone", firstName: "Mark", tag: "Guest", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=MarkStone" },
  { id: "p4", fullName: "Josh Snow", firstName: "Josh", tag: "Guest", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=JoshSnow" },
  { id: "p5", fullName: "Maria Rose", firstName: "Maria", tag: "Queue #1", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=MariaRose" },
  { id: "p6", fullName: "Kevin Vale", firstName: "Kevin", tag: "Queue #2", skillLevel: "3.5", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=KevinVale" },
  { id: "p7", fullName: "Sam Moss", firstName: "Sam", tag: "Queue #3", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=SamMoss" },
  { id: "p8", fullName: "Leo Ortiz", firstName: "Leo", tag: "Queue #4", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=LeoOrtiz" },
  { id: "p9", fullName: "Ana Cruz", firstName: "Ana", tag: "Member", skillLevel: "3.5", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=AnaCruz" },
  { id: "p10", fullName: "Ben North", firstName: "Ben", tag: "Member", skillLevel: "3.5", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=BenNorth" },
  { id: "p11", fullName: "Theo Clark", firstName: "Theo", tag: "Guest", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=TheoClark" },
  { id: "p12", fullName: "Ken Nash", firstName: "Ken", tag: "Guest", skillLevel: "3.0", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=KenNash" },
];

export const currentUser: Person = {
  id: "u1",
  fullName: "Dani Santos",
  firstName: "Dani",
  role: "member",
  tag: "Intermediate",
  skillLevel: "3.5",
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=DaniSantos",
};

export const bookings: Booking[] = [
  {
    id: "bkg-1001",
    sessionId: "friday-open-play",
    player: currentUser,
    bookingType: "member",
    bookingSource: "public-web",
    bookingStatus: "checked-in",
    paymentStatus: "paid",
    createdAt: "2026-06-20T10:00:00.000Z",
    note: "Profile synced with member account.",
  },
  {
    id: "bkg-1002",
    sessionId: "saturday-rally",
    player: {
      id: "g-1",
      fullName: "Mila Turner",
      firstName: "Mila",
      role: "guest",
      tag: "Guest checkout",
      avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=MilaTurner",
    },
    bookingType: "guest",
    bookingSource: "public-web",
    bookingStatus: "pending-payment",
    paymentStatus: "pending",
    createdAt: "2026-06-20T10:18:00.000Z",
    holdExpiresAt: "2026-06-20T10:33:00.000Z",
    note: "15 minute capacity hold active.",
  },
  {
    id: "bkg-1003",
    sessionId: "advanced-night",
    player: {
      id: "g-2",
      fullName: "Noah Brooks",
      firstName: "Noah",
      role: "guest",
      tag: "Waitlist",
      avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=NoahBrooks",
    },
    bookingType: "guest",
    bookingSource: "public-web",
    bookingStatus: "waitlisted",
    paymentStatus: "manual-review",
    createdAt: "2026-06-20T09:30:00.000Z",
    note: "Awaiting admin promotion.",
  },
];

export const payments: Payment[] = [
  {
    id: "pay-1001",
    bookingId: "bkg-1001",
    amount: 18,
    currency: "USD",
    status: "paid",
    provider: "stripe",
    checkoutUrl: "/booking/confirm?bookingId=bkg-1001",
  },
  {
    id: "pay-1002",
    bookingId: "bkg-1002",
    amount: 14,
    currency: "USD",
    status: "pending",
    provider: "stripe",
    checkoutUrl: "/booking/confirm?bookingId=bkg-1002",
  },
];

export const queueEntries: QueueEntry[] = [
  { id: "q1", sessionId: "friday-open-play", position: 1, player: people[4], eta: "Court 2 next" },
  { id: "q2", sessionId: "friday-open-play", position: 2, player: people[5], eta: "Court 2 next" },
  { id: "q3", sessionId: "friday-open-play", position: 3, player: people[6], eta: "6 min" },
  { id: "q4", sessionId: "friday-open-play", position: 4, player: people[7], eta: "6 min" },
  {
    id: "q5",
    sessionId: "friday-open-play",
    position: 5,
    player: { id: "p13", fullName: "Carlo Ray", firstName: "Carlo", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=CarloRay" },
    eta: "12 min",
  },
  {
    id: "q6",
    sessionId: "friday-open-play",
    position: 6,
    player: { id: "p14", fullName: "Mia Park", firstName: "Mia", avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=MiaPark" },
    eta: "12 min",
  },
];

export const courtAssignments: CourtAssignment[] = [
  {
    id: "ca-1",
    sessionId: "friday-open-play",
    courtName: "Court 1",
    status: "playing",
    endsInSeconds: 462,
    teamA: [people[0], people[1]],
    teamB: [people[2], people[3]],
  },
  {
    id: "ca-2",
    sessionId: "friday-open-play",
    courtName: "Court 2",
    status: "available",
    teamA: [],
    teamB: [],
    nextUp: [people[4], people[5], people[6], people[7]],
  },
  {
    id: "ca-3",
    sessionId: "friday-open-play",
    courtName: "Court 3",
    status: "ending-soon",
    endsInSeconds: 72,
    teamA: [people[8], people[9]],
    teamB: [people[10], people[11]],
  },
];

export const realtimeEvents: RealtimeEvent[] = [
  {
    id: "e1",
    timestamp: "18:34",
    label: "payment.updated",
    detail: "Mila Turner capacity hold started after Stripe checkout session creation.",
  },
  {
    id: "e2",
    timestamp: "18:37",
    label: "queue.updated",
    detail: "Court 2 next group locked for Maria, Kevin, Sam, and Leo.",
  },
  {
    id: "e3",
    timestamp: "18:41",
    label: "game.ending_soon",
    detail: "Court 3 entered ending-soon state with 72 seconds left.",
  },
];

export function getSessionById(sessionId: string) {
  return sessions.find((session) => session.id === sessionId) ?? sessions[0];
}

export function getBookingById(bookingId: string) {
  return bookings.find((booking) => booking.id === bookingId) ?? bookings[0];
}

export function getPaymentForBooking(bookingId: string) {
  return payments.find((payment) => payment.bookingId === bookingId);
}

export function getBookingsForSession(sessionId: string) {
  return bookings.filter((booking) => booking.sessionId === sessionId);
}

export function getQueueForSession(sessionId: string) {
  return queueEntries.filter((entry) => entry.sessionId === sessionId);
}

export function getAssignmentsForSession(sessionId: string) {
  return courtAssignments.filter((assignment) => assignment.sessionId === sessionId);
}

export function callNextOnCourt(courtId: string) {
  const assignment = courtAssignments.find(a => a.id === courtId);
  if (!assignment) return;

  // If there are players in nextUp, move them to teamA and teamB
  if (assignment.nextUp && assignment.nextUp.length >= 2) {
    assignment.teamA = assignment.nextUp.slice(0, 2);
    assignment.teamB = assignment.nextUp.slice(2, 4);
    assignment.nextUp = [];
  } else {
    // Take from the queue
    const sessionQueue = queueEntries.filter(q => q.sessionId === assignment.sessionId);
    if (sessionQueue.length >= 4) {
      assignment.teamA = [sessionQueue[0].player, sessionQueue[1].player];
      assignment.teamB = [sessionQueue[2].player, sessionQueue[3].player];
      // remove from queueEntries
      const idsToRemove = new Set([sessionQueue[0].id, sessionQueue[1].id, sessionQueue[2].id, sessionQueue[3].id]);
      const indexList = queueEntries.filter(q => !idsToRemove.has(q.id));
      queueEntries.length = 0;
      queueEntries.push(...indexList);
    } else if (sessionQueue.length >= 2) {
      assignment.teamA = [sessionQueue[0].player, sessionQueue[1].player];
      assignment.teamB = [];
      const idsToRemove = new Set([sessionQueue[0].id, sessionQueue[1].id]);
      const indexList = queueEntries.filter(q => !idsToRemove.has(q.id));
      queueEntries.length = 0;
      queueEntries.push(...indexList);
    } else {
      // Dummy fallback players
      assignment.teamA = [people[0], people[1]];
      assignment.teamB = [people[2], people[3]];
    }
  }

  assignment.status = "playing";
  assignment.endsInSeconds = 600;

  const eventText = `${assignment.courtName} game started: ${assignment.teamA.map(p => p.firstName).join(" / ")} vs ${assignment.teamB.map(p => p.firstName).join(" / ") || "Waiting Opponent"}.`;
  realtimeEvents.unshift({
    id: `e-call-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    label: "game.started",
    detail: eventText
  });
}

export function endSetOnCourt(courtId: string, scoreA: number = 11, scoreB: number = 7) {
  const assignment = courtAssignments.find(a => a.id === courtId);
  if (!assignment) return;

  const prevTeamA = assignment.teamA;
  const prevTeamB = assignment.teamB;

  assignment.teamA = [];
  assignment.teamB = [];
  assignment.status = "available";
  assignment.endsInSeconds = undefined;

  const eventText = `${assignment.courtName} set ended: ${prevTeamA.map(p => p.firstName).join(" / ")} vs ${prevTeamB.map(p => p.firstName).join(" / ")} (${scoreA} - ${scoreB}).`;
  realtimeEvents.unshift({
    id: `e-end-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    label: "game.ended",
    detail: eventText
  });
}

export function queueNextOnCourt(courtId: string) {
  const assignment = courtAssignments.find(a => a.id === courtId);
  if (!assignment) return;

  const sessionQueue = queueEntries.filter(q => q.sessionId === assignment.sessionId);
  if (sessionQueue.length >= 4) {
    assignment.nextUp = [
      sessionQueue[0].player,
      sessionQueue[1].player,
      sessionQueue[2].player,
      sessionQueue[3].player
    ];
    // Remove these from queue
    const idsToRemove = new Set([sessionQueue[0].id, sessionQueue[1].id, sessionQueue[2].id, sessionQueue[3].id]);
    const indexList = queueEntries.filter(q => !idsToRemove.has(q.id));
    queueEntries.length = 0;
    queueEntries.push(...indexList);
  } else {
    // If not enough players, assign some from people list
    assignment.nextUp = [people[4], people[5], people[6], people[7]];
  }

  const eventText = `Next group locked for ${assignment.courtName}: ${assignment.nextUp.map(p => p.firstName).join(", ")}.`;
  realtimeEvents.unshift({
    id: `e-queue-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    label: "queue.updated",
    detail: eventText
  });
}
