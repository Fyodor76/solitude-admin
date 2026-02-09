import React, { useState } from 'react'

import { Button } from 'antd'
import { motion } from 'framer-motion'

import { menuSidebar } from '@/app/constans/menuSiderbar'
import Portal from '@/app/portal/Portal'

import './headerSidebar.scss'
import Sidebar from './Sidebar'

const HeaderSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div id="header-sidebar">
      <div className="headerSidebar">
        {' '}
        <Button onClick={toggleSidebar} className="open-sidebar">
          <motion.div
            className={`burger-dots ${isOpen ? 'open' : ''}`}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
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
