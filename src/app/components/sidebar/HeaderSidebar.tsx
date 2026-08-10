import { Link } from 'react-router-dom'

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
