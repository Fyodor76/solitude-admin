import { useValidation } from '@/context/validation/use-validation'
import { useLoginMutation } from '@/shared/lib/api/auth/auth'
import { useForm } from '@/shared/lib/hooks/useForm'
import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { useNavigate } from 'react-router-dom'

import { configLogin } from './const/config-login'
import './Login.scss'
import { LoginType } from './types'

const Login = () => {
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const { form, handleChange } = useForm<LoginType>({
    login: '',
    password: '',
  })
  const { errors, applyServerErrors } = useValidation()

  const onLoginFinish = async () => {
    try {
      const payload = { login: form.login, password: form.password }

      const response = await login(payload).unwrap()

      localStorage.setItem('refresh', response.refreshToken)
      localStorage.setItem('access', response.accessToken)

      navigate('/')
    } catch (error: any) {
      const { error: dataError } = error
      applyServerErrors({
        ...dataError,
      })
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
          errors={errors}
        />
      </Card>
    </div>
  )
}

export default Login
