export function darkenColor(
  rgb?: string,
  darkenPercent: number = 20
): string | undefined {
  // Parse the RGB values from the string
  const colorMatch = rgb?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!colorMatch) {
    return rgb;
  }

  // Extract individual color components
  let [r, g, b] = colorMatch.slice(1).map(Number);

  // Calculate the amount to subtract from each color component
  const subtract = (colorValue: number) => {
    return Math.max(
      0,
      colorValue - Math.round((colorValue * darkenPercent) / 100)
    );
  };

  // Apply the darkness
  r = subtract(r);
  g = subtract(g);
  b = subtract(b);

  // Return the darkened color in RGB format
  return `rgb(${r}, ${g}, ${b})`;
}

export function increaseLuminosity(
  rgbString?: string,
  percentage: number = 40
): string | undefined {
  if (!rgbString) {
    return rgbString;
  }
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const match = rgbString.match(rgbRegex);

  if (!match) {
    throw new Error("Invalid RGB color format");
  }

  // Parse the R, G, B values from the string
  let [r, g, b] = match.slice(1, 4).map(Number);

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
