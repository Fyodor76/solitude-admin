import { CDN_URL } from '@/app/constans/url'

/** fileId или полный URL → src. Пока файлы в корне CDN: `{CDN}/{fileId}`. */
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
  return `${CDN_URL}/${trimmed.replace(/^\/+/, '')}`
}
