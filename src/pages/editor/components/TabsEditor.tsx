import React from 'react'

import { Button } from 'antd'

import { EDITOR_TABS } from '../const'
import { EditorTabType } from '../types'

interface TabsEditorProps {
  setActiveTab: React.Dispatch<React.SetStateAction<EditorTabType>>
  activeTab: EditorTabType
}
const TabsEditor = ({ activeTab, setActiveTab }: TabsEditorProps) => {
  return (
    <div className="tabs-editor">
      <div
        onClick={() => setActiveTab(EDITOR_TABS.BASE)}
        className={`button-tab ${activeTab === EDITOR_TABS.BASE ? 'active' : ''}`}
      >
        Основное
      </div>
      <div
        onClick={() => setActiveTab(EDITOR_TABS.COLORS)}
        className={`button-tab ${activeTab === EDITOR_TABS.COLORS ? 'active' : ''}`}
      >
        Цвета
      </div>
      <div
        onClick={() => setActiveTab(EDITOR_TABS.SIDES)}
        className={`button-tab ${activeTab === EDITOR_TABS.SIDES ? 'active' : ''}`}
      >
        Стороны макета
      </div>
      <div
        onClick={() => setActiveTab(EDITOR_TABS.SPECIFICATIONS)}
        className={`button-tab ${activeTab === EDITOR_TABS.SPECIFICATIONS ? 'active' : ''}`}
      >
        Характеристики
      </div>
    </div>
  )
}

export default TabsEditor
