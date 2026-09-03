import React, { useEffect, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import {
  useCreateNewEditorMutation,
  useGetAllEditorsQuery,
  useUpdateEditorMutation,
} from '@/shared/lib/api/editor/Editor'
import { EditorTypeRequest, Variants } from '@/shared/lib/api/editor/types'
import { useGetProductAttributeByTypeQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Button, message } from 'antd'

import EditorColors from './components/EditorColors'
import EditorsList from './components/EditorsList'
import TabsEditor from './components/TabsEditor'
import { EDITOR_TABS, initialStateEditor } from './const'
import './Editor.scss'
import { toCreatePayload, toEditorColors, toPatchPayload } from './helpers/editorTransformers'
import useColorLocalChange from './hooks/useColorLocalChange'
import ModalEditor from './modal/ModalEditor'
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
  const modalForAddColor = useModal()

  const handleInput = (v: any, field: keyof FormEditorType) => {
    setFormEditor(prev => ({
      ...prev,
      [field]: v,
    }))
  }
  const { localDeletedColor, localAddNewColor } = useColorLocalChange({ formEditor, handleInput })
  const configurations = editors?.data || []
  const categories = categoriesData?.data
  const colors = toEditorColors(data?.data?.[0]?.values || [])
  console.log('📦 Данные из API:', data?.data?.[0]?.values)
  console.log('COLORS', colors)
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
    const colorsWithStatus =
      config.colors?.map(color => {
        const fullColor = colors.find(c => c.id === color.id) // ← берем из colors (с isActive)
        return {
          ...color,
          isActive: fullColor?.isActive ?? true,
        }
      }) || []
    setFormEditor({
      id: config.id,
      categoryId: config.categoryId,
      title: config.title,
      isActive: config.isActive ?? false,
      colors: colorsWithStatus,
      variants: config.variants || [],
      specifications: config.specifications || [],
      createdAt: config.createdAt || '',
      updatedAt: config.updatedAt || '',
    })
  }

  const handleSave = async (id: string, data: EditorTypeRequest) => {
    try {
      console.log('Сохранить:', data)
      await updateEditor({ id, data }).unwrap()
      refetch()
    } catch (error) {
      console.log('Ошибка обновления редактора', error)
    }
  }
  const openModal = () => {
    setFormEditor(initialStateEditor)
    console.log(colors)
    modal.onOpen()
  }
  const onSave = () => {
    if (!formEditor?.id) {
      message.warning('Нет данных для сохранения')
      return
    }

    try {
      const payload = toPatchPayload(formEditor, originalVariants)

      handleSave(formEditor.id, payload)
    } catch (error) {
      console.log('Ошибка в toPatchPayload:', error)
    }
  }

  const onSaveCreated = async (data: FormEditorType) => {
    if (!data.categoryId) {
      message.warning('Выберите категорию')
      return
    }

    const payload = toCreatePayload(data)
    try {
      await createEditor(payload).unwrap()
      message.success('Редактор успешно создан')
      modal.onClose()
      refetch()
      setFormEditor(initialStateEditor)
    } catch (error) {
      console.error('Ошибка создания:', error)
      message.error('Не удалось создать редактор')
    }
  }

  return (
    <div className="wrapper-editor">
      <div className="header-editor">
        <div>
          <h1>Редактор</h1>
          {activeTab === EDITOR_TABS.BASE && (
            <span className="header-editor-title">Настройки конструктора для категорий</span>
          )}
          {activeTab === EDITOR_TABS.COLORS && (
            <span className="header-editor-title">Конфигурация: {formEditor.title}</span>
          )}
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
      <TabsEditor setActiveTab={setActiveTab} activeTab={activeTab} />
      {activeTab === EDITOR_TABS.BASE && (
        <EditorsList
          categories={categories}
          configurations={configurations}
          activeConfigurationId={activeConfigurationId}
          formEditor={formEditor}
          originalVariants={originalVariants}
          onSave={onSave}
          handleSelectConfiguration={handleSelectConfiguration}
          handleSave={handleSave}
          handleInput={handleInput}
          setActiveConfigurationId={setActiveConfigurationId}
        />
      )}
      {activeTab === EDITOR_TABS.COLORS && (
        <EditorColors
          colors={formEditor.colors}
          colorsAttributies={colors}
          isOpen={modalForAddColor.isOpen}
          formEditor={formEditor}
          onSave={onSave}
          localDeleteColor={localDeletedColor}
          localAddColor={localAddNewColor}
          closeModal={modalForAddColor.onClose}
          handleInput={handleInput}
          modalOpen={modalForAddColor.onOpen}
        />
      )}

      <ModalEditor
        categories={categories}
        isOpen={modal.isOpen}
        formEditor={formEditor}
        onSaveCreated={onSaveCreated}
        closeModal={modal.onClose}
        handleInput={handleInput}
        colors={colors}
      />
    </div>
  )
}

export default Editor
