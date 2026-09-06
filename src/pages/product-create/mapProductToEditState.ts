import { StockItem } from '@/shared/lib/api/products/types'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'

import { Product, ProductVariation } from '@/app/types/product'

import { DraftVariation, ProductCreateWizardState, ProductImageItem, StockDraftRow } from './types'

function isEmptyPlaceholder(item: StockItem): boolean {
  return (
    !item.sizeId &&
    (item.quantity ?? 0) === 0 &&
    (item.reserved ?? 0) === 0 &&
    String(item.sku || '').startsWith('EMPTY-')
  )
}

function toImageItems(images: string[]): ProductImageItem[] {
  return images.filter(Boolean).map(fileId => ({
    fileId,
    url: resolveMediaUrl(fileId) || fileId,
  }))
}

function variationImageIds(variation: ProductVariation): string[] {
  const ids = [...(variation.images ?? [])]
  if (variation.mainImage && !ids.includes(variation.mainImage)) {
    ids.unshift(variation.mainImage)
  }
  return ids.filter(Boolean)
}

function sortVariations(list: ProductVariation[]): ProductVariation[] {
  return [...list].sort((a, b) => {
    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    return (a.createdAt || '').localeCompare(b.createdAt || '')
  })
}

export interface ProductEditSnapshot {
  variationIds: string[]
  stock: Array<{ id: string; variationId: string; reserved: number }>
  images: string[]
}

export function mapProductToEditState(
  product: Product,
  stockItems: StockItem[]
): { state: ProductCreateWizardState; snapshot: ProductEditSnapshot } {
  const variationsSorted = sortVariations(product.variations ?? [])
  const productImages = product.images ?? []

  const variations: DraftVariation[] = variationsSorted.map(variation => {
    const imageIds = variationImageIds(variation)
    const items = toImageItems(imageIds)
    const mainId = variation.mainImage || items[0]?.fileId
    const ordered = mainId
      ? [
          ...items.filter(item => item.fileId === mainId),
          ...items.filter(item => item.fileId !== mainId),
        ]
      : items
    const imageIdSet = new Set(imageIds)

    return {
      key: variation.id,
      id: variation.id,
      name: variation.name || '',
      slug: variation.slug || '',
      sku: variation.sku || '',
      slugLocked: true,
      skuLocked: true,
      price: variation.price,
      comparePrice: variation.comparePrice ?? null,
      colorId: variation.colorId || variation.color?.id || '',
      description: variation.description || '',
      modelParameters: variation.modelParameters || '',
      mainImage: ordered[0] || null,
      images: ordered,
      showcaseFileIds: productImages.filter(id => imageIdSet.has(id)),
    }
  })

  const stock = stockItems.filter(item => !isEmptyPlaceholder(item))
  const stockRows: StockDraftRow[] = stock.map(item => ({
    key: `${item.variationId}:${item.sizeId || 'none'}`,
    variationKey: item.variationId,
    sizeId: item.sizeId || '',
    quantity: item.quantity ?? 0,
    sku: item.sku || '',
    id: item.id,
    reserved: item.reserved ?? 0,
    location: item.location || '',
  }))

  const selectedSizeIds = [...new Set(stockRows.map(row => row.sizeId).filter(Boolean))]

  const attributeSelections = (product.attributes ?? [])
    .filter(attr => attr.type !== 'color')
    .filter(attr => (attr.values ?? []).length > 0)
    .map(attr => ({
      attributeId: attr.id,
      valueIds: (attr.values ?? []).map(value => value.id),
    }))

  return {
    state: {
      step: 0,
      maxReachedStep: 3,
      basics: {
        name: product.name || '',
        slug: product.slug || '',
        slugLocked: true,
        description: product.description || '',
        price: product.price,
        categoryId: product.categoryId || '',
        brand: product.brand || '',
        material: product.material || '',
        modelParameters: product.modelParameters || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        showOnLanding: product.showOnLanding ?? false,
      },
      variations,
      attributeSelections,
      selectedSizeIds,
      stockRows,
    },
    snapshot: {
      variationIds: variationsSorted.map(item => item.id),
      stock: stock.map(item => ({
        id: item.id,
        variationId: item.variationId,
        reserved: item.reserved ?? 0,
      })),
      images: [...productImages],
    },
  }
}

/** Порядок витрины: сначала уже стоявшие на сайте, затем новые отметки. */
export function collectShowcaseImages(
  variations: DraftVariation[],
  originalImages: string[]
): string[] {
  const showcased = variations.flatMap(item => item.showcaseFileIds ?? [])
  const showcasedSet = new Set(showcased)
  const preserved = originalImages.filter(id => showcasedSet.has(id))
  const extra: string[] = []
  for (const id of showcased) {
    if (!preserved.includes(id) && !extra.includes(id)) extra.push(id)
  }
  return [...preserved, ...extra]
}
