// "Today" is the date in Manaus, whatever the clock of the device or the server
// says. The admin used the UTC date, which is already tomorrow from 20:00 in
// Manaus, so anything recorded in the evening got the next day's date; the date
// sums also went wrong in time zones east of UTC. This checks, in the admin and in
// the server's payment reminders, that "today" is the Manaus date at the edges of
// the day, the month and the year, and that adding days or months and counting
// days gives the same answer under any time zone the machine might be set to.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const INSTANTS = [
  ["2026-11-16T12:00:00Z", "2026-11-16"], // 08:00 in Manaus
  ["2026-11-17T02:56:00Z", "2026-11-16"], // 22:56: UTC already says the 17th
  ["2026-11-17T03:59:59Z", "2026-11-16"], // one second to midnight
  ["2026-11-17T04:00:00Z", "2026-11-17"], // midnight in Manaus
  ["2026-12-01T03:30:00Z", "2026-11-30"], // last evening of a month
  ["2027-01-01T03:59:00Z", "2026-12-31"], // last evening of a year
  ["2027-01-01T04:00:00Z", "2027-01-01"],
  ["2028-03-01T03:00:00Z", "2028-02-29"], // leap day
];
const SUMS = [
  ["addDaysIso", ["2026-11-16", 15], "2026-12-01"],
  ["addDaysIso", ["2026-02-27", 2], "2026-03-01"],
  ["addDaysIso", ["2026-03-08", 1], "2026-03-09"], // a daylight-saving change elsewhere
  ["addDaysIso", ["2026-11-01", 1], "2026-11-02"],
  ["addDaysIso", ["2026-12-31", 1], "2027-01-01"],
  ["addDaysIso", ["2026-11-16", -16], "2026-10-31"],
  ["addMonthsIso", ["2026-11-16", 4], "2027-03-16"],
  ["addMonthsIso", ["2026-01-31", 1], "2026-03-03"], // the overflow the panel has always had
  ["addMonthsIso", ["2026-12-15", 1], "2027-01-15"],
];

if (process.argv[2] === "child") {
  const { createAdminSandbox } = require("./admin-harness");
  const admin = createAdminSandbox();
  const call = (name, ...args) => { admin.__args = args; return admin.__eval(`${name}(...__args)`); };
  const result = { today: [], sums: [], days: [], server: null };
  for (const [instant] of INSTANTS) result.today.push(call("todayIso", new Date(instant)));
  for (const [name, args] of SUMS) result.sums.push(call(name, ...args));
  const today = call("todayIso");
  result.days = [call("daysUntil", today), call("daysUntil", call("addDaysIso", today, 10)), call("daysUntil", call("addDaysIso", today, -3)), call("daysUntil", "")];
  // The server's payment reminders use the same rule.
  const dates = require("../api/_lib/dates");
  result.server = {
    today: INSTANTS.map(([instant]) => dates.todayIso(new Date(instant))),
    sums: SUMS.filter(([name]) => name === "addDaysIso").map(([, args]) => dates.addDaysIso(...args)),
  };
  // The two sides agree on every instant, every 20 minutes for three days.
  const start = Date.parse("2026-11-29T00:00:00Z");
  result.disagreements = [];
  for (let step = 0; step < 3 * 72; step += 1) {
    const instant = new Date(start + step * 20 * 60 * 1000);
    if (call("todayIso", instant) !== dates.todayIso(instant)) result.disagreements.push(instant.toISOString());
  }
  console.log(JSON.stringify(result));
} else {
  const expectedToday = INSTANTS.map(([, expected]) => expected);
  const expectedSums = SUMS.map(([, , expected]) => expected);
  // The same answers under zones west of, at and east of UTC, with and without daylight saving.
  for (const zone of ["America/Manaus", "UTC", "Asia/Tokyo", "Pacific/Auckland", "America/Los_Angeles", "Europe/London", "Pacific/Kiritimati"]) {
    const run = spawnSync(process.execPath, [__filename, "child"], { env: { ...process.env, TZ: zone }, encoding: "utf8" });
    assert.equal(run.status, 0, `${zone}: ${run.stderr.split("\n").find((line) => /Error/.test(line)) || run.stderr.slice(0, 300)}`);
    const result = JSON.parse(run.stdout.trim().split("\n").pop());
    assert.deepEqual(result.today, expectedToday, `${zone}: todayIso at the edges of the day, month and year`);
    assert.deepEqual(result.sums, expectedSums, `${zone}: adding days and months`);
    assert.deepEqual(result.days, [0, 10, -3, null], `${zone}: counting days from today`);
    assert.deepEqual(result.server.today, expectedToday, `${zone}: the server's today`);
    assert.deepEqual(result.server.sums, SUMS.filter(([name]) => name === "addDaysIso").map(([, , expected]) => expected), `${zone}: the server's date sums`);
    assert.deepEqual(result.disagreements, [], `${zone}: the admin and the server agree on today`);
  }
  // No code path still takes today from the UTC date.
  for (const file of ["assets/admin.js", "api/cron/payment-reminders.js"]) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    assert.equal(/new Date\(\)\.toISOString\(\)\.slice\(0,\s*10\)/.test(source), false, `${file} must not take today from the UTC date`);
    assert.equal(/new Date\(\)\.toLocaleDateString\("sv-SE"\)/.test(source), false, `${file} must not take today from the device's date`);
  }
  console.log("Dates: today is the Manaus date at the edges of the day, month and year, the date sums and day counts agree under seven time zones, the admin and the server agree on today, and no path takes today from UTC or the device passed.");
}
