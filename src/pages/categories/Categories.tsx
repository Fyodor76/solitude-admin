import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useGetCategoriesTreeQuery,
  useUpdateCategoryByIdMutation,
} from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { CategoryRequest } from '@/shared/lib/api/categories/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { useServerActions } from '@/shared/lib/hooks/useSeverActions'
import Container from '@/shared/ui/container/Container'
import Icon from '@/shared/ui/icons/Icon'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Spin } from 'antd'

import './Categories.scss'
import { InitialFormData, MODES } from './const/constans'
import CategoryTree from './helpers/CategoryTree'
import { mapToСategoriesOptions, mapTreeToForm } from './mappers/categoryMappers'
import EditCategoryModal from './modal/EditCategoryModal'
import { FormData } from './types/type'

const categoryTypeOptions = mapToСategoriesOptions()

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

  const getAllCategories = (
    categories: BaseCategoryTree[],
    parentId: string | null = null
  ): BaseCategoryTree[] => {
    let result: BaseCategoryTree[] = []
    for (const category of categories) {
      result.push({
        ...category,
        parentId: category.parentId ?? category.entity?.parentId ?? parentId,
      })
      if (category.children?.length) {
        result = [...result, ...getAllCategories(category.children, category.id)]
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
          editModal.setMode(MODES.EDIT)
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
          type: categoryTypeOptions[0].value,
        })
      } else {
        setFormDataModal({
          ...InitialFormData,
          type: categoryTypeOptions[0].value,
        })
      }
      editModal.setMode(MODES.CREATE)
      editModal.onOpen()
    },
    [editModal]
  )

  const handleUpdateCategory = async (id: string, editInput: CategoryRequest) => {
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
    <Container className="categories-page admin-page">
      <PageHeader
        title="Категории товаров"
        actions={
          <Button type="primary" onClick={() => handleCreateCategory()}>
            <Icon name="add" />
            Добавить категорию
          </Button>
        }
      />

      <div className="categories-page__content">
        {isLoading ? (
          <div className="categories-page__loading">
            <Spin size="large" />
          </div>
        ) : categories.length > 0 ? (
          <CategoryTree
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreateCategory}
          />
        ) : (
          <div className="categories-page__empty">Нет категорий для отображения</div>
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
        categoryTypeOptions={categoryTypeOptions}
      />
    </Container>
  )
}

export default React.memo(Categories)
