import { useForm } from '@/shared/lib/hooks/useForm'
import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'

import { configLogin } from './const/config-login'
import './Login.scss'

type formLoginProps = {
  email: string
  password: string
}

const Login = () => {
  const { form, handleChange } = useForm<formLoginProps>({
    email: '',
    password: '',
  })

  const onLoginFinish = () => {
    console.log('signIn')
  }

  return (
    <div className="login-container">
      <h2 className="source-sans-3-regular title">{configLogin.title}</h2>
      <Card>
        <CustomForm
          configForm={configLogin}
          formData={form}
          onChange={handleChange}
          onFinish={onLoginFinish}
        />
      </Card>
    </div>
  )
}

export default Login
