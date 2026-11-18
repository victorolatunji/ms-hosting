// Spell out counts for headings ("Eleven cities, twenty-two doorsteps").
const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

export const toWords = (n: number): string => {
  if (n < 20) return ONES[n] ?? String(n);
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "");
  return String(n);
};
export const capWords = (n: number) => {
  const w = toWords(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
};
