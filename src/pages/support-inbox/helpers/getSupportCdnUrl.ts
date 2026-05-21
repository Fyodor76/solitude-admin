import { CDN_URL } from '@/app/constans/url'

const CDN_BASE = CDN_URL?.replace(/\/+$/, '')

export function getSupportCdnUrl(fileId: string): string {
  if (!fileId) return ''
  if (fileId.startsWith('http://') || fileId.startsWith('https://')) return fileId
  if (CDN_BASE) return `${CDN_BASE}/${fileId}`
  return `/${fileId}`
}
