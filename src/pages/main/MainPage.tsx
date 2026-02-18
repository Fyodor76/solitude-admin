import TestApiCategories from '@/shared/lib/api/api-categories/TestApiCategories'
import TestApiError from '@/shared/lib/api/TestApiError'
import { TestCrash } from '@/TestCrash'
import { Link } from 'react-router-dom'
import Sidebar from '@/shared/ui/sidebar/Sidebar'
import { TestCrash } from '@/TestCrash'

import PublicIcon from '../../shared/ui/public-icon/PublicIcon'
import CatalogPage from '../test/CatalogPage'
import TshortsPage from '../test/TshortsPage'

const MainPage = () => {
  return (
    <div>
      <h1 className="text-h1">
        MainPage
        {/*<TestCrash />*/}
        <PublicIcon name="apple-touch-icon" />
        {/*<TestApiCategories />*/}
        {/*<TestApiError />*/}
      </h1>
      <h1>Главная страница</h1>
    </div>
  )
}

export default MainPage
