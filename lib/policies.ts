// Direct-booking policies (Hot Tub Oasis). These mirror the policy Sam uses on
// Airbnb for the same listing ("Firm"), read on 18 Nov 2026, so guests get the
// same deal whichever way they book. Used by the booking panel, /cancellations
// and /terms, so all three always say the same thing.

export const DIRECT_CANCELLATION = {
  name: "Firm",
  summary:
    "Free cancellation within 24 hours of booking (when booked at least 14 days before check-in). After that: full refund 30+ days before check-in, 50% refund 7 to 30 days before, no refund within 7 days.",
  rules: [
    "Full refund if you cancel within 24 hours of booking, as long as check-in is at least 14 days away.",
    "Full refund if you cancel at least 30 days before check-in.",
    "50% refund if you cancel between 7 and 30 days before check-in.",
    "No refund if you cancel less than 7 days before check-in, or after check-in.",
    "If we ever have to cancel your stay, you get a full refund.",
    "Refunds go back to the card you paid with, usually within 5 to 10 business days.",
  ],
};

export const DIRECT_HOUSE_RULES = [
  "Check-in from 4:00 pm to midnight, self check-in with a keypad. Check-out by 10:00 am.",
  "Up to 2 guests. No visitors, parties or events.",
  "Not suitable for children aged 2 to 12.",
  "No smoking and no pets. Please note a pet lives on the property.",
  "Quiet hours 11:00 pm to 6:00 am.",
  "No commercial photography.",
  "Breaking these rules can mean your stay is ended early without a refund.",
];
