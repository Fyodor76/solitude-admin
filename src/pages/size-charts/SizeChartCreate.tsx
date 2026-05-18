import React from 'react'

import { Button } from 'antd'

interface SizeChartCreateProps {
  handleCreateSizeChart: () => void
}
const SizeChartCreate = ({ handleCreateSizeChart }: SizeChartCreateProps) => {
  return (
    <div className="size-chart-select-empty-container">
      <h2 className="empty-table">Информация о таблице размеров</h2>
      <div className="information">
        <h3 className="information-title">У данной категории ещё нет таблицы размеров</h3>
        <span className="information-info">Создайте таблицу с размерами</span>
        <Button onClick={handleCreateSizeChart} className="information-btn" type="default">
          Создать
        </Button>
      </div>
    </div>
  )
}

export default SizeChartCreate
