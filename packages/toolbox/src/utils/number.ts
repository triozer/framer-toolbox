/**
 * Converts a string to a number, or returns a fallback value if the conversion is not possible.
 *
 * @param value - The string to convert to a number.
 * @param fallback - The value to return if the conversion is not possible. Defaults to 0.
 *
 * @example
 * ```tsx
 * asNumberOr("42");        // Returns 42
 * ```
 * 
 * @example
 * ```tsx
 * asNumberOr("123.45");    // Returns 123.45
 * ```
 *
 * @example
 * ```tsx
 * asNumberOr("abc", 10);   // Returns 10
 * ```
 *
 * @example
 * ```tsx
 * asNumberOr("NaN");       // Returns 0
 * ```
 *
 * @example
 * ```tsx
 * asNumberOr("NaN", 5);    // Returns 5
 * ```
 *
 * @public
 * @kind utility
 */
export function asNumberOr(value: string, fallback = 0): number {
  return typeof value === 'number' ? value : Number.isNaN(Number.parseFloat(value)) ? fallback : Number.parseFloat(value)
}
