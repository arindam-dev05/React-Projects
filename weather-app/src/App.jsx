import { useCallback, useEffect, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import UnitToggle from "./components/UnitToggle.jsx";
import CurrentWeather from "./components/CurrentWeather.jsx";
import HourlyForecast from "./components/HourlyForecast.jsx";
import DailyForecast from "./components/DailyForecast.jsx";
import Details from "./components/Details.jsx";
import { fetchForecast, reverseGeocode } from "./api.js";
import { describe } from "./weatherCodes.js";

// Shown on first visit. Change this to your own city.
const DEFAULT_PLACE = {
  name: "London",
  region: "England",
  country: "United Kingdom",
  latitude: 51.5085,
  longitude: -0.1257,
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, etc.) */
  }
}

export default function App() {
  const [place, setPlace] = useState(() => load("weather:place", DEFAULT_PLACE));
  const [unit, setUnit] = useState(() => load("weather:unit", "c"));
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [locating, setLocating] = useState(false);

  // Fetch whenever the place changes (or the user hits "Try again").
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchForecast(place, controller.signal)
      .then((data) => {
        setWeather({ ...data, place });
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [place, reloadKey]);

  useEffect(() => save("weather:place", place), [place]);
  useEffect(() => save("weather:unit", unit), [unit]);

  // The page background follows the current conditions (see [data-theme] in styles.css).
  const theme = weather ? describe(weather.current.code, weather.current.isDay).theme : "clear-day";
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleSelect = useCallback((next) => {
    setNotice("");
    setPlace(next);
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setNotice("This browser can't share your location. Search for a city instead.");
      return;
    }
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const found = await reverseGeocode(coords.latitude, coords.longitude);
        setPlace({
          name: found?.name ?? "Current location",
          region: found?.region ?? "",
          country: found?.country ?? "",
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setNotice(
          err.code === err.PERMISSION_DENIED
            ? "Location access is blocked. Allow it in your browser settings, or search for a city."
            : "Couldn't find your location. Search for a city instead."
        );
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const busy = status === "loading";
  const showData = weather && status !== "error";

  return (
    <div className="page">
      <header className="topbar">
        <SearchBar onSelect={handleSelect} onLocate={locate} locating={locating} />
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      {status === "error" && (
        <section className="notice error" role="alert">
          <p>Couldn't load the forecast for {place.name}. Check your connection and try again.</p>
          <button type="button" className="button" onClick={() => setReloadKey((k) => k + 1)}>
            Try again
          </button>
        </section>
      )}

      {!weather && busy && (
        <p className="loading" role="status">
          Loading the forecast for {place.name}…
        </p>
      )}

      {showData && (
        <main className={busy ? "content is-loading" : "content"} aria-busy={busy}>
          <CurrentWeather
            place={weather.place}
            current={weather.current}
            today={weather.daily[0]}
            unit={unit}
          />
          <HourlyForecast hours={weather.hourly} unit={unit} />
          <div className="columns">
            <DailyForecast days={weather.daily} unit={unit} />
            <Details current={weather.current} today={weather.daily[0]} unit={unit} />
          </div>
        </main>
      )}

      <footer className="footer">
        Forecast data by{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        .
      </footer>
    </div>
  );
}
