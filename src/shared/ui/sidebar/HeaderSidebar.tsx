import React, { useState } from 'react'

import { Button } from 'antd'
import { motion } from 'framer-motion'

import { menuSidebar } from '@/app/constans/menuSiderbar'

import Icon from '../icons/Icon'
import Portal from '../portal/Portal'
import './headerSidebar.scss'
import Sidebar from './Sidebar'

const HeaderSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div id="header-sidebar" className={isOpen ? 'sidebar-open' : ''}>
      <div className="headerSidebar">
        {' '}
        <Button onClick={toggleSidebar} className="open-sidebar" type="text" shape="circle">
          <motion.div
            className={`burger-arrow ${isOpen ? 'open' : ''}`}
            animate={{
              rotate: isOpen ? 180 : 0,
              x: isOpen ? 210 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, rotate: { duration: 0.3 } }}
          >
            <Icon name="arrow" />
          </motion.div>
        </Button>
      </div>
      <Portal containerId="header-sidebar">
        <Sidebar menuItems={menuSidebar} toggleSidebar={toggleSidebar} isOpen={isOpen} />
      </Portal>
    </div>
  )
}

export default HeaderSidebar
