import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'

import { configLogin } from './const/config-login'
import './Login.scss'

const Login = () => {
  return (
    <div className="login-container">
      <h2 className="source-sans-3-regular title">{configLogin.title}</h2>
      <Card>
        <CustomForm configForm={configLogin as any} />
      </Card>
    </div>
  )
}

export default Login
