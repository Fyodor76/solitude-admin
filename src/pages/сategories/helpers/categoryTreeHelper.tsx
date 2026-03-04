import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'

import { CategoryToAntTree } from '../types/type'

{
  /*export const buildCategoriesTree = (categoriesItems: CategoriesTree[]) => {
  console.log(
    '🏗️ buildCategoriesTree получил:',
    categoriesItems.map(c => ({
      id: c.id,
      name: c.name,
      parentId: c.parentId,
    }))
  )

  // Проверка всех parentId
  console.log('🔍 Проверка связей:')
  categoriesItems.forEach(cat => {
    if (cat.parentId) {
      const parentExists = categoriesItems.some(p => p.id === cat.parentId)
      console.log(
        `  ${cat.name} (${cat.id}) -> parentId: ${cat.parentId} - ${parentExists ? '✅ родитель найден' : '❌ родитель НЕ найден'}`
      )
    }
  })

  const categories: Record<string, CategoriesTree & { children: CategoriesTree[] }> = {}

  categoriesItems.forEach(category => {
    categories[category.id] = {
      ...category,
      children: [],
    }
  })

  const tree: CategoriesTree[] = []

  categoriesItems.forEach(category => {
    if (category.parentId === null) {
      tree.push(categories[category.id])
      console.log(`📌 Корневая: ${category.name}`)
    } else {
      if (categories[category.parentId]) {
        categories[category.parentId].children.push(categories[category.id])
        console.log(`🔗 ${category.name} стала дочерней для ${categories[category.parentId].name}`)
      } else {
        // ВАЖНО: логируем, если родитель не найден!
        console.warn(
          `❌ ОШИБКА: ${category.name} (id: ${category.id}) ссылается на parentId ${category.parentId}, но такой категории нет в данных!`
        )
        // Временно добавляем как корневую, чтобы не потерять
        tree.push(categories[category.id])
        console.log(`📌 Временно добавлена как корневая: ${category.name}`)
      }
    }
  })

  console.log(
    '🌳 Итоговое дерево (с детьми):',
    tree.map(t => ({
      name: t.name,
      id: t.id,
      childrenCount: t.children?.length || 0,
      children: t.children?.map(c => ({ name: c.name, id: c.id })),
    }))
  )

  return tree
}
*/
}
export const transformToAntTree = (
  tree: BaseCategoryTree[],
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
      children: el.children?.length > 0 ? transformToAntTree(el.children, callbacks) : [],
    }
    return newObj
  })
}
