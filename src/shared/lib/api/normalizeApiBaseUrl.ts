export function normalizeApiBaseUrl(raw: string | undefined): string {
  const s = (raw ?? '').trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) {
    return s.replace(/\/+$/, '')
  }
  return `https://${s.replace(/^\/+/, '')}`.replace(/\/+$/, '')
}
