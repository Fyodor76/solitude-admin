import ApiTest from './ApiTest'
import PublicIcon from './ui/public-icon/PublicIcon'

const MainPage = () => {
  return (
    <div>
      <h1 className="text-h1">
        MainPage
        <PublicIcon name="apple-touch-icon" />
      </h1>
      <ApiTest />
    </div>
  )
}

export default MainPage
