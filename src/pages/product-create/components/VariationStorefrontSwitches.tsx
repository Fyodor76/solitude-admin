import { Switch, Tag } from 'antd'

import { PRODUCT_SWITCH_TOOLTIPS, productSwitchLabel } from '../../products/productSwitchLabels'

interface VariationStorefrontSwitchesProps {
  isActive: boolean
  showOnLanding: boolean
  onChange: (patch: { isActive?: boolean; showOnLanding?: boolean }) => void
}

export function VariationStorefrontSwitches({
  isActive,
  showOnLanding,
  onChange,
}: VariationStorefrontSwitchesProps) {
  return (
    <div className="product-create__visibility">
      <div className="product-create__visibility-head">
        <strong>Показ на сайте</strong>
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Карточка в коллекции' : 'Скрыта из коллекции'}
        </Tag>
      </div>
      <p className="product-create__hint">
        Включайте «На витрине» только у тех цветов, которые должны быть отдельными карточками.
        Остальные цвета остаются в товаре и на странице модели, но в каталоге не дублируются.
      </p>
      <div className="product-create__switches">
        <label className="product-create__switch">
          <Switch checked={isActive} onChange={next => onChange({ isActive: next })} />
          {productSwitchLabel('На витрине', PRODUCT_SWITCH_TOOLTIPS.isActive)}
        </label>
        <label className="product-create__switch">
          <Switch checked={showOnLanding} onChange={next => onChange({ showOnLanding: next })} />
          {productSwitchLabel('На главной лендинга', PRODUCT_SWITCH_TOOLTIPS.showOnLanding)}
        </label>
      </div>
    </div>
  )
}
