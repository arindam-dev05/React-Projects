# Weather App

A front-end-only weather app built with React and Vite. Search for any city and see the current conditions, the next 24 hours, and a 7-day forecast. The page background changes with the weather and the time of day.

There is no backend and **no API key to set up**. Data comes from [Open-Meteo](https://open-meteo.com/).

## Features

- City search with live suggestions (debounced, keyboard accessible)
- "Use my location" through the browser's geolocation
- Current temperature, feels-like, humidity, wind, pressure, UV index, sunrise and sunset
- Hourly forecast for the next 24 hours, with chance of rain
- 7-day forecast with a range bar that compares each day against the whole week
- °C / °F toggle (converted in the browser, so switching is instant)
- Remembers your last city and unit (localStorage)
- Sky theme that follows the conditions: clear, cloudy, rain, snow, storm, fog, each with a night variant where it matters
- Loading, error and empty-search states, with a retry button
- Responsive layout, visible keyboard focus, and reduced-motion support

## Getting started

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL that Vite prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
weather-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # entry point
    ├── App.jsx               # state, data fetching, page layout
    ├── api.js                # Open-Meteo requests + response normalisation
    ├── weatherCodes.js       # weather code -> label, icon, sky theme
    ├── utils.js              # unit conversion and date/time formatting
    ├── styles.css            # design tokens, sky themes, layout
    └── components/
        ├── SearchBar.jsx     # city search + "Use my location"
        ├── UnitToggle.jsx    # °C / °F switch
        ├── CurrentWeather.jsx
        ├── HourlyForecast.jsx
        ├── DailyForecast.jsx
        └── Details.jsx       # humidity, wind, pressure, UV, sunrise/sunset
```

## How it works

1. `SearchBar` calls the Open-Meteo Geocoding API to turn a city name into coordinates.
2. `App` stores the selected place and calls the Open-Meteo Forecast API with `timezone=auto`, so every time shown is local to the searched city.
3. `normalizeForecast()` in `api.js` converts the API's column-based arrays into plain objects the components can map over.
4. Data is stored in metric (°C, km/h). `utils.js` converts to °F and mph only when displaying.
5. `App` picks a sky theme from the current weather code and sets `data-theme` on `<html>`. `styles.css` turns that into the background and text colours.

## Customising

- **Default city:** edit `DEFAULT_PLACE` at the top of `src/App.jsx`. It is only used on the first visit, before anything is saved.
- **Colours:** each sky theme is one line in `src/styles.css` (`:root[data-theme="rain"]` and so on). Keep the text colour readable against both gradient colours.
- **Fonts:** loaded from Google Fonts in `index.html` (Bricolage Grotesque and Instrument Sans). Change the link and the `--display` and `--text` variables in `styles.css` to use others.
- **Extra data:** add the field names to the `current`, `hourly` or `daily` parameters in `api.js`, then map them in `normalizeForecast()`. The full list is in the [Open-Meteo docs](https://open-meteo.com/en/docs).

## Data sources and limits

| Purpose | Service | Key needed |
| --- | --- | --- |
| City search | Open-Meteo Geocoding API | No |
| Weather data | Open-Meteo Forecast API | No |
| Place name for "Use my location" | BigDataCloud client-side reverse geocoding | No |

- Open-Meteo's free API is intended for non-commercial use and has fair-use rate limits. For a commercial product, check their terms or use a paid plan. Their data is licensed CC BY 4.0, which is why the footer credits Open-Meteo.
- If the reverse geocoding request fails, the app still works and labels the place "Current location".
- Geolocation only works on `https://` pages or on `localhost`.

## Deploying

Run `npm run build` and upload the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

For GitHub Pages or any sub-path deployment, set the base path in `vite.config.js`, for example `base: "/weather-app/"`.

## Troubleshooting

- **"Couldn't load the forecast":** check your internet connection, or whether an ad blocker or firewall is blocking `open-meteo.com`. Select "Try again" once it's fixed.
- **"Use my location" does nothing:** the browser may have blocked location access for the site. Allow it in the site settings, or search for a city.
- **A city doesn't appear in suggestions:** try a nearby larger city, or add the country name to your search.
- **Fonts look different:** the Google Fonts request is probably blocked. The app falls back to system fonts and still works.

## Ideas for next steps

- Add a saved-cities list
- Show a rain or temperature chart for the next 24 hours
- Add weather alerts
- Add tests with Vitest and React Testing Library
- Add TypeScript
