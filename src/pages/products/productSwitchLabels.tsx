import { ReactNode } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export const PRODUCT_SWITCH_TOOLTIPS = {
  isActive: 'Товар виден в каталоге на сайте. Выключите, чтобы скрыть с витрины.',
  isFeatured: 'Пометить товар как рекомендуемый — для подборок и промо-блоков.',
  showOnLanding:
    'Показывать карточку в блоке «Коллекция» на главной странице лендинга (запрашиваются до 3 товаров).',
} as const

export function productSwitchLabel(text: string, tooltip: string): ReactNode {
  return (
    <span>
      {text}{' '}
      <Tooltip title={tooltip}>
        <QuestionCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
      </Tooltip>
    </span>
  )
}
