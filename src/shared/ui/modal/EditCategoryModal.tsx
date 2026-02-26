import React from 'react'

import { CategoryMenuItem } from '@/shared/lib/api/api-categories/types'
import { Modal } from 'antd'

interface EditCategoryModalProps {
  isOpen: boolean
  category: CategoryMenuItem
  onClose: () => void
  value: string
  onSave: (id: string, newName: string) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EditCategoryModal = ({
  isOpen,
  category,
  value,
  onClose,
  onSave,
  onChange,
}: EditCategoryModalProps) => {
  const handleSave = () => {
    onSave(category.id, value)
    onClose()
  }
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={() => handleSave()}
      title="Редактировать категорию"
    >
      <input type="text" value={value} onChange={onChange} />
    </Modal>
  )
}

export default EditCategoryModal
