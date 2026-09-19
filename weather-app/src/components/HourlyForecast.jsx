import { describe } from "../weatherCodes.js";
import { fmtTemp, hourLabel } from "../utils.js";

export default function HourlyForecast({ hours, unit }) {
  return (
    <section className="section" aria-labelledby="hourly-title">
      <h2 id="hourly-title">Next 24 hours</h2>
      <ol className="hourly" tabIndex={0} aria-label="Hourly forecast, scrolls sideways">
        {hours.map((h, i) => {
          const { label, icon } = describe(h.code, h.isDay);
          return (
            <li key={h.time} className="hour">
              <span className="hour-time">{i === 0 ? "Now" : hourLabel(h.time)}</span>
              <span className="hour-icon" role="img" aria-label={label}>
                {icon}
              </span>
              <span className="hour-temp">{fmtTemp(h.temp, unit)}</span>
              <span className="hour-rain">
                {h.pop >= 20 && (
                  <>
                    <span className="sr-only">Chance of rain </span>
                    {h.pop}%
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
