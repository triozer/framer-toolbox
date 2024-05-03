export function capitalizeWords(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
