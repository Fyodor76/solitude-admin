import React from 'react'

import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { Button, Space } from 'antd'

interface SizeChartButtonsProps {
  formSizeChart: SizeChartRequest
  onSaveAllChanges: (data: Partial<SizeChartRequest>) => void
  handleCancel: () => void
}
const SizeChartButtons = ({
  formSizeChart,
  onSaveAllChanges,
  handleCancel,
}: SizeChartButtonsProps) => {
  return (
    <Space className="saveAndCancelBtn">
      <Button onClick={handleCancel} className="cancelBtn" type="link">
        Отмена
      </Button>
      <Button className="saveBtn" onClick={() => onSaveAllChanges(formSizeChart)} type="primary">
        Сохранить изменения
      </Button>
    </Space>
  )
}

export default SizeChartButtons
