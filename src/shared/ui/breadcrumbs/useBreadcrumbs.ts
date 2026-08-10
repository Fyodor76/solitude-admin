import { useMemo } from 'react'

import { useGetOrderByIdQuery } from '@/shared/lib/api/orders/Orders'
import {
  useGetProductByIdQuery,
  useGetProductVariationByIdQuery,
} from '@/shared/lib/api/products/Products'
import { useLocation, useParams } from 'react-router-dom'

import { ROUTES } from '@/app/lib/config/navigation'

import { BreadcrumbsItemProps } from './BreadcrumbsItems'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function truncateLabel(value: string, max = 36): string {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

function formatOrderShort(shortCode?: string, trackingId?: string, orderId?: string): string {
  if (shortCode?.trim()) return shortCode.trim().toUpperCase()
  const raw = (trackingId || orderId || '').replace(/[^a-zA-Z0-9]/g, '')
  return raw ? raw.slice(0, 8).toUpperCase() : 'Заказ'
}

export const useBreadcrumbs = (): BreadcrumbsItemProps[] => {
  const location = useLocation()
  const { productId, variationId, orderId } = useParams<{
    productId?: string
    variationId?: string
    orderId?: string
  }>()

  const path = location.pathname
  const isProductContext = path.startsWith('/products/')
  const isOrderContext = path.startsWith('/orders/') && Boolean(orderId)

  const { data: productResponse } = useGetProductByIdQuery(productId || '', {
    skip: !isProductContext || !productId || !UUID_RE.test(productId),
  })
  const { data: variationResponse } = useGetProductVariationByIdQuery(variationId || '', {
    skip: !isProductContext || !variationId || variationId === 'new' || !UUID_RE.test(variationId),
  })
  const { data: orderResponse } = useGetOrderByIdQuery(orderId || '', {
    skip: !isOrderContext || !orderId || !UUID_RE.test(orderId),
  })

  const productName = productResponse?.data?.name
  const variationName = variationResponse?.data?.name
  const order = orderResponse?.data

  return useMemo(() => {
    const crumbs: BreadcrumbsItemProps[] = [{ label: ROUTES.HOME.label, href: ROUTES.HOME.path }]

    if (path === '/' || path === '') {
      return crumbs
    }

    if (path.startsWith('/products')) {
      crumbs.push({ label: ROUTES.PRODUCTS.label, href: ROUTES.PRODUCTS.path })

      if (path === '/products' || path === '/products/') {
        return crumbs
      }

      if (path.startsWith('/products/create')) {
        crumbs.push({ label: ROUTES.PRODUCT_CREATE.label })
        return crumbs
      }

      if (productId) {
        const productHref = `/products/${productId}`
        crumbs.push({
          label: truncateLabel(productName || 'Товар'),
          href: productHref,
        })

        if (path.includes('/variations/new')) {
          crumbs.push({ label: 'Новая вариация' })
          return crumbs
        }

        if (variationId && variationId !== 'new') {
          const variationHref = `/products/${productId}/variations/${variationId}`
          crumbs.push({
            label: truncateLabel(variationName || 'Вариация'),
            href: variationHref,
          })

          if (path.endsWith('/stock')) {
            crumbs.push({ label: 'Сток' })
          }
        }
      }

      return crumbs
    }

    if (path.startsWith('/orders')) {
      crumbs.push({ label: ROUTES.ORDERS.label, href: ROUTES.ORDERS.path })

      if (orderId) {
        crumbs.push({
          label: formatOrderShort(undefined, order?.trackingId, orderId),
        })
      }

      return crumbs
    }

    const pathnames = path.split('/').filter(Boolean)
    pathnames.forEach((_, index) => {
      const href = '/' + pathnames.slice(0, index + 1).join('/')
      const route = Object.values(ROUTES).find(r => r.path === href)
      if (!route || route.path === ROUTES.HOME.path) return
      crumbs.push({ label: route.label, href })
    })

    return crumbs
  }, [order?.trackingId, orderId, path, productId, productName, variationId, variationName])
}
