const palette = {
  // Forest eco-friendly palette
  neutral100: "#F6FAF7", // very light greenish
  neutral200: "#E3EFE3", // light green
  neutral300: "#C8E6C9", // soft green
  neutral400: "#A5D6A7", // muted green
  neutral500: "#81C784", // mid green
  neutral600: "#388E3C", // strong green
  neutral700: "#2E7031", // deep forest green
  neutral800: "#1B5E20", // very dark green
  neutral900: "#10281A", // almost black-green

  primary100: "#EDE6D6", // light earth
  primary200: "#D6C7A1",
  primary300: "#BCA77B",
  primary400: "#A1885E",
  primary500: "#8D6E63", // earth brown
  primary600: "#6D4C41",

  secondary100: "#FFF8E1", // soft yellow
  secondary200: "#FFECB3",
  secondary300: "#FFE082",
  secondary400: "#FFD54F",
  secondary500: "#FFB300", // golden accent

  accent100: "#D0F8CE", // mint accent
  accent200: "#A3E9A4",
  accent300: "#72D572",
  accent400: "#42BD41",
  accent500: "#2BAF2B", // vibrant green

  angry100: "#FFCDD2",
  angry500: "#D32F2F",
} as const;

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral100,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const;
