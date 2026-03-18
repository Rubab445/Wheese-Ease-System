import { THEME_COLORS } from "../data/constants";

export const riskColor = (r) =>
  r >= 61
    ? THEME_COLORS.red
    : r >= 31
      ? THEME_COLORS.amber
      : THEME_COLORS.green;

export const riskBg = (r) =>
  r >= 61
    ? THEME_COLORS.redBg
    : r >= 31
      ? THEME_COLORS.amberBg
      : THEME_COLORS.greenBg;

export const riskLabel = (r) =>
  r >= 61 ? "High" : r >= 31 ? "Moderate" : "Low";

export const riskClass = (r) => (r >= 61 ? "high" : r >= 31 ? "mod" : "low");

export const trendArrow = (t) => (t === "up" ? "↑" : t === "down" ? "↓" : "→");

export const trendClass = (t) =>
  t === "up" ? "up" : t === "down" ? "down" : "flat";

export const formatTime = () => {
  const now = new Date();
  return (
    now.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }) +
    " · " +
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
