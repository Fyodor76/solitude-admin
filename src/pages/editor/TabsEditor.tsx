import React from 'react'

import { Button } from 'antd'

import { EDITOR_TABS } from './const'
import { EditorTabType } from './types'

interface TabsEditorProps {
  setActiveTab: React.Dispatch<React.SetStateAction<EditorTabType>>
}
const TabsEditor = ({ setActiveTab }: TabsEditorProps) => {
  return (
    <div className="tabs-editor">
      <Button onClick={() => setActiveTab(EDITOR_TABS.BASE)} type="default" className="button-tab">
        Основное
      </Button>
      <Button onClick={() => setActiveTab(EDITOR_TABS.COLORS)} className="button-tab">
        Цвета
      </Button>
      <Button onClick={() => setActiveTab(EDITOR_TABS.SIDES)} className="button-tab">
        Стороны макета
      </Button>
      <Button onClick={() => setActiveTab(EDITOR_TABS.SPECIFICATIONS)} className="button-tab">
        Характеристики
      </Button>
    </div>
  )
}

export default TabsEditor
