const palette = {
  // Forest eco-friendly palette (dark)
  neutral100: "#10281A", // almost black-green
  neutral200: "#1B5E20", // very dark green
  neutral300: "#2E7031",
  neutral400: "#388E3C",
  neutral500: "#4CAF50", // mid green
  neutral600: "#81C784", // soft green
  neutral700: "#A5D6A7", // muted green
  neutral800: "#C8E6C9", // light green
  neutral900: "#E3EFE3", // very light greenish

  primary100: "#6D4C41", // dark earth
  primary200: "#8D6E63",
  primary300: "#A1885E",
  primary400: "#BCA77B",
  primary500: "#D6C7A1", // earth brown
  primary600: "#EDE6D6",

  secondary100: "#3E2723", // deep brown
  secondary200: "#5D4037",
  secondary300: "#795548",
  secondary400: "#A1887F",
  secondary500: "#D7CCC8", // light brown accent

  accent100: "#263238", // dark mint
  accent200: "#37474F",
  accent300: "#607D8B",
  accent400: "#90A4AE",
  accent500: "#B0BEC5", // light mint

  angry100: "#FFCDD2",
  angry500: "#D32F2F",
} as const;

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral900,
  textDim: palette.neutral700,
  background: palette.neutral100,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const;
