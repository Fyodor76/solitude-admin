import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { Card, Input, InputNumber, Select, Space, Switch } from 'antd'

import { flattenCategoryOptions } from '../helpers'
import { ProductBasicsForm } from '../types'

interface StepProductBasicsProps {
  value: ProductBasicsForm
  categories: BaseCategoryTree[]
  onChange: (patch: Partial<ProductBasicsForm>) => void
}

export function StepProductBasics({ value, categories, onChange }: StepProductBasicsProps) {
  const categoryOptions = flattenCategoryOptions(categories)

  return (
    <Card title="Основные данные товара" size="small">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <label>
          Название *
          <Input
            value={value.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Футболка Solitude"
          />
        </label>

        <label>
          Slug
          <Input
            value={value.slug}
            onChange={e => onChange({ slug: e.target.value })}
            placeholder="futbolka-solitude"
          />
        </label>

        <label>
          Описание
          <Input.TextArea
            rows={3}
            value={value.description}
            onChange={e => onChange({ description: e.target.value })}
          />
        </label>

        <Space wrap>
          <label>
            Цена *
            <InputNumber
              min={0.01}
              style={{ width: 160, display: 'block' }}
              value={value.price}
              onChange={price => onChange({ price: price == null ? null : Number(price) })}
            />
          </label>

          <label>
            Категория *
            <Select
              style={{ width: 280, display: 'block' }}
              value={value.categoryId || undefined}
              options={categoryOptions}
              onChange={categoryId => onChange({ categoryId })}
              showSearch
              optionFilterProp="label"
              placeholder="Выберите категорию"
            />
          </label>
        </Space>

        <Space wrap>
          <label>
            Бренд *
            <Input value={value.brand} onChange={e => onChange({ brand: e.target.value })} />
          </label>
          <label>
            Материал *
            <Input
              value={value.material}
              onChange={e => onChange({ material: e.target.value })}
              placeholder="cotton-100"
            />
          </label>
        </Space>

        <label>
          Параметры модели
          <Input
            value={value.modelParameters}
            onChange={e => onChange({ modelParameters: e.target.value })}
            placeholder="Рост 170, размер M"
          />
        </label>

        <label>
          Images (fileId через запятую или с новой строки)
          <Input.TextArea
            rows={3}
            value={value.imagesText}
            onChange={e => onChange({ imagesText: e.target.value })}
            placeholder="1785587118500-fjqookkhq4n"
          />
        </label>

        <Space size="large">
          <label>
            <Switch checked={value.isActive} onChange={isActive => onChange({ isActive })} /> Active
          </label>
          <label>
            <Switch checked={value.isFeatured} onChange={isFeatured => onChange({ isFeatured })} />{' '}
            Featured
          </label>
        </Space>
      </Space>
    </Card>
  )
}
