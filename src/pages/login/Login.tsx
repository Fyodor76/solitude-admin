import { useLoginMutation } from '@/shared/lib/api/auth/auth'
import { useForm } from '@/shared/lib/hooks/useForm'
import { consumePendingPushHref } from '@/shared/lib/push/pushNavigation'
import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { useNavigate } from 'react-router-dom'

import { configLogin } from './const/config-login'
import './Login.scss'

type formLoginProps = {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const { form, handleChange } = useForm<formLoginProps>({
    email: '',
    password: '',
  })

  const onLoginFinish = async () => {
    try {
      if (form.email === '' && form.password === '') return
      const response = await login({ login: form.email, password: form.password }).unwrap()

      localStorage.setItem('refresh', response.refreshToken)
      localStorage.setItem('access', response.accessToken)

      const pendingHref = consumePendingPushHref()
      navigate(pendingHref ?? '/')
    } catch (error) {
      console.log(error, 'error')
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="login-container">
      <h2 className="source-sans-3-regular title">{configLogin.title}</h2>
      <Card>
        <CustomForm
          formData={form}
          configForm={configLogin}
          onChange={handleChange}
          onFinish={onLoginFinish}
        />
      </Card>
    </div>
  )
}

export default Login
