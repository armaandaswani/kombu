// Business dates. The business runs on Manaus time (UTC-4, no daylight saving), so
// "today" is the date there. It is not the UTC date, which is already tomorrow
// from 20:00 in Manaus, and not the date on whatever device or server asks. The
// admin keeps the same rules in assets/admin.js; scripts/dates-regression.js
// checks the two agree.
const BUSINESS_TIME_ZONE = "America/Manaus";

let formatter;

function todayIso(now = new Date()) {
  try {
    formatter = formatter || new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
    const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  } catch {
    // A runtime without time zone data: Manaus has no daylight saving, so UTC-4.
    return new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
}

// Calendar arithmetic on a YYYY-MM-DD date, done in UTC so that the machine's own
// time zone can never move the result by a day. An empty date means today; one
// that is not a date gives "" rather than a guess.
function shiftIso(dateIso, days, months) {
  const match = dateIso ? /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateIso)) : /^(\d{4})-(\d{2})-(\d{2})$/.exec(todayIso());
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (months) date.setUTCMonth(date.getUTCMonth() + months);
  if (days) date.setUTCDate(date.getUTCDate() + days);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

const addDaysIso = (dateIso, days) => shiftIso(dateIso, Number(days || 0), 0);
const addMonthsIso = (dateIso, months) => shiftIso(dateIso, 0, Number(months || 0));

module.exports = { BUSINESS_TIME_ZONE, addDaysIso, addMonthsIso, todayIso };
