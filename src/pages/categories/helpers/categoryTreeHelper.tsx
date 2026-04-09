import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'

export const sortCategoryTree = (tree: BaseCategoryTree[]): BaseCategoryTree[] => {
  return [...tree]
    .sort((a, b) => {
      const orderDiff = (a.sortOrder || 0) - (b.sortOrder || 0)
      if (orderDiff !== 0) return orderDiff
      return a.id.localeCompare(b.id)
    })
    .map(category => ({
      ...category,
      children: category.children.length > 0 ? sortCategoryTree(category.children) : [],
    }))
}

export const collectExpandableIds = (tree: BaseCategoryTree[]): string[] => {
  const ids: string[] = []

  tree.forEach(category => {
    if (category.children.length > 0) {
      ids.push(category.id)
      ids.push(...collectExpandableIds(category.children))
    }
  })

  return ids
}
