import React, { useEffect, useState } from 'react'

import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from '@/shared/lib/api/api-categories/apiCategories'
import { Tree } from 'antd'

import { handleEdit } from './categoryHelper'
import { buildCategoriesTree, transformToAntTree } from './categoryHelper'
import { CategoryToAntTree } from './type'

const Categories = () => {
  const { data: categoriesData, isLoading, error, refetch } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return

    try {
      await deleteCategory(categoryId).unwrap()
      refetch()
    } catch (error: any) {
      if (error.error === 'Referenced entity not found') {
        alert('Сначала удалите все товары в этой категории, а потом саму пустую категорию')
      }
      console.log('Ошибка удаления категории!', error)
    }
  }

  useEffect(() => {
    if (categoriesData) {
      const sympleTree = buildCategoriesTree(categoriesData.data)
      const antTree = transformToAntTree(sympleTree, { onEdit: handleEdit, onDelete: handleDelete })
      setCategories(antTree)
    }
  }, [categoriesData])

  return (
    <div className="allCategories">
      {isLoading && <span>Загрузка...</span>}
      {error && <span>Ошибочка вышла...</span>}
      {categoriesData && <Tree treeData={categories} defaultExpandAll showLine></Tree>}
    </div>
  )
}

export default Categories
