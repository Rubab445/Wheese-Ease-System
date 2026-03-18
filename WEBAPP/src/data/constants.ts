export const THEME_COLORS = {
  bg: "#f4f7fb",
  white: "#ffffff",
  border: "#e4eaf2",
  text: "#1a2535",
  muted: "#7a8fa8",
  dim: "#b0bfce",
  green: "#22c87a",
  greenBg: "#edfbf4",
  amber: "#f5a623",
  amberBg: "#fff8ed",
  red: "#e8445a",
  redBg: "#fff0f2",
  blue: "#3a8eff",
  blueBg: "#eef5ff",
  shadow: "0 2px 12px rgba(30,60,120,0.07)",
  shadowMd: "0 4px 20px rgba(30,60,120,0.10)",
  radius: "14px",
} as const;

export type ThemeColors = typeof THEME_COLORS;

export const DOCTOR_PROFILE = {
  name: "Dr. A. Rahman",
  specialty: "Pulmonology",
  email: "rahman@wheezeease.health",
  hospital: "Gujranwala General Hospital",
};
