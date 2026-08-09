import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { Alert, Card, Checkbox, Empty, Select, Space } from 'antd'

import { AttributeSelection } from '../types'

interface StepAttributesProps {
  attributes: ProductAttributeResponse[]
  sizeParameters: SizeParameter[]
  sizeChartName?: string
  selections: AttributeSelection[]
  selectedSizeIds: string[]
  onAttributeChange: (attributeId: string, valueIds: string[]) => void
  onSizesChange: (sizeIds: string[]) => void
}

export function StepAttributes({
  attributes,
  sizeParameters,
  sizeChartName,
  selections,
  selectedSizeIds,
  onAttributeChange,
  onSizesChange,
}: StepAttributesProps) {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card title="Опции товара" size="small">
        {!attributes.length ? (
          <Empty description="Нет опций. Сначала создайте их в разделе «Опции товаров»." />
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {attributes.map(attribute => {
              const selected = selections.find(item => item.attributeId === attribute.id)?.valueIds
              return (
                <label key={attribute.id}>
                  {attribute.name} ({attribute.type})
                  <Select
                    mode="multiple"
                    style={{ width: '100%', display: 'block' }}
                    value={selected || []}
                    options={(attribute.values || []).map(value => ({
                      label: value.displayName || value.value,
                      value: value.id,
                    }))}
                    onChange={valueIds => onAttributeChange(attribute.id, valueIds)}
                    placeholder="Выберите значения"
                  />
                </label>
              )
            })}
          </Space>
        )}
      </Card>

      <Card title="Размеры для стока" size="small">
        {!sizeParameters.length ? (
          <Alert
            type="warning"
            showIcon
            message="Для выбранной категории не найдена размерная сетка или в ней нет размеров."
          />
        ) : (
          <>
            {sizeChartName ? <div style={{ marginBottom: 12 }}>Сетка: {sizeChartName}</div> : null}
            <Checkbox.Group
              style={{ width: '100%' }}
              value={selectedSizeIds}
              onChange={values => onSizesChange(values as string[])}
            >
              <Space direction="vertical">
                {sizeParameters.map(size => (
                  <Checkbox key={size.id} value={size.id}>
                    {size.internationalSize}
                    {size.russianSize ? ` / ${size.russianSize}` : ''}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </>
        )}
      </Card>
    </Space>
  )
}
