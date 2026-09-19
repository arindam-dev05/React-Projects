// Maps WMO weather codes (used by Open-Meteo) to a label, an emoji icon and a colour theme.

const TABLE = {
  0: ["Clear sky", "clear"],
  1: ["Mainly clear", "clear"],
  2: ["Partly cloudy", "partly"],
  3: ["Overcast", "cloud"],
  45: ["Fog", "fog"],
  48: ["Freezing fog", "fog"],
  51: ["Light drizzle", "drizzle"],
  53: ["Drizzle", "drizzle"],
  55: ["Heavy drizzle", "drizzle"],
  56: ["Freezing drizzle", "drizzle"],
  57: ["Heavy freezing drizzle", "drizzle"],
  61: ["Light rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy rain", "rain"],
  66: ["Freezing rain", "rain"],
  67: ["Heavy freezing rain", "rain"],
  71: ["Light snow", "snow"],
  73: ["Snow", "snow"],
  75: ["Heavy snow", "snow"],
  77: ["Snow grains", "snow"],
  80: ["Light showers", "rain"],
  81: ["Showers", "rain"],
  82: ["Heavy showers", "rain"],
  85: ["Light snow showers", "snow"],
  86: ["Heavy snow showers", "snow"],
  95: ["Thunderstorm", "storm"],
  96: ["Thunderstorm with hail", "storm"],
  99: ["Severe thunderstorm with hail", "storm"],
};

// [day icon, night icon]
const ICONS = {
  clear: ["☀️", "🌙"],
  partly: ["⛅", "☁️"],
  cloud: ["☁️", "☁️"],
  fog: ["🌫️", "🌫️"],
  drizzle: ["🌦️", "🌧️"],
  rain: ["🌧️", "🌧️"],
  snow: ["🌨️", "🌨️"],
  storm: ["⛈️", "⛈️"],
};

// Theme names match the [data-theme] blocks in styles.css.
function themeFor(kind, day) {
  switch (kind) {
    case "clear":
    case "partly":
      return day ? "clear-day" : "clear-night";
    case "cloud":
      return day ? "cloudy" : "cloudy-night";
    case "fog":
      return "fog";
    case "drizzle":
    case "rain":
      return "rain";
    case "snow":
      return "snow";
    case "storm":
      return "storm";
    default:
      return "cloudy";
  }
}

export function describe(code, isDay = true) {
  const [label, kind] = TABLE[code] ?? ["Unknown conditions", "cloud"];
  const day = Boolean(isDay);
  return {
    label,
    icon: ICONS[kind][day ? 0 : 1],
    theme: themeFor(kind, day),
  };
}
