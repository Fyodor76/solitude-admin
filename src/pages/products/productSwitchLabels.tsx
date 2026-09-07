import { ReactNode } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export const PRODUCT_SWITCH_TOOLTIPS = {
  isActive:
    'Этот цвет становится отдельной карточкой в коллекции. Выключите, если цвет нужен в товаре, но не должен дублироваться на витрине.',
  isFeatured:
    'Пометка всей модели, не цвета. Сейчас сайт её нигде не выводит: коллекция на главной берёт вариации с «На главной лендинга». Флаг остаётся для будущих подборок.',
  showOnLanding:
    'Карточка этого цвета в блоке «Коллекция» на главной (до 3 позиций). Работает только если включена «На витрине»: главная — подмножество каталога.',
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
