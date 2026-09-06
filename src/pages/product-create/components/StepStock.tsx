import { SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { Card, Empty, Input, InputNumber, Space, Table } from 'antd'

import { DraftVariation, StockDraftRow } from '../types'

interface StepStockProps {
  rows: StockDraftRow[]
  variations: DraftVariation[]
  sizeParameters: SizeParameter[]
  onChange: (key: string, patch: Partial<StockDraftRow>) => void
  showInventoryDetails?: boolean
}

export function StepStock({
  rows,
  variations,
  sizeParameters,
  onChange,
  showInventoryDetails = false,
}: StepStockProps) {
  const variationName = (key: string) => variations.find(item => item.key === key)?.name || key

  const sizeName = (id: string) => {
    if (!id) return 'Без размера'
    const size = sizeParameters.find(item => item.id === id)
    if (!size) return id
    return size.russianSize
      ? `${size.internationalSize} / ${size.russianSize}`
      : size.internationalSize
  }

  if (!rows.length) {
    return <Empty description="Выберите размеры на предыдущем шаге" />
  }

  return (
    <Card title="Сток по вариациям и размерам" size="small" className="product-create__stock-card">
      <div className="product-create__table-wrap">
        <Table
          rowKey="key"
          pagination={false}
          dataSource={rows}
          scroll={{ x: showInventoryDetails ? 920 : 640 }}
          columns={[
            {
              title: 'Вариация',
              dataIndex: 'variationKey',
              render: (value: string) => variationName(value),
            },
            {
              title: 'Размер',
              dataIndex: 'sizeId',
              render: (value: string) => sizeName(value),
            },
            {
              title: 'SKU',
              dataIndex: 'sku',
              render: (value: string, row) => (
                <Input value={value} onChange={e => onChange(row.key, { sku: e.target.value })} />
              ),
            },
            {
              title: 'Количество',
              dataIndex: 'quantity',
              width: 140,
              render: (value: number, row) => (
                <InputNumber
                  min={0}
                  value={value}
                  onChange={quantity =>
                    onChange(row.key, { quantity: quantity == null ? 0 : Number(quantity) })
                  }
                />
              ),
            },
            ...(showInventoryDetails
              ? [
                  {
                    title: 'Резерв',
                    dataIndex: 'reserved',
                    width: 90,
                    render: (value: number | undefined) => value ?? 0,
                  },
                  {
                    title: 'Локация',
                    dataIndex: 'location',
                    render: (value: string | undefined, row: StockDraftRow) => (
                      <Input
                        value={value || ''}
                        placeholder="Склад"
                        onChange={e => onChange(row.key, { location: e.target.value })}
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
      <Space style={{ marginTop: 12 }}>
        <span>
          {showInventoryDetails
            ? 'Резерв меняется заказами. Снятый на шаге размеров размер удалится со склада (кроме позиций с резервом).'
            : 'Можно оставить 0 — позиция всё равно создастся с нулевым остатком.'}
        </span>
      </Space>
    </Card>
  )
}
