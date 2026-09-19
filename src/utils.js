// Formatting helpers. Weather data is always stored in metric (°C, km/h)
// and converted at display time, so switching units is instant.

export const toUnit = (celsius, unit) => (unit === "f" ? (celsius * 9) / 5 + 32 : celsius);

export const fmtTemp = (celsius, unit) => `${Math.round(toUnit(celsius, unit))}°`;

export const fmtSpeed = (kmh, unit) =>
  unit === "f" ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`;

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const compass = (degrees) => DIRECTIONS[Math.round(degrees / 45) % 8];

export function uvLabel(uv) {
  const value = Math.round(uv);
  const level = uv < 3 ? "Low" : uv < 6 ? "Moderate" : uv < 8 ? "High" : uv < 11 ? "Very high" : "Extreme";
  return `${value} (${level})`;
}

// The API returns local times for the selected place as "YYYY-MM-DDTHH:MM"
// (no offset), so we read the digits directly instead of using Date + timezones.
function hoursMinutes(iso) {
  const h = Number(iso.slice(11, 13));
  return { h12: h % 12 || 12, minutes: iso.slice(14, 16), suffix: h >= 12 ? "PM" : "AM" };
}

export function clock(iso) {
  const { h12, minutes, suffix } = hoursMinutes(iso);
  return `${h12}:${minutes} ${suffix}`;
}

export function hourLabel(iso) {
  const { h12, suffix } = hoursMinutes(iso);
  return `${h12} ${suffix}`;
}

function dateFromIso(iso) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const longDate = (iso) =>
  dateFromIso(iso).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

export const dayName = (iso, index) =>
  index === 0 ? "Today" : dateFromIso(iso).toLocaleDateString(undefined, { weekday: "short" });
