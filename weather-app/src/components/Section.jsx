import { Box, Typography } from "@mui/material";

// A titled block with a divider above it. Used for hourly, daily and conditions.
export default function Section({ id, title, children }) {
  return (
    <Box
      component="section"
      aria-labelledby={id}
      sx={{ mt: 4.5, pt: 2, borderTop: 1, borderColor: "divider" }}
    >
      <Typography id={id} component="h2" variant="subtitle1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
