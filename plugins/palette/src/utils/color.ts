// @ts-expect-error Missing type definitions for ntc-ts
import { ORIGINAL_COLORS, getColorName, initColors } from 'ntc-ts'
// @ts-expect-error Missing type definitions for color-scheme
import ColorScheme from 'color-scheme'
import rgbHex from 'rgb-hex'
import hexRgb from 'hex-rgb'

initColors(ORIGINAL_COLORS)

interface Color {
  r: number
  g: number
  b: number
}

export interface ColorData {
  hex: string
  name: string
  luminance: number
  ratio: number
}

export const COLOR_SCHEMES = [
  'mono',
  'contrast',
  'triade',
  'tetrade',
  'analogic',
] as const
export const COLOR_VARIATIONS = [
  'default',
  'hard',
  'soft',
  'pastel',
  'light',
  'pale',
] as const

export type ColorSchemeType = (typeof COLOR_SCHEMES)[number]
export type ColorVariationType = (typeof COLOR_VARIATIONS)[number]

function generateRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

function prependHash(color: string): `#${string}` {
  return `#${color.toUpperCase()}`
}

function generateRandomColor(): Color {
  return {
    r: generateRandomInt(255),
    g: generateRandomInt(252),
    b: generateRandomInt(254),
  }
}

function generateColorScheme(
  count: number,
  type: ColorSchemeType,
  colorScheme: ColorScheme,
): string[] {
  const baseColors = colorScheme.colors()
  const schemeColors: string[] = []

  const getColor = (index: number) =>
    prependHash(baseColors[index % baseColors.length])

  function selectColorsForScheme(pattern: number[], repeat: boolean = false) {
    const totalColors = repeat ? count : Math.min(count, pattern.length)
    for (let i = 0; i < totalColors; i++) {
      let colorIndex
        = pattern[i % pattern.length] + generateRandomInt(pattern.length)
      let color = getColor(colorIndex)

      while (schemeColors.includes(color)) {
        colorIndex
          = pattern[i % pattern.length] + generateRandomInt(pattern.length)
        color = getColor(colorIndex)
      }

      schemeColors.push(color)
    }
  }

  switch (type) {
    case 'analogic':
      selectColorsForScheme([0, 2, 8, 10], true)
      break
    case 'tetrade':
      selectColorsForScheme([0, 1, 8, 12], true)
      break
    case 'triade':
      selectColorsForScheme([0, 3, 6, 9], true)
      break
    case 'contrast':
      selectColorsForScheme([1, 2, 4, 5], true)
      break
    case 'mono':
      selectColorsForScheme([1, 0, 3, 2], true)
      break
    default:
      schemeColors.fill(prependHash('CECECE'), 0, count)
      break
  }

  return schemeColors
}

function calculateLuminance(r: number, g: number, b: number): number {
  const adjustedColors = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return (
    0.2126 * adjustedColors[0]
    + 0.7152 * adjustedColors[1]
    + 0.0722 * adjustedColors[2]
  )
}

function calculateContrastRatio(color: string): {
  luminance: number
  ratio: number
} {
  const { red, green, blue } = hexRgb(color)
  const luminance = calculateLuminance(red, green, blue)
  return {
    luminance: +luminance.toFixed(2),
    ratio: +(
      luminance > 0.5 ? (luminance + 0.05) / 0.05 : 0.5 / (luminance + 0.05)
    ).toFixed(2),
  }
}

export function generateColorSet(options: {
  baseColor?: `#${string}` | Color
  count?: number
  scheme: ColorSchemeType
  variation: ColorVariationType
}): ColorData[] {
  const scheme = new ColorScheme()
  let baseColorHex = ''

  if (!options.baseColor) {
    const randomColor = generateRandomColor()
    baseColorHex = rgbHex(randomColor.r, randomColor.g, randomColor.b)
  }
  else if (typeof options.baseColor === 'string') {
    baseColorHex = options.baseColor.slice(1)
  }
  else {
    baseColorHex = rgbHex(
      options.baseColor.r,
      options.baseColor.g,
      options.baseColor.b,
    )
  }

  scheme
    .from_hex(baseColorHex)
    .scheme(options.scheme)
    .variation(options.variation)

  const colorScheme = generateColorScheme(
    options.count ?? 3,
    options.scheme,
    scheme,
  )

  return colorScheme.map(color => ({
    hex: color,
    name: getColorName(color).name,
    ...calculateContrastRatio(color),
  }))
}
