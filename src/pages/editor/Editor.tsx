import React, { useEffect, useState } from 'react'

import {
  useGetCategoriesQuery,
  useGetCategoriesTreeQuery,
} from '@/shared/lib/api/categories/Categories'
import { useGetAllEditorsQuery } from '@/shared/lib/api/editor/Editor'
import { Button } from 'antd'

import { EDITOR_TABS, initialStateEditor } from './const'
import './Editor.scss'
import EditorsList from './EditorsList'
import TabsEditor from './TabsEditor'
import { EditorTabType, FormEditorType } from './types'

const Editor = () => {
  const { data: editors, isLoading: editorsLoading } = useGetAllEditorsQuery()
  const { data: categoriesData } = useGetCategoriesTreeQuery()
  const [activeTab, setActiveTab] = useState<EditorTabType>(EDITOR_TABS.BASE)
  const [activeConfigurationId, setActiveConfigurationId] = useState<string | null>(null)
  const [formEditor, setFormEditor] = useState<FormEditorType>(initialStateEditor)

  const configurations = editors?.data || []
  const categories = categoriesData?.data
  console.log(editors)
  useEffect(() => {
    if (configurations.length > 0 && !activeConfigurationId) {
      const firstConfig = configurations[0]
      setActiveConfigurationId(firstConfig.id)
      setFormEditor({
        id: firstConfig.id,
        categoryId: firstConfig.categoryId,
        title: firstConfig.title,
        isActive: true,
        colors: firstConfig.colors || [],
        variants: firstConfig.variants || [],
        specifications: firstConfig.specifications || [],
        createdAt: firstConfig.createdAt || '',
        updatedAt: firstConfig.updatedAt || '',
      })
    }
  }, [configurations])

  const handleInput = (v: any, field: keyof FormEditorType) => {
    setFormEditor(prev => ({
      ...prev,
      [field]: v,
    }))
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
          <Button type="primary">Создать</Button>
        </div>
      </div>
      <TabsEditor setActiveTab={setActiveTab} />
      {activeTab === EDITOR_TABS.BASE && (
        <EditorsList
          categories={categories}
          configurations={configurations}
          activeConfigurationId={activeConfigurationId}
          formEditor={formEditor}
          handleInput={handleInput}
          setActiveConfigurationId={setActiveConfigurationId}
        />
      )}
    </div>
  )
}

export default Editor
