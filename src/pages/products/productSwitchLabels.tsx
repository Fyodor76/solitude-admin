import { ReactNode } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export const PRODUCT_SWITCH_TOOLTIPS = {
  isActive:
    'Этот цвет становится отдельной карточкой в коллекции. Выключите, если цвет нужен в товаре, но не должен дублироваться на витрине — например, из 30 цветов оставить топ-5.',
  isFeatured:
    'Пометить модель как рекомендуемую — для подборок и промо. На показ карточек в коллекции не влияет: это включается у каждого цвета на шаге «Вариации».',
  showOnLanding:
    'Показывать карточку этого цвета в блоке «Коллекция» на главной (до 3 позиций). Работает только вместе с «На витрине».',
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
