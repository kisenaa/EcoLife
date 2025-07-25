const palette = {
  // A neutral scale from off-white/mint to a dark forest green
  neutral100: "#F8FBF8", // Very light off-white with a hint of green (for backgrounds)
  neutral200: "#F8FBF8", // Soft mint green (for separators, subtle backgrounds)
  neutral300: "#C8E6C9",
  neutral400: "#A5D6A7",
  neutral500: "#81C784", // A mid-tone gray-green (for disabled states, dim text)
  neutral600: "#66BB6A",
  neutral700: "#43A047", // A strong, dark green (for icons)
  neutral800: "#2E7D32", // A very dark green (for primary text)
  neutral900: "#1B5E20", // The darkest green

  // A vibrant, leafy green for primary actions
  primary100: "#C8E6C9",
  primary200: "#A5D6A7",
  primary300: "#81C784",
  primary400: "#66BB6A",
  primary500: "#4CAF50", // The main brand green
  primary600: "#388E3C", // A darker shade for pressed states

  // A warm, earthy brown for secondary elements
  secondary100: "#D7CCC8",
  secondary200: "#BCAAA4",
  secondary300: "#A1887F",
  secondary400: "#8D6E63",
  secondary500: "#795548", // The main secondary brown

  // A sunny yellow for accents and highlights
  accent100: "#FFF9C4",
  accent200: "#FFF59D",
  accent300: "#FFF176",
  accent400: "#FFEE58",
  accent500: "#FFEB3B", // The main accent yellow

  // A standard red for errors
  angry100: "#FFCDD2",
  angry500: "#D32F2F",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
