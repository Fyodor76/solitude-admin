import { AttributeType } from '@/shared/lib/api/product-attributes/types'
import { IconName } from '@/shared/ui/icons/iconSet'

export const getIconForAttribute = (attributeType: AttributeType): IconName => {
  const iconMap: Record<AttributeType, IconName> = {
    color: 'color',
    size: 'size',
    dimension: 'length',
    volume: 'volume',
    weight: 'weight',
    other: 'uiElements',
  }

  return iconMap[attributeType] || 'settings'
}
