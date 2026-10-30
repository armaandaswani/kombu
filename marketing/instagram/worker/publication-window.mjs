// Check the actual execution clock too: a delayed cron must never publish after the morning.
export function isMorningPublicationTime(now=new Date()) {
 const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'America/Manaus',hour:'2-digit',hourCycle:'h23'}).format(now));
 return hour>=7&&hour<12;
}
