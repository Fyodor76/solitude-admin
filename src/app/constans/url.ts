import { normalizeApiBaseUrl } from '@/shared/lib/api/normalizeApiBaseUrl'

export const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
export const CDN_URL = import.meta.env.VITE_CDN_URL
