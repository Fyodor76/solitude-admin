/** Fallback как на лендинге: fileId лежит в корне CDN, без folder-префикса. */
const DEFAULT_CDN_URL = 'https://cdn.solitude-store.ru'

export const API_URL = import.meta.env.VITE_API_URL
export const CDN_URL = (import.meta.env.VITE_CDN_URL || DEFAULT_CDN_URL).replace(/\/$/, '')
