import { CustomForm } from '@/shared/ui/custom-form/CustomForm'
import { Card } from 'antd'

import { configRegistrations } from './const/config-registrations'
import './Registration.scss'

const Registration = () => {
  return (
    <div className="registration">
      <h2 className="source-sans-3-regular title">{configRegistrations.title}</h2>
      <Card>
        <CustomForm configForm={configRegistrations as any} />
      </Card>
    </div>
  )
}

export default Registration
