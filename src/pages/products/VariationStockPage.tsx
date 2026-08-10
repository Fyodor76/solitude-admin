import { useEffect, useMemo, useState } from 'react'

import {
  useCreateStockBulkMutation,
  useDeleteStockItemMutation,
  useGetProductByIdQuery,
  useGetProductVariationByIdQuery,
  useGetStockByVariationQuery,
  useUpdateStockItemMutation,
} from '@/shared/lib/api/products/Products'
import { StockItem } from '@/shared/lib/api/products/types'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { buildSku } from '../product-create/helpers'
import '../product-create/ProductCreate.scss'
import './ProductsPage.scss'

type EditableStockRow = StockItem & {
  draftSku: string
  draftQuantity: number
  draftLocation: string
}

export default function VariationStockPage() {
  const { productId = '', variationId = '' } = useParams<{
    productId: string
    variationId: string
  }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [rows, setRows] = useState<EditableStockRow[]>([])
  const [sizesToAdd, setSizesToAdd] = useState<string[]>([])
  const [addOpen, setAddOpen] = useState(false)

  const { data: productResponse } = useGetProductByIdQuery(productId, { skip: !productId })
  const {
    data: variationResponse,
    isLoading: isVariationLoading,
    isError: isVariationError,
  } = useGetProductVariationByIdQuery(variationId, { skip: !variationId })
  const {
    data: stockResponse,
    isLoading: isStockLoading,
    isFetching: isStockFetching,
  } = useGetStockByVariationQuery(variationId, { skip: !variationId })

  const [updateStockItem, { isLoading: isUpdating }] = useUpdateStockItemMutation()
  const [deleteStockItem, { isLoading: isDeleting }] = useDeleteStockItemMutation()
  const [createStockBulk, { isLoading: isCreating }] = useCreateStockBulkMutation()

  const product = productResponse?.data
  const variation = variationResponse?.data

  const { data: sizeChartResponse } = useGetSizeChartByCategoryIdQuery(product?.categoryId || '', {
    skip: !product?.categoryId,
  })
  const sizeParameters = sizeChartResponse?.data?.sizeParameters || []

  const sizeLabelById = useMemo(() => {
    const map = new Map<string, string>()
    for (const size of sizeParameters) {
      if (!size.id) continue
      map.set(
        size.id,
        size.russianSize
          ? `${size.internationalSize} / ${size.russianSize}`
          : size.internationalSize
      )
    }
    return map
  }, [sizeParameters])

  useEffect(() => {
    const items = (stockResponse?.data ?? []).filter(
      item =>
        !(
          !item.sizeId &&
          (item.quantity ?? 0) === 0 &&
          (item.reserved ?? 0) === 0 &&
          String(item.sku || '').startsWith('EMPTY-')
        )
    )

    setRows(
      items.map(item => ({
        ...item,
        draftSku: item.sku || '',
        draftQuantity: item.quantity ?? 0,
        draftLocation: item.location || '',
      }))
    )
  }, [stockResponse?.data])

  const existingSizeIds = useMemo(
    () => new Set(rows.map(row => row.sizeId).filter(Boolean) as string[]),
    [rows]
  )

  const availableSizesToAdd = useMemo(
    () =>
      sizeParameters
        .filter(size => size.id && !existingSizeIds.has(size.id))
        .map(size => ({
          value: size.id!,
          label: size.russianSize
            ? `${size.internationalSize} / ${size.russianSize}`
            : size.internationalSize,
        })),
    [existingSizeIds, sizeParameters]
  )

  const patchRow = (id: string, patch: Partial<EditableStockRow>) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, ...patch } : row)))
  }

  const handleSaveRow = async (row: EditableStockRow) => {
    try {
      await updateStockItem({
        id: row.id,
        variationId,
        body: {
          sku: row.draftSku.trim() || undefined,
          quantity: Number(row.draftQuantity) || 0,
          location: row.draftLocation.trim() || undefined,
        },
      }).unwrap()
      openNotification('success', ['Позиция сохранена'])
    } catch {
      openNotification('error', ['Не удалось сохранить позицию'])
    }
  }

  const handleDeleteRow = (row: EditableStockRow) => {
    Modal.confirm({
      title: 'Удалить позицию склада?',
      content: 'Остаток по этому размеру будет удалён.',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteStockItem({ id: row.id, variationId }).unwrap()
          openNotification('success', ['Позиция удалена'])
        } catch {
          openNotification('error', ['Не удалось удалить позицию'])
        }
      },
    })
  }

  const handleAddSizes = async () => {
    if (!product || !variation || !sizesToAdd.length) return

    try {
      await createStockBulk({
        items: sizesToAdd.map(sizeId => {
          const size = sizeParameters.find(item => item.id === sizeId)
          const sizeCode = size?.internationalSize || size?.russianSize || 'SIZE'
          return {
            productId: product.id,
            variationId: variation.id,
            sizeId,
            sku: buildSku(variation.sku || variation.slug || variation.name, sizeCode),
            quantity: 0,
          }
        }),
      }).unwrap()
      setAddOpen(false)
      setSizesToAdd([])
      openNotification('success', [`Добавлено размеров: ${sizesToAdd.length}`])
    } catch {
      openNotification('error', ['Не удалось добавить размеры'])
    }
  }

  if (isVariationError) {
    return (
      <Container className="variation-edit admin-page">
        <PageHeader title="Вариация не найдена" />
        <Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>
      </Container>
    )
  }

  return (
    <Container className="variation-edit admin-page">
      {contextHolder}
      <PageHeader
        title="Сток вариации"
        subtitle={
          variation
            ? `${variation.name}${variation.sku ? ` · SKU: ${variation.sku}` : ''}${
                product ? ` · ${product.name}` : ''
              }`
            : 'Загрузка...'
        }
        actions={
          <Space>
            <Button onClick={() => navigate(`/products/${productId}/variations/${variationId}`)}>
              К вариации
            </Button>
            <Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>
            <Button
              type="primary"
              disabled={!availableSizesToAdd.length}
              onClick={() => setAddOpen(true)}
            >
              Добавить размеры
            </Button>
          </Space>
        }
      />

      {!availableSizesToAdd.length && !isStockLoading && sizeParameters.length === 0 ? (
        <Alert
          type="warning"
          showIcon
          message="Нет размерной сетки у категории"
          description="Создайте сетку в «Размерные сетки», чтобы добавлять размеры в сток."
        />
      ) : null}

      <section className="variation-edit__section">
        {isStockLoading || isVariationLoading ? (
          <Empty description="Загрузка..." />
        ) : !rows.length ? (
          <Empty description="Позиций склада пока нет. Добавьте размеры." />
        ) : (
          <div className="variation-edit__table-wrap">
            <Table
              rowKey="id"
              pagination={false}
              loading={isStockFetching || isUpdating || isDeleting || isCreating}
              dataSource={rows}
              scroll={{ x: 720 }}
              columns={[
                {
                  title: 'Размер',
                  dataIndex: 'sizeId',
                  render: (sizeId?: string) =>
                    sizeId ? sizeLabelById.get(sizeId) || sizeId : <Tag>Без размера</Tag>,
                },
                {
                  title: 'SKU',
                  dataIndex: 'draftSku',
                  render: (_value, row) => (
                    <Input
                      value={row.draftSku}
                      onChange={e => patchRow(row.id, { draftSku: e.target.value })}
                    />
                  ),
                },
                {
                  title: 'Количество',
                  dataIndex: 'draftQuantity',
                  width: 140,
                  render: (_value, row) => (
                    <InputNumber
                      min={0}
                      value={row.draftQuantity}
                      onChange={quantity =>
                        patchRow(row.id, { draftQuantity: quantity == null ? 0 : Number(quantity) })
                      }
                    />
                  ),
                },
                {
                  title: 'Резерв',
                  dataIndex: 'reserved',
                  width: 90,
                  render: (value: number) => value ?? 0,
                },
                {
                  title: 'Доступно',
                  dataIndex: 'available',
                  width: 100,
                  render: (value: number) => value ?? 0,
                },
                {
                  title: 'Локация',
                  dataIndex: 'draftLocation',
                  render: (_value, row) => (
                    <Input
                      value={row.draftLocation}
                      onChange={e => patchRow(row.id, { draftLocation: e.target.value })}
                      placeholder="Склад"
                    />
                  ),
                },
                {
                  title: '',
                  key: 'actions',
                  width: 180,
                  render: (_value, row) => (
                    <Space>
                      <Button type="link" onClick={() => void handleSaveRow(row)}>
                        Сохранить
                      </Button>
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteRow(row)}
                      />
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        )}
      </section>

      <Modal
        title="Добавить размеры в сток"
        open={addOpen}
        onCancel={() => {
          setAddOpen(false)
          setSizesToAdd([])
        }}
        onOk={() => void handleAddSizes()}
        okText="Добавить"
        confirmLoading={isCreating}
        okButtonProps={{ disabled: !sizesToAdd.length }}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Выберите размеры"
          options={availableSizesToAdd}
          value={sizesToAdd}
          onChange={setSizesToAdd}
          optionFilterProp="label"
        />
      </Modal>
    </Container>
  )
}
