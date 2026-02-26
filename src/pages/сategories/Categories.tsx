import React, { useEffect, useState } from 'react'

import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { useGetProductsByCategoryIdQuery } from '@/shared/lib/api/api-products/apiProducts'
import EditCategoryModal from '@/shared/ui/modal/EditCategoryModal'
import { useModal } from '@/shared/ui/modal/useModal'
import { Tree } from 'antd'

import { buildCategoriesTree, transformToAntTree } from './helpers/categoryTreeHelper'
import { CategoryToAntTree } from './types/type'

const Categories = () => {
  const editModal = useModal()
  const { data: categoriesData, isLoading, error, refetch } = useGetCategoriesQuery()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])
  const [editInput, setEditInput] = useState('')

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const { data: products, isLoading: productsLoading } = useGetProductsByCategoryIdQuery(
    deleteCategoryId ?? '',
    {
      skip: !deleteCategoryId,
    }
  )
  const [updateCategory] = useUpdateCategoryByIdMutation()

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

  const handleEdit = (categoryId: string) => {
    const category = categoriesData?.data.find(cat => cat.id === categoryId)
    if (category) {
      setEditInput(category.name)
      editModal.onOpen(category)
    }
  }

  const handleUpdateCategory = async (id: string, newName: string) => {
    try {
      await updateCategory({ id, data: { name: newName } }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования категории!', error)
    }
  }

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
      <EditCategoryModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        category={editModal.content}
        onSave={handleUpdateCategory}
        value={editInput}
        onChange={e => setEditInput(e.target.value)}
      />
    </>
  )
}

export default Categories
