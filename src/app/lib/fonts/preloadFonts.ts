import boldFontUrl from '@/app/assets/fonts/SourceSans3-Bold.ttf?url'
import regularFontUrl from '@/app/assets/fonts/SourceSans3-Regular.ttf?url'

const FONT_FAMILY = 'Source Sans 3'
const LOAD_TIMEOUT_MS = 600

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

/** Предзагрузка шрифтов до первого рендера — без мигания fallback → custom. */
export async function preloadAppFonts(): Promise<void> {
  document.documentElement.classList.add('fonts-loading')

  injectPreload(regularFontUrl)
  injectPreload(boldFontUrl)

  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`400 16px "${FONT_FAMILY}"`),
        document.fonts.load(`700 16px "${FONT_FAMILY}"`),
        document.fonts.ready,
      ]),
      new Promise<void>(resolve => {
        window.setTimeout(resolve, LOAD_TIMEOUT_MS)
      }),
    ])
  } finally {
    document.documentElement.classList.remove('fonts-loading')
    document.documentElement.classList.add('fonts-ready')
  }
}
