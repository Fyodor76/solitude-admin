import { useForm } from '@/shared/lib/hooks/useForm'
import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'

import { configForgot } from './const/config-forgot'
import './Forgot.scss'

type FormForgotProps = {
  email: string
}

const Forgot = () => {
  const { form, handleChange } = useForm<FormForgotProps>({ email: '' })

  const onForgotFinish = () => {}
  return (
    <div className="forgot-card">
      <h2 className="source-sans-3-regular title">{configForgot.title}</h2>
      <Card>
        <CustomForm
          formData={form}
          configForm={configForgot}
          onChange={handleChange}
          onFinish={onForgotFinish}
        />
      </Card>
    </div>
  )
}

export default Forgot
