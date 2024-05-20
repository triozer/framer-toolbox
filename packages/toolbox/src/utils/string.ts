/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param value - The string to capitalize.
 *
 * @example
 * ```tsx
 * capitalizeWords("hello world"); // Returns "Hello World"
 * capitalizeWords("javaScript is fun"); // Returns "JavaScript Is Fun"
 * capitalizeWords("capitalize each word"); // Returns "Capitalize Each Word"
 * ```
 *
 * @public
 * @kind utility
 */
export function capitalizeWords(value: string) {
  const re = /(\b[a-z](?!\s))/g

  value = value.replace(re, x => x.toUpperCase())

  return value
}
