import type { ApiResponse } from '@/shared/lib/api/baseApi'
import type { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'

/** RTK unwrap отдаёт ApiResponse; на всякий случай поддерживаем вложенный data. */
export function extractMediaUrl(
  response:
    | ApiResponse<imgUpload | { url: string }>
    | imgUpload
    | { url?: string }
    | null
    | undefined
): string | null {
  if (!response || typeof response !== 'object') {
    return null
  }

  if ('url' in response && typeof response.url === 'string' && response.url.length > 0) {
    return response.url
  }

  if ('data' in response && response.data && typeof response.data === 'object') {
    const inner = response.data as { url?: string }
    if (typeof inner.url === 'string' && inner.url.length > 0) {
      return inner.url
    }
  }

  return null
}
