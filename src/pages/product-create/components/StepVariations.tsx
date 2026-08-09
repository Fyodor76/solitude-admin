import { Button, Card, Empty, Input, InputNumber, Select, Space } from 'antd'

import { DraftVariation } from '../types'

interface ColorOption {
  label: string
  value: string
}

interface StepVariationsProps {
  variations: DraftVariation[]
  colorOptions: ColorOption[]
  onAdd: () => void
  onChange: (key: string, patch: Partial<DraftVariation>) => void
  onRemove: (key: string) => void
}

export function StepVariations({
  variations,
  colorOptions,
  onAdd,
  onChange,
  onRemove,
}: StepVariationsProps) {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>Добавьте вариации (цвет обязателен). Для каждой потом зададим сток по размерам.</div>
        <Button type="primary" onClick={onAdd}>
          Добавить вариацию
        </Button>
      </div>

      {!variations.length ? (
        <Empty description="Пока нет вариаций" />
      ) : (
        variations.map((item, index) => (
          <Card
            key={item.key}
            size="small"
            title={`Вариация ${index + 1}`}
            extra={
              <Button danger type="link" onClick={() => onRemove(item.key)}>
                Удалить
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Space wrap>
                <label>
                  Название *
                  <Input
                    value={item.name}
                    onChange={e => onChange(item.key, { name: e.target.value })}
                  />
                </label>
                <label>
                  Цвет *
                  <Select
                    style={{ width: 220, display: 'block' }}
                    value={item.colorId || undefined}
                    options={colorOptions}
                    onChange={colorId => onChange(item.key, { colorId })}
                    placeholder="Выберите цвет"
                    showSearch
                    optionFilterProp="label"
                  />
                </label>
              </Space>

              <Space wrap>
                <label>
                  Slug *
                  <Input
                    value={item.slug}
                    onChange={e => onChange(item.key, { slug: e.target.value })}
                  />
                </label>
                <label>
                  SKU *
                  <Input
                    value={item.sku}
                    onChange={e => onChange(item.key, { sku: e.target.value })}
                  />
                </label>
              </Space>

              <Space wrap>
                <label>
                  Цена *
                  <InputNumber
                    min={0.01}
                    style={{ width: 140, display: 'block' }}
                    value={item.price}
                    onChange={price =>
                      onChange(item.key, { price: price == null ? null : Number(price) })
                    }
                  />
                </label>
                <label>
                  Compare price
                  <InputNumber
                    min={0}
                    style={{ width: 140, display: 'block' }}
                    value={item.comparePrice}
                    onChange={comparePrice =>
                      onChange(item.key, {
                        comparePrice: comparePrice == null ? null : Number(comparePrice),
                      })
                    }
                  />
                </label>
              </Space>

              <label>
                Описание
                <Input.TextArea
                  rows={2}
                  value={item.description}
                  onChange={e => onChange(item.key, { description: e.target.value })}
                />
              </label>

              <label>
                Main image (fileId)
                <Input
                  value={item.mainImage}
                  onChange={e => onChange(item.key, { mainImage: e.target.value })}
                />
              </label>

              <label>
                Images (fileId)
                <Input.TextArea
                  rows={2}
                  value={item.imagesText}
                  onChange={e => onChange(item.key, { imagesText: e.target.value })}
                />
              </label>
            </Space>
          </Card>
        ))
      )}
    </Space>
  )
}
