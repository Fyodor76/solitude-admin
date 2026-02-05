import { useForm } from '@/shared/lib/hooks/useForm'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Card } from 'antd'

import { configRegistrations } from './const/config-registrations'
import './Registration.scss'

const Registration = () => {
  const { form, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    repeat_passord: '',
  })

  const onRegistrationFinish = () => {
    console.log('registration')
  }

  return (
    <div className="registration">
      <h2 className="source-sans-3-regular title">{configRegistrations.title}</h2>
      <Card>
        <CustomForm
          configForm={configRegistrations}
          onChange={handleChange}
          formData={form}
          onFinish={onRegistrationFinish}
        />
      </Card>
    </div>
  )
}

export default Registration
