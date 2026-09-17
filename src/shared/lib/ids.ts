/** Stable, readable identifier for records created during the demo. */
export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now().toString(36)}${random}`
}

/** Removes accents and non alphanumeric characters for search comparisons. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Case and accent insensitive containment check. */
export function matchesSearch(value: string, search: string): boolean {
  const term = normalizeText(search)
  if (!term) return true
  return normalizeText(value).includes(term)
}
