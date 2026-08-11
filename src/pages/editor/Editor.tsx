import React, { useEffect, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import {
  useCreateNewEditorMutation,
  useGetAllEditorsQuery,
  useUpdateEditorMutation,
} from '@/shared/lib/api/editor/Editor'
import { EditorPatchRequest, Variants } from '@/shared/lib/api/editor/types'
import { useGetProductAttributeByTypeQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Button } from 'antd'

import { EDITOR_TABS, initialStateEditor } from './const'
import './Editor.scss'
import EditorsList from './EditorsList'
import { toEditorColors } from './helpers/editorTransformers'
import ModalEditor from './modal/modalEditor'
import TabsEditor from './TabsEditor'
import { EditorTabType, FormEditorType } from './types'

const Editor = () => {
  const { data: editors, isLoading: editorsLoading, refetch } = useGetAllEditorsQuery()
  const { data: categoriesData } = useGetCategoriesTreeQuery()
  const [updateEditor] = useUpdateEditorMutation()
  const [createEditor] = useCreateNewEditorMutation()
  const { data, isLoading, error } = useGetProductAttributeByTypeQuery('color')

  const [activeTab, setActiveTab] = useState<EditorTabType>(EDITOR_TABS.BASE)
  const [activeConfigurationId, setActiveConfigurationId] = useState<string | null>(null)
  const [formEditor, setFormEditor] = useState<FormEditorType>(initialStateEditor)
  const [originalVariants, setOriginalVariants] = useState<Variants[]>([])
  const modal = useModal()
  const configurations = editors?.data || []
  const categories = categoriesData?.data
  const colors = toEditorColors(data?.data?.[0]?.values || [])
  console.log(editors)
  useEffect(() => {
    if (configurations.length > 0 && !activeConfigurationId) {
      const firstConfig = configurations[0]
      handleSelectConfiguration(firstConfig)
    }
  }, [configurations])
  const handleSelectConfiguration = (config: FormEditorType) => {
    setOriginalVariants(config.variants || [])
    setActiveConfigurationId(config.id)
    setFormEditor({
      id: config.id,
      categoryId: config.categoryId,
      title: config.title,
      isActive: true,
      colors: config.colors || [],
      variants: config.variants || [],
      specifications: config.specifications || [],
      createdAt: config.createdAt || '',
      updatedAt: config.updatedAt || '',
    })
  }

  const handleInput = (v: any, field: keyof FormEditorType) => {
    setFormEditor(prev => ({
      ...prev,
      [field]: v,
    }))
  }

  const handleSave = async (id: string, data: EditorPatchRequest) => {
    try {
      console.log('Сохранить:', data)
      await updateEditor({ id, ...data }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка обновления редактора', error)
    }
  }
  const openModal = () => {
    setFormEditor(initialStateEditor)
    modal.onOpen(formEditor)
  }
  return (
    <div className="wrapper-editor">
      <div className="header-editor">
        <div>
          <h1 style={{ fontSize: 32, color: '#000', marginBottom: 24 }}>Редактор</h1>
          <span>Настройки конструктора для категорий</span>
        </div>
        <div className="header-editor-btns">
          <Button className="btn-update" type="default">
            Обновить
          </Button>
          <Button onClick={openModal} type="primary">
            Создать
          </Button>
        </div>
      </div>
      <TabsEditor setActiveTab={setActiveTab} />
      {activeTab === EDITOR_TABS.BASE && (
        <EditorsList
          categories={categories}
          configurations={configurations}
          activeConfigurationId={activeConfigurationId}
          formEditor={formEditor}
          originalVariants={originalVariants}
          handleSelectConfiguration={handleSelectConfiguration}
          handleSave={handleSave}
          handleInput={handleInput}
          setActiveConfigurationId={setActiveConfigurationId}
        />
      )}
      <ModalEditor
        categories={categories}
        isOpen={modal.isOpen}
        formEditor={formEditor}
        closeModal={modal.onClose}
        handleInput={handleInput}
        colors={colors}
      />
    </div>
  )
}

export default Editor
