import React from 'react'

import { Button } from 'antd'

interface ButtonSaveProps {
  onSave: () => void
}
const ButtonSave = ({ onSave }: ButtonSaveProps) => {
  return (
    <div className="container-btn-save-editor">
      <Button className="btn-save-editor" type="primary" onClick={onSave}>
        Сохранить
      </Button>
    </div>
  )
}

export default ButtonSave
