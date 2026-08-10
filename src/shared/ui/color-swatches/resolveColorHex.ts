const NAMED_HEX: Record<string, string> = {
  black: '#1a1a1a',
  white: '#f5f5f5',
  red: '#e11d2e',
  green: '#1bcc3b',
  blue: '#1f4fd8',
  pink: '#fd00a9',
  gray: '#8c8c8c',
  grey: '#8c8c8c',
  beige: '#d8c3a5',
  brown: '#6b3f2a',
  yellow: '#f0c419',
  orange: '#f07a1a',
  purple: '#6b3fa0',
  чёрный: '#1a1a1a',
  черный: '#1a1a1a',
  белый: '#f5f5f5',
  красный: '#e11d2e',
  зеленый: '#1bcc3b',
  зелёный: '#1bcc3b',
  синий: '#1f4fd8',
  розовый: '#fd00a9',
}

function normalizeHex(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null

  const withHash = value.startsWith('#') ? value : `#${value}`
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(withHash)) {
    return withHash.length === 4
      ? `#${withHash[1]}${withHash[1]}${withHash[2]}${withHash[2]}${withHash[3]}${withHash[3]}`
      : withHash
  }

  return null
}

/** HEX из API или запасной по value / displayName / slug. */
export function resolveColorHex(color: {
  hexCode?: string | null
  value?: string | null
  displayName?: string | null
  slug?: string | null
}): string | null {
  const fromApi = color.hexCode ? normalizeHex(color.hexCode) : null
  if (fromApi) return fromApi

  const keys = [color.value, color.displayName, color.slug]
    .filter(Boolean)
    .map(item => item!.trim().toLowerCase())

  for (const key of keys) {
    if (NAMED_HEX[key]) return NAMED_HEX[key]
    const slugTail = key.split('-').pop()
    if (slugTail && NAMED_HEX[slugTail]) return NAMED_HEX[slugTail]
  }

  return null
}

export function isLightHex(hex: string | null | undefined): boolean {
  if (!hex) return false
  const normalized = normalizeHex(hex)
  if (!normalized) return false

  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.82
}
