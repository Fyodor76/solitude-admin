import { useValidation } from '@/context/validation/use-validation'
import { useRegisterMutation } from '@/shared/lib/api/auth/auth'
import { useForm } from '@/shared/lib/hooks/useForm'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import { configRegistrations } from './const/config-registrations'
import './Registration.scss'
import { RegistrationType } from './types'

const Registration = () => {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const { errors, applyServerErrors } = useValidation()

  const { form, handleChange } = useForm<RegistrationType>({
    login: '',
    password: '',
  })

  const onRegistrationFinish = async () => {
    try {
      await register({ login: form.login, password: form.password }).unwrap()

      navigate('/login')
    } catch (error: any) {
      const { error: dataError } = error
      applyServerErrors({ ...dataError })
    }
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
              errors={errors}
            />
          </Card>
        </>
      )}
    </div>
  )
}

export default Registration
