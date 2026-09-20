import { alpha, createTheme } from "@mui/material/styles";

export const DISPLAY = '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif';
const TEXT = '"Instrument Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

// One entry per sky. The names match what describe() in weatherCodes.js returns.
//   ink    = text colour        top/bottom = ends of the sky gradient
// Keep `ink` readable against both gradient colours when you edit these.
export const SKIES = {
  "clear-day": { mode: "light", ink: "#10263d", top: "#8ec9f2", bottom: "#f1e4b8" },
  "clear-night": { mode: "dark", ink: "#eef2ff", top: "#0b1530", bottom: "#2b4173" },
  cloudy: { mode: "light", ink: "#17202a", top: "#a3afbb", bottom: "#d6dce2" },
  "cloudy-night": { mode: "dark", ink: "#e8edf2", top: "#1d2530", bottom: "#46525f" },
  rain: { mode: "dark", ink: "#f1f5f9", top: "#33424f", bottom: "#566a7c" },
  snow: { mode: "light", ink: "#1c2b3a", top: "#cfdce8", bottom: "#f6f9fc" },
  storm: { mode: "dark", ink: "#f4f0ff", top: "#1a1730", bottom: "#453a63" },
  fog: { mode: "light", ink: "#26251f", top: "#b4b3aa", bottom: "#dedcd3" },
};

export function buildTheme(name = "clear-day") {
  const { mode, ink, top, bottom } = SKIES[name] ?? SKIES["clear-day"];
  const soft = alpha(ink, 0.78);
  const headings = { fontFamily: DISPLAY, letterSpacing: "-0.01em" };

  return createTheme({
    palette: {
      mode,
      primary: { main: ink, contrastText: bottom },
      text: { primary: ink, secondary: soft },
      divider: alpha(ink, 0.22),
      background: { default: bottom, paper: mode === "light" ? "#ffffff" : top },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: TEXT,
      h1: { ...headings, fontWeight: 600, lineHeight: 1.1 },
      h2: { ...headings, fontWeight: 600 },
      h3: { ...headings, fontWeight: 600 },
      h4: { ...headings, fontWeight: 600 },
      h5: { ...headings, fontWeight: 500, lineHeight: 1.2 },
      h6: { ...headings, fontWeight: 500 },
      subtitle1: { fontWeight: 600 },
    },
    components: {
      // The sky gradient lives on <body>.
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: "100vh",
            backgroundColor: bottom,
            backgroundImage: `linear-gradient(to bottom, ${top}, ${bottom})`,
            backgroundAttachment: "fixed",
            WebkitFontSmoothing: "antialiased",
          },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              transitionDuration: "0.01ms !important",
              animationDuration: "0.01ms !important",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: { root: { textTransform: "none", fontWeight: 500 } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            minWidth: 52,
            textTransform: "none",
            fontWeight: 500,
            color: ink,
            borderColor: alpha(ink, 0.5),
            "&.Mui-selected, &.Mui-selected:hover": {
              color: bottom,
              backgroundColor: ink,
            },
          },
        },
      },
      // Standard (underline) text field: make the line and placeholder readable on the sky.
      MuiInput: {
        styleOverrides: {
          root: {
            "&::before": { borderBottomColor: soft },
            "&:hover:not(.Mui-disabled, .Mui-error)::before": { borderBottomColor: ink },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: { "&::placeholder": { color: soft, opacity: 1 } },
        },
      },
    },
  });
}
