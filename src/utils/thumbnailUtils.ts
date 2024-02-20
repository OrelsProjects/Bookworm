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
