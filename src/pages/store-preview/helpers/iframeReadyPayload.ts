import { IFRAME_READY_MESSAGE_KEYS } from '../constants'

export function isIframeReadyPayload(data: unknown): data is { page_id: string; uri: string } {
  if (!data || typeof data !== 'object') {
    return false
  }
  const o = data as Record<string, unknown>
  for (const k of IFRAME_READY_MESSAGE_KEYS) {
    if (!(k in o)) {
      return false
    }
  }
  return typeof o.page_id === 'string'
}
