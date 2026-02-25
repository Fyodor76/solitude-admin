import React, { useEffect, useState } from 'react'

import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from '@/shared/lib/api/api-categories/apiCategories'
import { useGetProductsByCategoryIdQuery } from '@/shared/lib/api/api-products/apiProducts'
import { Tree } from 'antd'

import { handleEdit } from './categoryHelper'
import { buildCategoriesTree, transformToAntTree } from './categoryHelper'
import { CategoryToAntTree } from './type'

const Categories = () => {
  const { data: categoriesData, isLoading, error, refetch } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const { data: products } = useGetProductsByCategoryIdQuery(selectedCategoryId ?? '', {
    skip: !selectedCategoryId,
  })

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return

    // ШАГ 1: Если это первое нажатие - загружаем товары
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId)
      alert('Проверяем товары... Нажмите Удалить еще раз через 1 секунду')

      // Ждем 1 секунду, чтобы товары загрузились
      setTimeout(() => {
        handleDelete(categoryId) // вызываем эту же функцию снова!
      }, 1000)
      return
    }

    // ШАГ 2: Второй вызов функции (через секунду)
    // Проверяем, загрузились ли товары
    if (!products) {
      alert('Товары еще грузятся, подождите еще секунду')
      setTimeout(() => {
        handleDelete(categoryId) // снова вызываем
      }, 1000)
      return
    }

    // ШАГ 3: Проверяем товары
    if (products.data && products.data.length > 0) {
      alert('Сначала удалите все товары в этой категории')
      setSelectedCategoryId(null) // сбрасываем
      return
    }

    // ШАГ 4: Удаляем
    try {
      await deleteCategory(categoryId).unwrap()
      refetch()
      alert('Категория успешно удалена!')
      setSelectedCategoryId(null)
    } catch (error) {
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
