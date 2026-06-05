import React from 'react'

import { Button } from 'antd'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Icon from '../../../shared/ui/icons/Icon'
import './HeaderSidebar.scss'

/*interface HeaderSidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}*/
const HeaderSidebar = () => {
  return (
    <div className="link-text">
      <Link to="/" className="text-home">
        Home
      </Link>
    </div>
  )
}

export default HeaderSidebar
