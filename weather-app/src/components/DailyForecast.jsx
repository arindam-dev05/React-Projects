import { describe } from "../weatherCodes.js";
import { dayName, fmtTemp } from "../utils.js";

export default function DailyForecast({ days, unit }) {
  // Every bar is positioned against the week's overall low and high,
  // so you can compare days at a glance.
  const weekMin = Math.min(...days.map((d) => d.min));
  const weekMax = Math.max(...days.map((d) => d.max));
  const span = Math.max(weekMax - weekMin, 1);

  return (
    <section className="section" aria-labelledby="daily-title">
      <h2 id="daily-title">7-day forecast</h2>
      <ul className="daily">
        {days.map((d, i) => {
          const { label, icon } = describe(d.code, true);
          const width = Math.max(((d.max - d.min) / span) * 100, 4);
          const left = Math.min(((d.min - weekMin) / span) * 100, 100 - width);
          return (
            <li key={d.date} className="day">
              <span className="day-name">{dayName(d.date, i)}</span>
              <span className="day-icon" role="img" aria-label={label}>
                {icon}
              </span>
              <span className="day-rain">
                {d.pop >= 20 && (
                  <>
                    <span className="sr-only">Chance of rain </span>
                    {d.pop}%
                  </>
                )}
              </span>
              <span className="day-low">
                <span className="sr-only">Low </span>
                {fmtTemp(d.min, unit)}
              </span>
              <span className="range" aria-hidden="true">
                <span className="range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
              </span>
              <span className="day-high">
                <span className="sr-only">High </span>
                {fmtTemp(d.max, unit)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
