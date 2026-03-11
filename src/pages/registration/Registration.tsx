import { useRegisterMutation } from '@/shared/lib/api/auth/auth'
import { useForm } from '@/shared/lib/hooks/useForm'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import { configRegistrations } from './const/config-registrations'
import './Registration.scss'

const Registration = () => {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const { form, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    repeat_passord: '',
  })

  const onRegistrationFinish = () => {
    register({ login: form.email, password: form.password }).unwrap()

    navigate('/login')
  }

  return (
    <div className="registration">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="source-sans-3-regular title">{configRegistrations.title}</h2>
          <Card>
            <CustomForm
              formData={form}
              configForm={configRegistrations}
              onChange={handleChange}
              onFinish={onRegistrationFinish}
            />
          </Card>
        </>
      )}
    </div>
  )
}

export default Registration
