import { Book } from "../models";

type RGBA = [number, number, number, number];
type RGB = [number, number, number];

const extractRGBFromString = (
  rgbString: string,
  defaultValue: RGB = [0, 0, 0]
): RGB => {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) {
    return defaultValue;
  }
  return match.slice(1, 4).map(Number) as RGB;
};

export function darkenColor(
  rgb?: string,
  darkenPercent: number = 10
): string | undefined {
  if (!rgb) return rgb;

  let [r, g, b] = extractRGBFromString(rgb);

  const subtract = (colorValue: number) => {
    return Math.max(
      0,
      colorValue - Math.round((colorValue * darkenPercent) / 100)
    );
  };

  r = subtract(r);
  g = subtract(g);
  b = subtract(b);

  return `rgb(${r}, ${g}, ${b})`;
}

export function increaseLuminosity(
  rgbString?: string,
  percentage: number = 40
): string | undefined {
  if (!rgbString) {
    return rgbString;
  }

  // Parse the R, G, B values from the string
  let [r, g, b] = extractRGBFromString(rgbString);

  // Function to calculate the increased luminosity without exceeding 255
  const increase = (color: number): number => {
    return Math.min(255, color + (255 - color) * (percentage / 100));
  };

  // Apply the increase function to each color component
  r = increase(r);
  g = increase(g);
  b = increase(b);

  // Return the updated RGB string
  return `rgb(${r}, ${g}, ${b})`;
}