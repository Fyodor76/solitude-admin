import React from 'react'

import { Button } from 'antd'
import { motion } from 'framer-motion'

import Icon from '../icons/Icon'
import Portal from '../portal/Portal'
import './headerSidebar.scss'

interface HeaderSidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}
const HeaderSidebar = ({ toggleSidebar, isOpen }: HeaderSidebarProps) => {
  return (
    <div id="header-sidebar" className={isOpen ? 'sidebar-open' : ''}>
      <div className="headerSidebar">
        {' '}
        <motion.div
          className={`burger-arrow ${isOpen ? 'open' : ''}`}
          animate={{
            rotate: isOpen ? 180 : 0,
            x: isOpen ? -20 : -20,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, rotate: { duration: 0.3 } }}
        >
          <Button onClick={toggleSidebar} className="open-sidebar" type="text" shape="circle">
            <Icon name="arrow" />
          </Button>
        </motion.div>
      </div>
      {/*<Portal containerId="header-sidebar"></Portal>*/}
    </div>
  )
}

export default HeaderSidebar
