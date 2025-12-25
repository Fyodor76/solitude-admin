import ApiTest from './ApiTest'
import ApiTestCdn from './ApiTestCdn'
import TestTodos from './TestTodos'

const MainPage = () => {
  return (
    <div>
      <h1>Главная страница</h1>
      <ApiTest />
      <ApiTestCdn />
      <TestTodos />
    </div>
  )
}

export default MainPage
