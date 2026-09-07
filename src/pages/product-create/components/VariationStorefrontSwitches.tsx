import { Switch, Tag, Tooltip } from 'antd'

import { PRODUCT_SWITCH_TOOLTIPS, productSwitchLabel } from '../../products/productSwitchLabels'

const LANDING_REQUIRES_STOREFRONT =
  'Сначала включите «На витрине». На главную попадают только цвета из коллекции.'

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
        Остальные цвета остаются в товаре и на странице модели, но в каталоге не дублируются. «На
        главной» можно включить только вместе с витриной.
      </p>
      <div className="product-create__switches">
        <label className="product-create__switch">
          <Switch
            checked={isActive}
            onChange={next =>
              onChange(next ? { isActive: true } : { isActive: false, showOnLanding: false })
            }
          />
          {productSwitchLabel('На витрине', PRODUCT_SWITCH_TOOLTIPS.isActive)}
        </label>
        <label className="product-create__switch">
          <Tooltip title={isActive ? undefined : LANDING_REQUIRES_STOREFRONT}>
            <span className="product-create__switch-control">
              <Switch
                checked={isActive && showOnLanding}
                disabled={!isActive}
                onChange={next => onChange({ showOnLanding: next })}
              />
            </span>
          </Tooltip>
          {productSwitchLabel('На главной лендинга', PRODUCT_SWITCH_TOOLTIPS.showOnLanding)}
        </label>
      </div>
    </div>
  )
}
