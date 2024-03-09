import Jimp from "jimp";

type RGBColorString = string;
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0; // Default to 0 to ensure h is always assigned
  let s,
    l = (max + min) / 2;

  if (max === min) {
    s = 0; // Achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function increaseVibrancy(
  r: number,
  g: number,
  b: number,
  increaseFactor: number = 0.5
) {
  let [h, s, l] = rgbToHsl(r, g, b);
  s += s * increaseFactor; // Increase the saturation by the increaseFactor
  s = Math.min(1, Math.max(0, s)); // Ensure saturation remains between 0 and 1
  const rgb = hslToRgb(h, s, l);
  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  };
}

/**
 * Gets the average color of an image using Jimp.
 * @param imageUrl The URL of the image.
 * @returns A promise that resolves to a string representing the RGB color in the format "rgb(r, g, b)".
 */
export async function getAverageColor(
  imageUrl?: string | null
): Promise<RGBColorString | undefined> {
  if (!imageUrl) return "rgb(0,0,0)";
  try {
    const image = await Jimp.read(imageUrl);
    let total = { r: 0, g: 0, b: 0, count: 0 };

    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      function (_, __, idx) {
        total.r += this.bitmap.data[idx + 0];
        total.g += this.bitmap.data[idx + 1];
        total.b += this.bitmap.data[idx + 2];
        total.count++;
      }
    );

    const averageColor = {
      r: Math.round(total.r / total.count),
      g: Math.round(total.g / total.count),
      b: Math.round(total.b / total.count),
    };
    const vibrantColor = increaseVibrancy(
      averageColor.r,
      averageColor.g,
      averageColor.b
    );
    return `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
  } catch (error) {
    console.error("Error getting average color:", error);
    return "rgb(0,0,0)";
  }
}
