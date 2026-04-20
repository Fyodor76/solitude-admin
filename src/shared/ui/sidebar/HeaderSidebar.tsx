import { Button } from 'antd'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Icon from '../icons/Icon'
import './headerSidebar.scss'

interface HeaderSidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}
const HeaderSidebar = ({ toggleSidebar, isOpen }: HeaderSidebarProps) => {
  return (
    <div className="header-sidebar-container">
      <motion.div
        id="header-sidebar"
        className={isOpen ? 'sidebar-open' : ''}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className="headerSidebar">
          <motion.div
            className={`burger-arrow ${isOpen ? 'open' : ''}`}
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <Button onClick={toggleSidebar} className="open-sidebar" type="text" shape="circle">
              <Icon name="arrow" />
            </Button>
          </motion.div>
        </div>
        {/*<Portal containerId="header-sidebar"></Portal>*/}
      </motion.div>
      <div className="link-text">
        <Link to="#" className="text-home">
          Home
        </Link>
        <Link to="#" className="text-contact">
          Contact
        </Link>
      </div>
    </div>
  )
}

export default HeaderSidebar
