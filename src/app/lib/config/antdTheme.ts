import type { ThemeConfig } from 'antd'

/** Sidebar z-index до 1020 — см. Sidebar.scss */
const appFontFamily = "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

export const antdTheme: ThemeConfig = {
  token: {
    fontFamily: appFontFamily,
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    colorText: '#223041',
    colorTextSecondary: '#556476',
    colorTextTertiary: '#8c8c8c',
    colorTextPlaceholder: '#939ba2',
    colorBorder: '#e6ebf2',
    colorBgContainer: '#ffffff',
    borderRadius: 8,
    zIndexPopupBase: 1100,
  },
}
