import type { ThemeConfig } from 'antd'

/** Sidebar z-index до 1020 — см. Sidebar.scss */
const appFontFamily = "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export const antdTheme: ThemeConfig = {
  token: {
    fontFamily: appFontFamily,
    fontSize: 16,
    zIndexPopupBase: 1100,
  },
}
