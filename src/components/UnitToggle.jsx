export default function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit" role="group" aria-label="Temperature unit">
      <button type="button" aria-pressed={unit === "c"} onClick={() => onChange("c")}>
        °C
      </button>
      <button type="button" aria-pressed={unit === "f"} onClick={() => onChange("f")}>
        °F
      </button>
    </div>
  );
}
