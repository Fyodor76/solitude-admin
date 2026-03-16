import React, { useEffect, useState } from 'react'

import {
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useServerActions } from '@/shared/lib/hooks/useSeverActions'
import { Tree } from 'antd'

import { InitialFormData, MODES } from './const/constans'
import { transformToAntTree } from './helpers/categoryTreeHelper'
import EditCategoryModal from './modal/EditCategoryModal'
import { CategoryToAntTree } from './types/type'

export interface FormData {
  name: string
  slug: string
  description: string
  parentId: string | null
  imageId: string | null
  sortOrder: number
  type?: string
}

const Categories = () => {
  const editModal = useModal()

  const { createNewCategory, handleDelete } = useServerActions()

  const { data: categoriesTreeData, isLoading, error, refetch } = useGetCategoriesTreeQuery()
  const [updateCategory] = useUpdateCategoryByIdMutation()

  const [categories, setCategories] = useState<CategoryToAntTree[]>([])
  const [formDataModal, setFormDataModal] = useState<FormData>(InitialFormData)

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
        setFormDataModal({
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

  const handleUpdateCategory = async (id: string, editInput: FormData) => {
    console.log('handleUpdateCategory получил:', editInput)
    try {
      await updateCategory({ id, data: editInput }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования категории!', error)
    }
  }

  const handleCreateCategory = () => {
    setFormDataModal(InitialFormData)
    editModal.setMode(MODES.CREATE)
    editModal.onOpen()
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
        value={formDataModal}
        allCategories={allCategories}
        mode={editModal.mode}
        edit={MODES.EDIT}
        create={MODES.CREATE}
        setMode={editModal.setMode}
        onClose={editModal.onClose}
        setFormDataModal={setFormDataModal}
        onSaveEdit={handleUpdateCategory}
        onSaveCreate={createNewCategory}
      />
    </>
  )
}

export default Categories
