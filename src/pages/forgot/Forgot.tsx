import { Card } from '@/shared/ui/card'
import { CustomForm } from '@/shared/ui/custom-form/CustomForm'

import { configForgot } from './const/config-forgot'
import './Forgot.scss'

const Forgot = () => {
  return (
    <div className="forgot-card">
      <h2 className="source-sans-3-regular title">{configForgot.title}</h2>
      <Card>
        <CustomForm configForm={configForgot as any} />
      </Card>
    </div>
  )
}

export default Forgot
