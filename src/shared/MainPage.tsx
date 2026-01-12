import ApiTest from './ApiTest'
import ApiTestCdn from './ApiTestCdn'
import PublicIcon from './ui/public-icon/PublicIcon'

const MainPage = () => {
  return (
    <div>
      <h1 className="text-h1">
        MainPage
        <PublicIcon name="apple-touch-icon" />
      </h1>
      <ApiTest />
      <h1>Главная страница</h1>
      <ApiTest />
      <ApiTestCdn />
    </div>
  )
}

export default MainPage
