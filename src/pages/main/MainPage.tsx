import PublicIcon from '../../shared/ui/public-icon/PublicIcon'
import SizeChart from '../size-charts/SizeChart'

const MainPage = () => {
  return (
    <div>
      <h1 className="text-h1">
        <PublicIcon name="apple-touch-icon" />
        Главная страница (Main Page)
      </h1>
      <SizeChart />
    </div>
  )
}

export default MainPage
