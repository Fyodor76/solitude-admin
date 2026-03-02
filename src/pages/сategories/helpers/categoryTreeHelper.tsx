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
  console.log('🔄 transformToAntTree получил:', tree)
  return tree.map(el => {
    console.log(`📦 Обрабатываем: ${el.name}`, {
      id: el.id,
      name: el.name,
      childrenCount: el.children?.length || 0,
      hasChildren: el.children && el.children.length > 0,
    })
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
      console.log(
        `🌳 У ${el.name} есть дети:`,
        el.children.map(c => c.name)
      )
      newObj.children = transformToAntTree(el.children, callbacks)
    } else {
      console.log(`🍃 У ${el.name} нет детей`)
    }
    return newObj
  })
}
