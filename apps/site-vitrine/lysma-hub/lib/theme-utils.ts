import type { SiteTheme } from "./site-types";

const clamp = (value: number) => Math.max(0, Math.min(255, value));

const hexToRgb = (hex: string) => {
  const safe = hex.replace("#", "");
  const value = safe.length === 3 ? safe.split("").map((char) => char + char).join("") : safe;
  const parsed = Number.parseInt(value, 16);

  if (Number.isNaN(parsed)) {
    return { r: 15, g: 23, b: 42 };
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((value) => clamp(value).toString(16).padStart(2, "0")).join("")}`;

export const mixColors = (from: string, to: string, weight = 0.5) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const ratio = Math.max(0, Math.min(1, weight));

  return rgbToHex(
    Math.round(a.r + (b.r - a.r) * ratio),
    Math.round(a.g + (b.g - a.g) * ratio),
    Math.round(a.b + (b.b - a.b) * ratio),
  );
};

export const alphaColor = (hex: string, alpha: number) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, alpha))})`;
};

export const getRadiusValue = (theme: SiteTheme) => {
  if (theme.radius === "large") return "28px";
  if (theme.radius === "medium") return "20px";
  return "14px";
};

export const getThemeTokens = (theme: SiteTheme) => ({
  gradient: `linear-gradient(135deg, ${theme.primaryColor}, ${mixColors(theme.primaryColor, theme.secondaryColor, 0.72)})`,
  heroGradient: `radial-gradient(circle at 16% 12%, ${alphaColor(theme.secondaryColor, 0.28)}, transparent 32rem), linear-gradient(135deg, ${theme.primaryColor}, ${mixColors(theme.primaryColor, "#020617", 0.72)})`,
  cardColor: alphaColor("#ffffff", theme.style === "sobre" ? 0.82 : 0.72),
  borderColor: alphaColor(theme.secondaryColor, 0.2),
  softShadow: `0 24px 80px ${alphaColor(theme.shadowColor, 0.22)}`,
  buttonHover: mixColors(theme.secondaryColor, "#ffffff", 0.18),
  mutedText: alphaColor(theme.textColor, 0.68),
  radius: getRadiusValue(theme),
});
