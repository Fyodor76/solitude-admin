import type { ThemeConfig } from 'antd'

/** Sidebar z-index до 1020 — см. Sidebar.scss */
export const antdTheme: ThemeConfig = {
  token: {
    zIndexPopupBase: 1100,
  },
}
