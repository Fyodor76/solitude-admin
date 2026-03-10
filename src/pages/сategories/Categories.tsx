import React, { useEffect, useState } from 'react'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { useGetProductsByCategoryIdQuery } from '@/shared/lib/api/api-products/apiProducts'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Tree } from 'antd'

import { transformToAntTree } from './helpers/categoryTreeHelper'
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
      const sympleTree = categoriesTreeData.data
      const antTree = transformToAntTree(sympleTree, { onEdit: handleEdit, onDelete: handleDelete })
      setCategories([...antTree])
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

  const findCategoryById = (
    categories: BaseCategoryTree[],
    id: string
  ): BaseCategoryTree | null => {
    for (let el of categories) {
      if (el.id === id) {
        return el
      }
      if (el.children) {
        const result: BaseCategoryTree | null = findCategoryById(el.children, id)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const getAllCategories = (categories: BaseCategoryTree[]): BaseCategoryTree[] => {
    let result: BaseCategoryTree[] = []
    for (let cat of categories) {
      result.push(cat)
      if (cat.children?.length) {
        result = [...result, ...getAllCategories(cat.children)]
      }
    }
    return result
  }

  const allCategories = categoriesTreeData?.data ? getAllCategories(categoriesTreeData.data) : []

  const handleEdit = (categoryId: string) => {
    const categories = categoriesTreeData?.data
    if (categories) {
      const category = findCategoryById(categories, categoryId)
      if (category) {
        setEditInput({
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          parentId: category.entity ? category.entity.parentId : null,
          imageId: category.imageId ?? null,
        })
        editModal.onOpen(category)
      }
    }
  }

  const handleUpdateCategory = async (id: string, editInput: InputFormData) => {
    try {
      await updateCategory({ id, data: editInput }).unwrap()
      console.log('✅ Сервер ответил "успешно"')
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
        allCategories={allCategories}
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
