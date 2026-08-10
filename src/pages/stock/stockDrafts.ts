import { StockItem } from '@/shared/lib/api/products/types'

export type StockDraftFields = {
  draftSku: string
  draftQuantity: number
  draftLocation: string
}

export function isStockRowDirty(
  row: Pick<StockItem, 'sku' | 'quantity' | 'location'> & StockDraftFields
): boolean {
  return (
    row.draftSku !== (row.sku || '') ||
    row.draftQuantity !== (row.quantity ?? 0) ||
    row.draftLocation !== (row.location || '')
  )
}

/** При refetch сохраняет несохранённые draft-поля. */
export function mergeStockDrafts<T extends StockItem & StockDraftFields>(
  prev: T[],
  next: T[]
): T[] {
  const prevById = new Map(prev.map(row => [row.id, row]))

  return next.map(row => {
    const existing = prevById.get(row.id)
    if (!existing || !isStockRowDirty(existing)) {
      return row
    }
    return {
      ...row,
      draftSku: existing.draftSku,
      draftQuantity: existing.draftQuantity,
      draftLocation: existing.draftLocation,
    }
  })
}
