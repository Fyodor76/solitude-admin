import { useMemo, useState } from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { Alert, Button, Card, Checkbox, Empty, Select, Space } from 'antd'

import { AttributeSelection } from '../types'

interface StepAttributesProps {
  attributes: ProductAttributeResponse[]
  sizeParameters: SizeParameter[]
  sizeChartName?: string
  sizeChartMissing?: boolean
  selections: AttributeSelection[]
  selectedSizeIds: string[]
  onAddAttribute: (attributeId: string) => void
  onAttributeChange: (attributeId: string, valueIds: string[]) => void
  onRemoveAttribute: (attributeId: string) => void
  onSizesChange: (sizeIds: string[]) => void
  sizesHint?: string
}

export function StepAttributes({
  attributes,
  sizeParameters,
  sizeChartName,
  sizeChartMissing,
  selections,
  selectedSizeIds,
  onAddAttribute,
  onAttributeChange,
  onRemoveAttribute,
  onSizesChange,
  sizesHint,
}: StepAttributesProps) {
  const [attributeToAdd, setAttributeToAdd] = useState<string>()

  const usableAttributes = useMemo(
    () =>
      attributes.filter(
        item => item.isActive !== false && Array.isArray(item.values) && item.values.length > 0
      ),
    [attributes]
  )

  const attributeMap = useMemo(
    () => new Map(usableAttributes.map(item => [item.id, item])),
    [usableAttributes]
  )

  const availableToAdd = useMemo(
    () =>
      usableAttributes
        .filter(item => !selections.some(selected => selected.attributeId === item.id))
        .map(item => ({
          label: `${item.name} (${item.type})`,
          value: item.id,
        })),
    [selections, usableAttributes]
  )

  return (
    <div className="product-create__stack">
      <Card
        title="1. Размеры для склада"
        size="small"
        extra={
          sizeParameters.length ? (
            <Button type="link" onClick={() => onSizesChange(sizeParameters.map(item => item.id!))}>
              Выбрать все
            </Button>
          ) : null
        }
      >
        <p className="product-create__hint">
          {sizesHint ||
            'Выберите размеры, по которым будете вести остатки (S/M/L и т.д.). Это берётся из размерной сетки категории.'}
        </p>

        {sizeChartMissing ? (
          <Alert
            type="warning"
            showIcon
            message="Для этой категории нет размерной сетки"
            description="Создайте сетку в разделе «Размерные сетки» или выберите другую категорию. Без размеров сток на следующем шаге будет пустым."
          />
        ) : !sizeParameters.length ? (
          <Empty description="В сетке категории пока нет размеров" />
        ) : (
          <>
            {sizeChartName ? (
              <div className="product-create__meta">Сетка: {sizeChartName}</div>
            ) : null}
            <Checkbox.Group
              className="product-create__size-grid"
              value={selectedSizeIds}
              onChange={values => onSizesChange(values as string[])}
              options={sizeParameters.map(size => ({
                label: size.russianSize
                  ? `${size.internationalSize} / ${size.russianSize}`
                  : size.internationalSize,
                value: size.id!,
              }))}
            />
          </>
        )}
      </Card>

      <Card title="2. Характеристики товара (опционально)" size="small">
        <p className="product-create__hint">
          Не нужно выбирать всё подряд. Добавьте только нужные характеристики (материал, посадка и
          т.п.). Цвет уже задаётся на шаге вариаций.
        </p>

        <div className="product-create__add-row">
          <Select
            className="product-create__control"
            placeholder="Найти и добавить характеристику"
            options={availableToAdd}
            value={attributeToAdd}
            onChange={setAttributeToAdd}
            showSearch
            optionFilterProp="label"
            allowClear
          />
          <Button
            type="primary"
            disabled={!attributeToAdd}
            onClick={() => {
              if (!attributeToAdd) return
              onAddAttribute(attributeToAdd)
              setAttributeToAdd(undefined)
            }}
          >
            Добавить
          </Button>
        </div>

        {!selections.length ? (
          <Empty
            className="product-create__empty"
            description="Характеристики не добавлены — можно пропустить"
          />
        ) : (
          <Space direction="vertical" size="middle" className="product-create__control">
            {selections.map(selection => {
              const attribute = attributeMap.get(selection.attributeId)
              if (!attribute) return null

              return (
                <div key={selection.attributeId} className="product-create__attr-card">
                  <div className="product-create__attr-card-head">
                    <strong>
                      {attribute.name} <span>({attribute.type})</span>
                    </strong>
                    <Button
                      type="link"
                      danger
                      onClick={() => onRemoveAttribute(selection.attributeId)}
                    >
                      Убрать
                    </Button>
                  </div>
                  <Select
                    mode="multiple"
                    className="product-create__control"
                    placeholder="Выберите значения"
                    value={selection.valueIds}
                    options={(attribute.values || []).map(value => ({
                      label: value.displayName || value.value,
                      value: value.id,
                    }))}
                    onChange={valueIds => onAttributeChange(selection.attributeId, valueIds)}
                    showSearch
                    optionFilterProp="label"
                  />
                </div>
              )
            })}
          </Space>
        )}
      </Card>
    </div>
  )
}
