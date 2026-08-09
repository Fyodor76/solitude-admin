import { Button, Card, Empty, Input, InputNumber, Select } from 'antd'

import { DraftVariation } from '../types'
import { ProductImageUpload } from './ProductImageUpload'

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
    <div className="product-create__stack">
      <div className="product-create__toolbar">
        <p className="product-create__hint">
          Добавьте вариации (например, по цвету). Цвет обязателен — из раздела «Опции товаров».
        </p>
        <Button type="primary" onClick={onAdd}>
          Добавить вариацию
        </Button>
      </div>

      {!colorOptions.length ? (
        <Empty description="Нет цветов. Создайте опцию type=color и значения в «Опции товаров»." />
      ) : null}

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
            <div className="product-create__grid">
              <div className="product-create__field">
                <span>Название *</span>
                <Input
                  value={item.name}
                  onChange={e => onChange(item.key, { name: e.target.value })}
                />
              </div>

              <div className="product-create__field">
                <span>Цвет *</span>
                <Select
                  className="product-create__control"
                  value={item.colorId || undefined}
                  options={colorOptions}
                  onChange={colorId => onChange(item.key, { colorId })}
                  placeholder="Выберите цвет"
                  showSearch
                  optionFilterProp="label"
                />
              </div>

              <div className="product-create__field">
                <span>Slug *</span>
                <Input
                  value={item.slug}
                  onChange={e => onChange(item.key, { slug: e.target.value })}
                />
              </div>

              <div className="product-create__field">
                <span>SKU *</span>
                <Input
                  value={item.sku}
                  onChange={e => onChange(item.key, { sku: e.target.value })}
                />
              </div>

              <div className="product-create__field">
                <span>Цена *</span>
                <InputNumber
                  min={0.01}
                  className="product-create__control"
                  value={item.price}
                  onChange={price =>
                    onChange(item.key, { price: price == null ? null : Number(price) })
                  }
                />
              </div>

              <div className="product-create__field">
                <span>Compare price</span>
                <InputNumber
                  min={0}
                  className="product-create__control"
                  value={item.comparePrice}
                  onChange={comparePrice =>
                    onChange(item.key, {
                      comparePrice: comparePrice == null ? null : Number(comparePrice),
                    })
                  }
                />
              </div>

              <div className="product-create__field product-create__field--full">
                <span>Описание</span>
                <Input.TextArea
                  rows={2}
                  value={item.description}
                  onChange={e => onChange(item.key, { description: e.target.value })}
                />
              </div>

              <div className="product-create__field product-create__field--full">
                <span>Главное фото</span>
                <ProductImageUpload
                  value={item.mainImage ? [item.mainImage] : []}
                  multiple={false}
                  onChange={images => onChange(item.key, { mainImage: images[0] || null })}
                />
              </div>

              <div className="product-create__field product-create__field--full">
                <span>Доп. фото вариации</span>
                <ProductImageUpload
                  value={item.images}
                  multiple
                  onChange={images => onChange(item.key, { images })}
                />
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
