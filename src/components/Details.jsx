import { clock, compass, fmtSpeed, uvLabel } from "../utils.js";

export default function Details({ current, today, unit }) {
  const rows = [
    ["Humidity", `${Math.round(current.humidity)}%`],
    ["Wind", `${fmtSpeed(current.windSpeed, unit)} from ${compass(current.windDir)}`],
    ["Pressure", `${Math.round(current.pressure)} hPa`],
    ["UV index today", uvLabel(today.uv)],
    ["Chance of rain today", `${today.pop}%`],
    ["Sunrise", clock(today.sunrise)],
    ["Sunset", clock(today.sunset)],
  ];

  return (
    <section className="section" aria-labelledby="details-title">
      <h2 id="details-title">Conditions</h2>
      <dl className="details">
        {rows.map(([term, value]) => (
          <div className="row" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
