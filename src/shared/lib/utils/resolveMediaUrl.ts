import { CDN_URL } from '@/app/constans/url'

/**
 * fileId / относительный путь / полный URL → src для <img>.
 * На CDN файлы отдаются с корня: `{CDN}/{fileId}` (без folder).
 */
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
  // Уже абсолютный путь сайта
  if (trimmed.startsWith('/')) {
    return `${CDN_URL}${trimmed}`
  }
  // Иногда приходит `products/fileId` — берём только fileId (как на витрине)
  const fileId = trimmed.includes('/') ? trimmed.split('/').filter(Boolean).pop()! : trimmed
  return `${CDN_URL}/${fileId}`
}
