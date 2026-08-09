import { useState } from 'react'

import { HolderOutlined } from '@ant-design/icons'
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
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function StepVariations({
  variations,
  colorOptions,
  onAdd,
  onChange,
  onRemove,
  onReorder,
}: StepVariationsProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  return (
    <div className="product-create__stack">
      <div className="product-create__toolbar">
        <p className="product-create__hint">
          Добавьте вариации (например, по цвету). Цвет обязателен — из раздела «Опции товаров».
          Можно менять порядок перетаскиванием.
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
            className={[
              'product-create__variation-card',
              dragIndex === index ? 'product-create__variation-card--dragging' : '',
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? 'product-create__variation-card--over'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            title={
              <span
                className="product-create__variation-drag"
                draggable
                onDragStart={event => {
                  setDragIndex(index)
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', String(index))
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setOverIndex(null)
                }}
              >
                <HolderOutlined />
                Вариация {index + 1}
              </span>
            }
            extra={
              <Button danger type="link" onClick={() => onRemove(item.key)}>
                Удалить
              </Button>
            }
            onDragOver={event => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              if (dragIndex !== null && dragIndex !== index) {
                setOverIndex(index)
              }
            }}
            onDragEnter={event => {
              event.preventDefault()
              if (dragIndex !== null && dragIndex !== index) {
                setOverIndex(index)
              }
            }}
            onDrop={event => {
              event.preventDefault()
              const from = dragIndex ?? Number(event.dataTransfer.getData('text/plain'))
              if (!Number.isNaN(from)) {
                onReorder(from, index)
              }
              setDragIndex(null)
              setOverIndex(null)
            }}
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
                  className="product-create__control"
                  min={0.01}
                  value={item.price ?? undefined}
                  onChange={price =>
                    onChange(item.key, { price: price == null ? null : Number(price) })
                  }
                />
              </div>

              <div className="product-create__field">
                <span>Старая цена</span>
                <InputNumber
                  className="product-create__control"
                  min={0}
                  value={item.comparePrice ?? undefined}
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
                <span>Фото вариации</span>
                <ProductImageUpload
                  value={
                    item.mainImage
                      ? [
                          item.mainImage,
                          ...item.images.filter(image => image.fileId !== item.mainImage?.fileId),
                        ]
                      : item.images
                  }
                  multiple
                  showcaseFileIds={item.showcaseFileIds ?? []}
                  onShowcaseChange={showcaseFileIds => onChange(item.key, { showcaseFileIds })}
                  onChange={images => {
                    const remaining = new Set(images.map(image => image.fileId))
                    const showcaseFileIds = (item.showcaseFileIds ?? []).filter(id =>
                      remaining.has(id)
                    )
                    onChange(item.key, {
                      mainImage: images[0] || null,
                      images,
                      showcaseFileIds,
                    })
                  }}
                />
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
