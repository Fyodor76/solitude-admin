import React, { useEffect, useState } from 'react'

import {
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useServerActions } from '@/shared/lib/hooks/useSeverActions'
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
const MODES = {
  EDIT: 'edit',
  CREATE: 'create',
}
const Categories = () => {
  const editModal = useModal()
  const { createNewCategory, handleDelete } = useServerActions()
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

  useEffect(() => {
    if (categoriesTreeData?.data) {
      const sympleTree = categoriesTreeData.data
      const antTree = transformToAntTree(sympleTree, { onEdit: handleEdit, onDelete: handleDelete })
      setCategories([...antTree])
    }
  }, [categoriesTreeData])

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
    console.log('handleUpdateCategory получил:', editInput) // 👈 проверьте imageId
    try {
      await updateCategory({ id, data: editInput }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования категории!', error)
    }
  }

  const handleCreateCategory = () => {
    editModal.onOpen()
    editModal.setMode(MODES.CREATE)
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
        category={editModal.content}
        valueEdit={editFormDataModal}
        valueCreate={createFormDataModal}
        allCategories={allCategories}
        mode={editModal.mode}
        edit={MODES.EDIT}
        create={MODES.CREATE}
        setMode={editModal.setMode}
        onClose={editModal.onClose}
        setEditFormDataModal={setEditFormDataModal}
        onSaveEdit={handleUpdateCategory}
        onSaveCreate={createNewCategory}
        setCreateFormDataModal={setCreateFormDataModal}
      />
    </>
  )
}

export default Categories
