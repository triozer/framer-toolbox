export function capitalizeWords(value: string) {
  const re = /(\b[a-z](?!\s))/g

  value = value.replace(re, x => x.toUpperCase())

  return value
}
