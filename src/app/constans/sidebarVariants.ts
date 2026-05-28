import { Variants } from 'framer-motion'

const sidebarWidth = parseInt('280px') || 280
const collapsedWidth = 70

export const sidebarVariants: Variants = {
  collapsed: {
    width: collapsedWidth,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  open: {
    width: sidebarWidth,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

export const overlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}
