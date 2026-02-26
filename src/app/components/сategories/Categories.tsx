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

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const { data: products, isLoading: productsLoading } = useGetProductsByCategoryIdQuery(
    deleteCategoryId ?? '',
    {
      skip: !deleteCategoryId,
    }
  )
  useEffect(() => {
    if (categoriesData) {
      const sympleTree = buildCategoriesTree(categoriesData.data)
      const antTree = transformToAntTree(sympleTree, { onEdit: handleEdit, onDelete: handleDelete })
      setCategories(antTree)
    }
  }, [categoriesData])

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return
    setDeleteCategoryId(categoryId)
  }

  useEffect(() => {
    if (!deleteCategoryId || !products) {
      return
    }
    if (products.data && products.data.length > 0) {
      alert('Сначала удалите все товары в этой категории')
      setDeleteCategoryId(null)
    } else {
      const delCategory = async (id: string) => {
        try {
          await deleteCategory(id).unwrap()
          refetch()
          alert('Категория успешно удалена!')
        } catch (error) {
          console.log('Ошибка удаления категории!', error)
        } finally {
          setDeleteCategoryId(null)
        }
      }

      delCategory(deleteCategoryId)
    }
  }, [products, deleteCategoryId])
  return (
    <>
      {deleteCategoryId && productsLoading && (
        <div
          style={{
            padding: '10px',
            background: '#f0f5ff',
            color: '#1890ff',
            borderRadius: '4px',
            margin: '10px 0',
          }}
        >
          ⏳ Проверяем наличие товаров в категории...
        </div>
      )}
      <div className="allCategories">
        {isLoading && <span>Загрузка...</span>}
        {error && <span>Ошибочка вышла...</span>}
        {categoriesData && <Tree treeData={categories} defaultExpandAll showLine></Tree>}
      </div>
    </>
  )
}

export default Categories
