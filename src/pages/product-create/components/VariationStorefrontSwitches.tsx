import { Switch } from 'antd'

import { PRODUCT_SWITCH_TOOLTIPS, productSwitchLabel } from '../products/productSwitchLabels'

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
  )
}
