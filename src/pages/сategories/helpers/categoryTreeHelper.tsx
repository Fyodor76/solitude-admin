import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import Icon from '@/shared/ui/icons/Icon'

import { CategoryToAntTree } from '../types/type'
import CategoryTitle from './CategoryTitle'
import './CategoryTreeHelper.scss'

export const transformToAntTree = (
  tree: BaseCategoryTree[],
  callbacks: {
    onEdit: (id: string) => void
    onDelete: (id: string, imageId?: string, folder?: string) => void
    onCreate: () => void
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
        <CategoryTitle
          name={el.name}
          onEdit={() => callbacks.onEdit(el.id)}
          onDelete={() => callbacks.onDelete(el.id, el.imageId ?? undefined, folder)}
          onCreate={callbacks.onCreate}
        />
      ),
      children: el.children?.length > 0 ? transformToAntTree(el.children, callbacks, folder) : [],
    }
    return newObj
  })
}
