import { describe } from "../weatherCodes.js";
import { clock, fmtTemp, longDate, toUnit } from "../utils.js";

export default function CurrentWeather({ place, current, today, unit }) {
  const { label, icon } = describe(current.code, current.isDay);
  const where = [place.region, place.country].filter(Boolean).join(", ");
  const unitName = unit === "c" ? "Celsius" : "Fahrenheit";

  return (
    <section className="hero" aria-labelledby="place-name">
      <h1 id="place-name" className="place">
        {place.name}
      </h1>
      {where && <p className="place-sub">{where}</p>}
      <p className="local-time">
        {longDate(current.time)}, {clock(current.time)} local time
      </p>

      <p className="temp" aria-label={`${Math.round(toUnit(current.temp, unit))} degrees ${unitName}`}>
        <span aria-hidden="true">{Math.round(toUnit(current.temp, unit))}</span>
        <span className="deg" aria-hidden="true">
          °{unit.toUpperCase()}
        </span>
      </p>

      <p className="condition">
        <span aria-hidden="true">{icon}</span>
        {label}
      </p>
      <p className="range-summary">
        Feels like {fmtTemp(current.feelsLike, unit)}. High {fmtTemp(today.max, unit)}, low{" "}
        {fmtTemp(today.min, unit)}.
      </p>
    </section>
  );
}
