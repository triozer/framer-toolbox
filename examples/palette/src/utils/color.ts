// @ts-expect-error Missing type definitions for ntc-ts
import { getColorName, initColors, ORIGINAL_COLORS } from "ntc-ts";
// @ts-expect-error Missing type definitions for color-scheme
import ColorScheme from "color-scheme";
import rgbHex from "rgb-hex";
import hexRgb from "hex-rgb";

// Initialize the color module with predefined colors.
initColors(ORIGINAL_COLORS);

// Define types for color and color schemes.
type Color = {
  r: number;
  g: number;
  b: number;
};

export type ColorData = {
  hex: string;
  name: string;
  luminance: number;
  ratio: number;
};

export const COLOR_SCHEMES = [
  "mono",
  "contrast",
  "triade",
  "tetrade",
  "analogic",
] as const;
export const COLOR_VARIATIONS = [
  "default",
  "hard",
  "soft",
  "pastel",
  "light",
  "pale",
] as const;

export type ColorSchemeType = (typeof COLOR_SCHEMES)[number];
export type ColorVariationType = (typeof COLOR_VARIATIONS)[number];

/**
 * Generates a random integer up to a maximum value.
 * @param max The maximum value for the generated integer.
 * @returns A random integer.
 */
function generateRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Converts a color code to a hex format with a leading hash.
 * @param color A string representing the color in hex format without hash.
 * @returns The color string prefixed with a hash.
 */
function prependHash(color: string): `#${string}` {
  return `#${color.toUpperCase()}`;
}

/**
 * Generates a random RGB color.
 * @returns A Color object.
 */
function generateRandomColor(): Color {
  return {
    r: generateRandomInt(255),
    g: generateRandomInt(252),
    b: generateRandomInt(254),
  };
}

/**
 * Generates a color scheme based on the provided parameters.
 * @param count The number of colors to generate in the scheme.
 * @param type The type of color scheme to generate.
 * @param colorScheme An instance of ColorScheme to use for generating colors.
 * @returns An array of colors in hex format.
 */
function generateColorScheme(
  count: number,
  type: ColorSchemeType,
  colorScheme: ColorScheme
): string[] {
  const baseColors = colorScheme.colors();
  const schemeColors: string[] = [];

  // Helper function to safely retrieve and hash a color from baseColors.
  const getColor = (index: number) =>
    prependHash(baseColors[index % baseColors.length]);

  // Modular function to select colors based on different patterns.
  function selectColorsForScheme(pattern: number[], repeat: boolean = false) {
    const totalColors = repeat ? count : Math.min(count, pattern.length);
    for (let i = 0; i < totalColors; i++) {
      let colorIndex =
        pattern[i % pattern.length] + generateRandomInt(pattern.length);
      let color = getColor(colorIndex);

      while (schemeColors.includes(color)) {
        colorIndex =
          pattern[i % pattern.length] + generateRandomInt(pattern.length);
        color = getColor(colorIndex);
      }

      schemeColors.push(color);
    }
  }

  // Switch statement for different scheme logic.
  switch (type) {
    case "analogic":
      selectColorsForScheme([0, 2, 8, 10], true);
      break;
    case "tetrade":
      selectColorsForScheme([0, 1, 8, 12], true);
      break;
    case "triade":
      selectColorsForScheme([0, 3, 6, 9], true);
      break;
    case "contrast":
      selectColorsForScheme([1, 2, 4, 5], true);
      break;
    case "mono":
      selectColorsForScheme([1, 0, 3, 2], true);
      break;
    default:
      schemeColors.fill(prependHash("CECECE"), 0, count);
      break;
  }

  return schemeColors;
}

/**
 * Calculates the luminance of an RGB color.
 * @param r Red component of the color.
 * @param g Green component of the color.
 * @param b Blue component of the color.
 * @returns The calculated luminance.
 */
function calculateLuminance(r: number, g: number, b: number): number {
  const adjustedColors = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return (
    0.2126 * adjustedColors[0] +
    0.7152 * adjustedColors[1] +
    0.0722 * adjustedColors[2]
  );
}

/**
 * Calculates the contrast ratio for a given color against white background.
 * @param color Hex color code as a string.
 * @returns The contrast ratio.
 */
function calculateContrastRatio(color: string): {
  luminance: number;
  ratio: number;
} {
  const { red, green, blue } = hexRgb(color);
  const luminance = calculateLuminance(red, green, blue);
  return {
    luminance: +luminance.toFixed(2),
    ratio: +(
      luminance > 0.5 ? (luminance + 0.05) / 0.05 : 0.5 / (luminance + 0.05)
    ).toFixed(2),
  };
}

/**
 * Generates a set of colors with their names and contrast ratios.
 * @param options Configuration options including base color, scheme type, and variation.
 * @returns An array of ColorData.
 */
export function generateColorSet(options: {
  baseColor?: `#${string}` | Color;
  count?: number;
  scheme: ColorSchemeType;
  variation: ColorVariationType;
}): ColorData[] {
  const scheme = new ColorScheme();
  let baseColorHex = "";

  // Determine base color in hex format
  if (!options.baseColor) {
    const randomColor = generateRandomColor();
    baseColorHex = rgbHex(randomColor.r, randomColor.g, randomColor.b);
  } else if (typeof options.baseColor === "string") {
    baseColorHex = options.baseColor.slice(1);
  } else {
    baseColorHex = rgbHex(
      options.baseColor.r,
      options.baseColor.g,
      options.baseColor.b
    );
  }

  scheme
    .from_hex(baseColorHex)
    .scheme(options.scheme)
    .variation(options.variation);

  const colorScheme = generateColorScheme(
    options.count ?? 3,
    options.scheme,
    scheme
  );

  return colorScheme.map((color) => ({
    hex: color,
    name: getColorName(color).name,
    ...calculateContrastRatio(color),
  }));
}
