import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { searchCities } from "../api.js";

export default function SearchBar({ onSelect, onLocate, locating }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("idle"); // idle | loading | done | error

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

  const trimmed = query.trim();
  const noOptionsText =
    trimmed.length < 2
      ? "Type at least 2 letters."
      : searchState === "error"
      ? "Couldn't search right now. Check your connection and try again."
      : `No cities match "${trimmed}". Check the spelling or try a nearby city.`;

  return (
    <Box
      role="search"
      sx={{ flex: "1 1 20rem", display: "flex", alignItems: "flex-end", gap: 2.5 }}
    >
      <Autocomplete
        sx={{ flex: 1 }}
        options={results}
        // The box only searches; it never holds a "selected" city.
        value={null}
        inputValue={query}
        onInputChange={(_, value) => setQuery(value)}
        onChange={(_, place) => {
          if (!place) return;
          onSelect(place);
          setQuery("");
          setResults([]);
        }}
        // Results are already filtered by the geocoding API.
        filterOptions={(options) => options}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        loading={searchState === "loading"}
        loadingText="Searching…"
        noOptionsText={noOptionsText}
        forcePopupIcon={false}
        autoHighlight
        blurOnSelect
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          const sub = [option.region, option.country].filter(Boolean).join(", ");
          return (
            <li key={key} {...rest}>
              <Box>
                <Typography>{option.name}</Typography>
                {sub && (
                  <Typography variant="body2" color="text.secondary">
                    {sub}
                  </Typography>
                )}
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Search for a city"
            slotProps={{
              ...params.slotProps,
              htmlInput: { ...params.slotProps.htmlInput, "aria-label": "Search for a city" },
            }}
            sx={{ "& input": { fontSize: "1.125rem", py: 1 } }}
          />
        )}
      />

      <Button
        color="inherit"
        onClick={onLocate}
        disabled={locating}
        startIcon={<MyLocationIcon />}
        sx={{ whiteSpace: "nowrap", pb: 1 }}
      >
        {locating ? "Locating…" : "Use my location"}
      </Button>
    </Box>
  );
}
