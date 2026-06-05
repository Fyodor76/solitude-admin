/**
 * Совпадение pathname с маршрутом приложения (включая вложенные пути).
 */
export function matchRoutePath(pathname: string, routePath: string): boolean {
  if (routePath === '/') {
    return pathname === '/'
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`)
}
