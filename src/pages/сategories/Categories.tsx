import React, { useEffect, useState } from 'react'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { useLazyGetProductsByCategoryIdQuery } from '@/shared/lib/api/api-products/apiProducts'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Tree } from 'antd'

import { transformToAntTree } from './helpers/categoryTreeHelper'
import EditCategoryModal from './modal/EditCategoryModal'
import { CategoryToAntTree } from './types/type'

export interface EditFormData {
  name: string
  slug: string
  description: string
  sortOrder: number
  parentId: string | null
  imageId: string | null
}

export interface CreateFormData {
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

  const InitialDataCreat = {
    name: '',
    slug: '',
    description: '',
    parentId: null,
    imageId: '',
    sortOrder: 0,
    type: '',
  }
  const { data: categoriesTreeData, isLoading, error, refetch } = useGetCategoriesTreeQuery()
  const [updateCategory] = useUpdateCategoryByIdMutation()
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [triggerGetProducts] = useLazyGetProductsByCategoryIdQuery()
  const [categories, setCategories] = useState<CategoryToAntTree[]>([])
  const [editFormDataModal, setEditFormDataModal] = useState<EditFormData>({
    name: '',
    slug: '',
    description: '',
    sortOrder: 0,
    parentId: null,
    imageId: '',
  })
  const [createFormDataModal, setCreateFormDataModal] = useState<CreateFormData>(InitialDataCreat)
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
    const products = await triggerGetProducts(categoryId).unwrap()
    if (products?.data && products?.data.length > 0) {
      alert('Сначала удалите все товары в этой категории')
    } else {
      try {
        await deleteCategory(categoryId).unwrap()
        refetch()
        alert('Категория успешно удалена!')
      } catch (error) {
        console.log('Ошибка удаления категории!', error)
      }
    }
  }

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
    for (const category of categories) {
      result.push(category)
      if (category.children?.length) {
        result = [...result, ...getAllCategories(category.children)]
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
        console.log('🟢 Категория из БД:', category) // 👈 ЕСТЬ ЛИ imageId?
        console.log('🟢 imageId из БД:', category.imageId)
        setEditFormDataModal({
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

  const handleUpdateCategory = async (id: string, editInput: EditFormData) => {
    console.log('📤 ОТПРАВКА НА СЕРВЕР (edit):', editInput) // 👈 СМОТРИТЕ СЮДА!
    console.log('📤 imageId:', editInput.imageId) // Есть ли значение?
    try {
      const response = await updateCategory({ id, data: editInput }).unwrap()
      console.log('✅ Ответ сервера:', response) // Что вернул сервер?
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
      await createCategory(createFormDataModal).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
      refetch()
    } catch (error) {
      console.log('Ошибка создания категории!', error)
    }
  }

  return (
    <>
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
        valueEdit={editFormDataModal}
        valueCreate={createFormDataModal}
        allCategories={allCategories}
        onClose={editModal.onClose}
        setEditFormDataModal={setEditFormDataModal}
        onSaveEdit={handleUpdateCategory}
        onSaveCreate={createNewCategory}
        setCreateFormDataModal={setCreateFormDataModal}
        setMode={setMode}
      />
    </>
  )
}

export default Categories
