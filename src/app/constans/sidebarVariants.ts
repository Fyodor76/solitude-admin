import { Variants } from 'framer-motion'

const sidebarWidth = parseInt('280px') || 280
const collapsedWidth = 70

export const sidebarVariants: Variants = {
  collapsed: {
    width: collapsedWidth,
    x: 0,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  open: {
    width: sidebarWidth,
    x: 0,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

export const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
}
