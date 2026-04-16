import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'

import { CategoryToAntTree } from '../types/type'

export const transformToAntTree = (
  tree: BaseCategoryTree[],
  callbacks: {
    onEdit: (id: string) => void
    onDelete: (id: string, imageId?: string, folder?: string) => void
  },
  folder: string = 'products'
) => {
  const sortedTree = [...tree].sort((a, b) => {
    const orderDiff = (a.sortOrder || 0) - (b.sortOrder || 0)
    if (orderDiff !== 0) return orderDiff
    return a.id.localeCompare(b.id)
  })
  return sortedTree.map(el => {
    const newObj: CategoryToAntTree = {
      key: el.id,
      title: (
        <div>
          <span>{el.name}</span>
          <button onClick={() => callbacks.onEdit(el.id)}>✏️</button>
          <button onClick={() => callbacks.onDelete(el.id, el.imageId ?? undefined, folder)}>
            🗑️
          </button>
        </div>
      ),
      children: el.children?.length > 0 ? transformToAntTree(el.children, callbacks, folder) : [],
    }
    return newObj
  })
}
