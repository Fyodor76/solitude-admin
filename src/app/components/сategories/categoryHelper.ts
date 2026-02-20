import { CategoryMenuItem } from '@/shared/lib/api/api-categories/types'

import { CategoryToAntTree } from './type'

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

export const transformToAntTree = (tree: CategoryMenuItem[]): CategoryToAntTree[] => {
  return tree.map(el => {
    const newObj: CategoryToAntTree = {
      key: el.id,
      title: el.name,
      children: [],
    }
    if (el.children && el.children.length > 0) {
      newObj.children = transformToAntTree(el.children)
    }
    return newObj
  })
}
