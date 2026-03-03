import React, { useEffect, useState } from 'react'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { useGetProductsByCategoryIdQuery } from '@/shared/lib/api/api-products/apiProducts'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Tree } from 'antd'

import { buildCategoriesTree, transformToAntTree } from './helpers/categoryTreeHelper'
import EditCategoryModal from './modal/EditCategoryModal'
import { CategoryToAntTree } from './types/type'

export interface InputFormData {
  name: string
  slug: string
  description: string
  sortOrder: number
  parentId: string | null
  imageId?: string | null
}

export interface InputCreateData {
  name: string
  slug: string
  description: string
  parentId: string | null
  imageId: string | null
  sortOrder: number
  type: string
}

const Categories = () => {
  const editModal = useModal()
  const { data: categoriesTreeData, isLoading, error, refetch } = useGetCategoriesTreeQuery()

  const [deleteCategory] = useDeleteCategoryMutation()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])
  const [editInput, setEditInput] = useState<InputFormData>({
    name: '',
    slug: '',
    description: '',

    sortOrder: 0,
    parentId: null,
  })

  const [createInput, setCreateInput] = useState<InputCreateData>({
    name: 'Test-name',
    slug: 't-shirts',
    description: 'Test description',
    parentId: null,
    imageId: '123-test',
    sortOrder: 0,
    type: 'category',
  })

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const { data: products, isLoading: productsLoading } = useGetProductsByCategoryIdQuery(
    deleteCategoryId ?? '',
    {
      skip: !deleteCategoryId,
    }
  )
  const [updateCategory] = useUpdateCategoryByIdMutation()
  const [createCategory] = useCreateCategoryMutation()
  const [mode, setMode] = useState('edit')

  useEffect(() => {
    if (categoriesTreeData?.data) {
      console.log(' Массив категорий:', categoriesTreeData.data)

      const sympleTree = categoriesTreeData.data
      const antTree = transformToAntTree(sympleTree, { onEdit: handleEdit, onDelete: handleDelete })
      setCategories(antTree)
    }
  }, [categoriesTreeData])

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
    const category = categoriesTreeData?.data.find(cat => cat.id === categoryId)
    if (category) {
      const categoryData = category.entity
      setEditInput({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        parentId: categoryData.parentId ?? null,
        imageId: categoryData.imageId ?? null,
      })
      console.log(`id категории : ${category.name} такое: ${category.id}`)
      editModal.onOpen(category)
    }
  }

  const handleUpdateCategory = async (id: string, editInput: InputFormData) => {
    try {
      await updateCategory({ id, data: editInput }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования категории!', error)
    }
  }

  const handleCreateCategory = () => {
    editModal.onOpen()
    setMode('create')
  }
  const createNewCategory = async () => {
    try {
      await createCategory(createInput).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
      refetch()
    } catch (error) {
      console.log('Ошибка создания категории!', error)
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
        <button onClick={handleCreateCategory}>➕ Добавить категорию</button>
        {categories.length > 0 ? (
          <Tree treeData={categories} defaultExpandAll showLine></Tree>
        ) : (
          !isLoading && <span>Нет категорий для отображения</span>
        )}
      </div>
      <EditCategoryModal
        isOpen={editModal.isOpen}
        mode={mode}
        category={editModal.content}
        valueEdit={editInput}
        valueCreate={createInput}
        onClose={editModal.onClose}
        setEditInput={setEditInput}
        onSaveEdit={handleUpdateCategory}
        onSaveCreate={createNewCategory}
        setCreateInput={setCreateInput}
        setMode={setMode}
      />
    </>
  )
}

export default Categories
