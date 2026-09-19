import { useEffect, useId, useRef, useState } from "react";
import { searchCities } from "../api.js";

export default function SearchBar({ onSelect, onLocate, locating }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("idle"); // idle | loading | done | error
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;

  // Debounced search: wait 300ms after the last keystroke, cancel stale requests.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchState("idle");
      return;
    }
    const controller = new AbortController();
    setSearchState("loading");
    const timer = setTimeout(async () => {
      try {
        const found = await searchCities(q, controller.signal);
        setResults(found);
        setActive(-1);
        setSearchState("done");
      } catch (err) {
        if (err.name !== "AbortError") setSearchState("error");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close the list when clicking outside the search box.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const choose = (place) => {
    onSelect(place);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const pick = results[active] ?? results[0];
      if (pick) {
        e.preventDefault();
        choose(pick);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const trimmed = query.trim();
  const showList = open && trimmed.length >= 2;

  return (
    <div className="search" role="search" ref={rootRef}>
      <div className="search-field">
        <label htmlFor={inputId} className="sr-only">
          Search for a city
        </label>
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck="false"
          placeholder="Search for a city"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {showList && (
          <ul id={listId} role="listbox" className="suggestions">
            {results.map((r, i) => (
              <li
                key={r.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="suggestion"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(r)}
                onMouseEnter={() => setActive(i)}
              >
                <span>{r.name}</span>
                <span className="suggestion-sub">
                  {[r.region, r.country].filter(Boolean).join(", ")}
                </span>
              </li>
            ))}
            {results.length === 0 && (
              <li className="suggestion-note" role="presentation">
                {searchState === "error"
                  ? "Couldn't search right now. Check your connection and try again."
                  : searchState === "done"
                  ? `No cities match "${trimmed}". Check the spelling or try a nearby city.`
                  : "Searching…"}
              </li>
            )}
          </ul>
        )}
      </div>

      <button type="button" className="link-button" onClick={onLocate} disabled={locating}>
        {locating ? "Locating…" : "Use my location"}
      </button>
    </div>
  );
}
