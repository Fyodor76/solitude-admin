import { useValidation } from '@/context/validation/use-validation'
import { useLoginMutation } from '@/shared/lib/api/auth/auth'
import { useForm } from '@/shared/lib/hooks/useForm'
import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { useNavigate } from 'react-router-dom'

import { configLogin } from './const/config-login'
import './Login.scss'

type formLoginProps = {
  login: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
  const { form, handleChange } = useForm<formLoginProps>({
    login: '',
    password: '',
    house: {
      name: '1',
    },
    people: {
      user: {
        name: 'fydor',
      },
    },
  })
  const { errors, applyServerErrors } = useValidation()

  const onLoginFinish = async () => {
    try {
      const payload = { login: form.login, password: form.password }

      const response = await login(payload).unwrap()

      localStorage.setItem('refresh', response.refreshToken)
      localStorage.setItem('access', response.accessToken)

      navigate('/')
    } catch (error) {
      const { error: dataError } = error
      applyServerErrors({
        ...dataError,
        ['house.name']: { id: '222', titles: ['какая нибудь пися, ну писяяяяяя'] },
        ['people.user.name']: {
          id: '333',
          titles: ['какая нибудь пися, ну писяяяяяя2222222222222'],
        },
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
