import React, { useCallback, useMemo, useState } from 'react'

import {
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/api-categories/apiCategories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useServerActions } from '@/shared/lib/hooks/useSeverActions'
import Icon from '@/shared/ui/icons/Icon'
import { Button } from 'antd'

import './Categories.scss'
import { InitialFormData, MODES } from './const/constans'
import CategoryTree from './helpers/CategoryTree'
import { mapTreeToForm } from './mappers/categoryMappers'
import EditCategoryModal from './modal/EditCategoryModal'
import { FormData } from './types/type'

const Categories = () => {
  const editModal = useModal()

  const { createNewCategory, handleDelete } = useServerActions()

  const { data: categoriesTreeData, isLoading, error, refetch } = useGetCategoriesTreeQuery()
  const [updateCategory] = useUpdateCategoryByIdMutation()

  const [formDataModal, setFormDataModal] = useState<FormData>(InitialFormData)
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

  const handleEdit = useCallback(
    (categoryId: string) => {
      const categories = categoriesTreeData?.data
      if (categories) {
        const category = findCategoryById(categories, categoryId)
        if (category) {
          setFormDataModal(mapTreeToForm(category))
          editModal.onOpen(category)
        }
      }
    },
    [categoriesTreeData, editModal]
  )
  const handleCreateCategory = useCallback(
    (id?: string) => {
      if (id) {
        setFormDataModal({
          ...InitialFormData,
          parentId: id,
        })
      } else {
        setFormDataModal(InitialFormData)
      }
      editModal.setMode(MODES.CREATE)
      editModal.onOpen()
    },
    [editModal]
  )

  const handleUpdateCategory = async (id: string, editInput: FormData) => {
    console.log('handleUpdateCategory получил:', editInput)
    try {
      await updateCategory({ id, data: editInput }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования категории!', error)
    }
  }

  const categories = useMemo(() => categoriesTreeData?.data ?? [], [categoriesTreeData])

  const allCategories = useMemo(() => {
    if (!categoriesTreeData?.data) return []
    return getAllCategories(categoriesTreeData.data)
  }, [categoriesTreeData])

  return (
    <div className="containerCategories">
      <div className="titleCategories">
        <h2 className="title-h2">Категории товаров</h2>
        <Button onClick={() => handleCreateCategory()} className="btn-title-add">
          <Icon name="add"></Icon> Добавить категорию
        </Button>
      </div>
      <div className="allCategories">
        {isLoading && <span>Загрузка...</span>}
        {error && <span>Ошибочка вышла...</span>}

        {categories.length > 0 ? (
          <CategoryTree
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateCategory}
          />
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
    </div>
  )
}

export default React.memo(Categories)
