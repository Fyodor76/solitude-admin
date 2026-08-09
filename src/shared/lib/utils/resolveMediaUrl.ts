import { CDN_URL } from '@/app/constans/url'

/** Превращает fileId / относитивный путь / полный URL в адрес для <img>. */
export function resolveMediaUrl(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    return trimmed
  }
  const base = (CDN_URL || '').replace(/\/$/, '')
  if (!base) return trimmed
  return `${base}/${trimmed}`
}
