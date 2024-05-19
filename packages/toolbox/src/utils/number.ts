export function asNumberOr(value: string, fallback = 0): number {
  return typeof value === 'number' ? value : Number.isNaN(Number.parseFloat(value)) ? fallback : Number.parseFloat(value)
}
