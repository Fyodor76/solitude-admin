import { ROUTES } from '@/app/lib/config/navigation'

export const APP_DOCUMENT_TITLE = 'Solitude Store Admin'

export function getRouteDocumentLabel(pathname: string): string {
  if (pathname === ROUTES.HOME.path) {
    return ROUTES.HOME.label
  }

  const match = Object.values(ROUTES)
    .filter(route => route.path !== ROUTES.HOME.path)
    .filter(route => pathname === route.path || pathname.startsWith(`${route.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]

  return match?.label ?? ROUTES.HOME.label
}

export function buildDocumentTitle(pageLabel: string): string {
  const pagePrefix = pageLabel !== ROUTES.HOME.label ? `${pageLabel} — ` : ''

  return `${pagePrefix}${APP_DOCUMENT_TITLE}`
}
