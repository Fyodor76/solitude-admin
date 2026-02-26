import React from 'react'

import { CategoryMenuItem } from '@/shared/lib/api/api-categories/types'

import { CategoryToAntTree } from '../types/type'

export const buildCategoriesTree = (categoriesItems: CategoryMenuItem[]) => {
  const categories: Record<string, CategoryMenuItem & { children: CategoryMenuItem[] }> = {}

  categoriesItems.forEach(category => {
    categories[category.id] = {
      ...category,
      children: [],
    }
  })

  const tree: CategoryMenuItem[] = []

  categoriesItems.forEach(category => {
    if (category.parentId === null) {
      tree.push(categories[category.id])
    } else {
      if (categories[category.parentId]) {
        categories[category.parentId].children.push(categories[category.id])
      }
    }
  })
  return tree
}

export const transformToAntTree = (
  tree: CategoryMenuItem[],
  callbacks: { onEdit: (id: string) => void; onDelete: (id: string) => void }
) => {
  return tree.map(el => {
    const newObj: CategoryToAntTree = {
      key: el.id,
      title: (
        <div>
          <span>{el.name}</span>
          <button onClick={() => callbacks.onEdit(el.id)}>✏️</button>
          <button onClick={() => callbacks.onDelete(el.id)}>🗑️</button>
        </div>
      ),
      children: [],
    }
    if (el.children && el.children.length > 0) {
      newObj.children = transformToAntTree(el.children, callbacks)
    }
    return newObj
  })
}
