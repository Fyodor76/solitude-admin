import boldFontUrl from '@/app/assets/fonts/SourceSans3-Bold.ttf?url'
import regularFontUrl from '@/app/assets/fonts/SourceSans3-Regular.ttf?url'

const FONT_FAMILY = 'Source Sans 3'

function injectPreload(href: string) {
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/ttf'
  link.crossOrigin = 'anonymous'
  link.href = href
  document.head.appendChild(link)
}

/** Предзагрузка шрифтов до первого рендера — убирает мигание fallback → custom. */
export async function preloadAppFonts(timeoutMs = 150): Promise<void> {
  injectPreload(regularFontUrl)
  injectPreload(boldFontUrl)

  await Promise.race([
    Promise.all([
      document.fonts.load(`400 16px "${FONT_FAMILY}"`),
      document.fonts.load(`700 16px "${FONT_FAMILY}"`),
    ]),
    new Promise<void>(resolve => {
      window.setTimeout(resolve, timeoutMs)
    }),
  ])
}
