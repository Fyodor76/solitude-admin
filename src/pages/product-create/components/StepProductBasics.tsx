import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { Card, Input, InputNumber, Select, Switch } from 'antd'

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
      <div className="product-create__grid">
        <div className="product-create__field">
          <span>Название *</span>
          <Input
            value={value.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Футболка Solitude"
          />
        </div>

        <div className="product-create__field">
          <span>Slug</span>
          <Input
            value={value.slug}
            onChange={e => onChange({ slug: e.target.value })}
            placeholder="futbolka-solitude"
          />
        </div>

        <div className="product-create__field product-create__field--full">
          <span>Описание</span>
          <Input.TextArea
            rows={3}
            value={value.description}
            onChange={e => onChange({ description: e.target.value })}
          />
        </div>

        <div className="product-create__field">
          <span>Цена *</span>
          <InputNumber
            min={0.01}
            className="product-create__control"
            value={value.price}
            onChange={price => onChange({ price: price == null ? null : Number(price) })}
          />
        </div>

        <div className="product-create__field">
          <span>Категория *</span>
          <Select
            className="product-create__control"
            value={value.categoryId || undefined}
            options={categoryOptions}
            onChange={categoryId => onChange({ categoryId })}
            showSearch
            optionFilterProp="label"
            placeholder="Выберите категорию"
            allowClear
          />
        </div>

        <div className="product-create__field">
          <span>Бренд *</span>
          <Input value={value.brand} onChange={e => onChange({ brand: e.target.value })} />
        </div>

        <div className="product-create__field">
          <span>Материал *</span>
          <Input
            value={value.material}
            onChange={e => onChange({ material: e.target.value })}
            placeholder="cotton-100"
          />
        </div>

        <div className="product-create__field product-create__field--full">
          <span>Параметры модели</span>
          <Input
            value={value.modelParameters}
            onChange={e => onChange({ modelParameters: e.target.value })}
            placeholder="Рост 170, размер M"
          />
        </div>

        <div className="product-create__switches">
          <label className="product-create__switch">
            <Switch checked={value.isActive} onChange={isActive => onChange({ isActive })} />
            <span>На витрине</span>
          </label>
          <label className="product-create__switch">
            <Switch checked={value.isFeatured} onChange={isFeatured => onChange({ isFeatured })} />
            <span>Рекомендуемый</span>
          </label>
        </div>
      </div>
    </Card>
  )
}
