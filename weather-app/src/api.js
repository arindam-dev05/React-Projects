// All network calls live here. No API keys are needed.
//  - Open-Meteo Geocoding: city search
//  - Open-Meteo Forecast:  weather data
//  - BigDataCloud:         reverse geocoding for "Use my location" (optional; falls back gracefully)

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

async function getJSON(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
}

export async function searchCities(query, signal) {
  const name = query.trim();
  if (name.length < 2) return [];
  const params = new URLSearchParams({ name, count: "6", language: "en", format: "json" });
  const data = await getJSON(`${GEO_URL}?${params}`, signal);
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    region: r.admin1 ?? "",
    country: r.country ?? "",
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function reverseGeocode(latitude, longitude, signal) {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: "en",
    });
    const data = await getJSON(`${REVERSE_URL}?${params}`, signal);
    const name = data.city || data.locality || data.principalSubdivision;
    if (!name) return null;
    return { name, region: data.principalSubdivision ?? "", country: data.countryName ?? "" };
  } catch {
    return null;
  }
}

export async function fetchForecast({ latitude, longitude }, signal) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "7",
  });
  const raw = await getJSON(`${FORECAST_URL}?${params}`, signal);
  return normalizeForecast(raw);
}

// Turns Open-Meteo's column-oriented response into objects the UI can map over.
export function normalizeForecast(raw) {
  const c = raw.current;
  const h = raw.hourly;
  const d = raw.daily;

  // Start the hourly strip at the current hour in the place's own timezone.
  const currentHour = c.time.slice(0, 13);
  let start = h.time.findIndex((t) => t.slice(0, 13) >= currentHour);
  if (start < 0) start = 0;

  return {
    current: {
      time: c.time,
      temp: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      code: c.weather_code,
      isDay: c.is_day === 1,
      windSpeed: c.wind_speed_10m,
      windDir: c.wind_direction_10m,
      pressure: c.pressure_msl,
    },
    hourly: h.time.slice(start, start + 24).map((time, i) => ({
      time,
      temp: h.temperature_2m[start + i],
      code: h.weather_code[start + i],
      isDay: h.is_day[start + i] === 1,
      pop: h.precipitation_probability[start + i] ?? 0,
    })),
    daily: d.time.map((date, i) => ({
      date,
      code: d.weather_code[i],
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
      pop: d.precipitation_probability_max[i] ?? 0,
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      uv: d.uv_index_max[i] ?? 0,
    })),
  };
}
