import { useMemo, useState } from 'react'

import { useSearchProductsQuery } from '@/shared/lib/api/products/Products'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Input, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'

import { Product } from '@/app/types/product'

import './ProductsPage.scss'

const PAGE_SIZE = 20

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isFetching, refetch } = useSearchProductsQuery({
    search: search || undefined,
    isActiveFilter: 'all',
    sort: 'newest',
    page,
    limit: PAGE_SIZE,
  })

  const products = data?.data ?? []
  const meta = data?.meta

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'images',
        width: 64,
        render: (images: string[]) =>
          images?.[0] ? (
            <img src={images[0]} alt="" className="products-page__thumb" />
          ) : (
            <div className="products-page__thumb-placeholder" />
          ),
      },
      {
        title: 'Название',
        dataIndex: 'name',
        render: (name: string, record) => (
          <div className="products-page__name">
            <Link to={`/products/${record.id}`}>{name}</Link>
            <span className="products-page__slug">{record.slug}</span>
          </div>
        ),
      },
      {
        title: 'Бренд',
        dataIndex: 'brand',
        width: 140,
      },
      {
        title: 'Цена',
        dataIndex: 'price',
        width: 120,
        render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
      },
      {
        title: 'Вариации',
        dataIndex: 'variations',
        width: 100,
        render: (variations: Product['variations']) => variations?.length ?? 0,
      },
      {
        title: 'Статус',
        dataIndex: 'isActive',
        width: 120,
        render: (isActive: boolean, record) => (
          <Space size={4} wrap>
            <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Активен' : 'Скрыт'}</Tag>
            <Tag color={record.inStock ? 'blue' : 'orange'}>
              {record.inStock ? 'В наличии' : 'Нет'}
            </Tag>
          </Space>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 110,
        render: (_, record) => (
          <Link to={`/products/${record.id}`}>
            <Button type="link">Открыть</Button>
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <Container className="products-page admin-page">
      <PageHeader
        title="Товары"
        subtitle="Список товаров каталога: просмотр и редактирование"
        actions={
          <Space>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Link to="/products/create">
              <Button type="primary">Создать</Button>
            </Link>
          </Space>
        }
      />

      <div className="products-page__toolbar">
        <Input.Search
          className="products-page__search"
          placeholder="Поиск по названию, slug, бренду"
          allowClear
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onSearch={value => {
            setPage(1)
            setSearch(value.trim())
          }}
          enterButton="Найти"
        />
      </div>

      <Table<Product>
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={isFetching}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: meta?.total ?? 0,
          showSizeChanger: false,
          onChange: nextPage => setPage(nextPage),
        }}
      />
    </Container>
  )
}
