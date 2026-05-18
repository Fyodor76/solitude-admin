import React from 'react'

import { Button, Modal, Select } from 'antd'

import { ALL_RU_SIZES } from './const'
import './SizeParameterAddModal.scss'

interface SizeParameterAddModalProps {
  isOpen: boolean
  selectedSizeToAdd?: string | null
  filterParameters: string[]
  onClose: () => void
  setSelectedSizeToAdd: React.Dispatch<React.SetStateAction<string | null>>
  createNewSizeParameter: () => void | Promise<void>
}
const SizeParameterAddModal = ({
  isOpen,
  selectedSizeToAdd,
  filterParameters,
  onClose,
  setSelectedSizeToAdd,
  createNewSizeParameter,
}: SizeParameterAddModalProps) => {
  const handleCreateAndCloseModal = () => {
    createNewSizeParameter()
    onClose()
  }
  return (
    <Modal
      className="sizeParameterAddModal"
      open={isOpen}
      onCancel={onClose}
      onOk={handleCreateAndCloseModal}
    >
      <label className="selectedSize">Выберите размер из списка:</label>
      <Select
        className="selectedSizeSelect"
        placeholder="Выберете размер, который хотите добавить"
        value={selectedSizeToAdd}
        onChange={setSelectedSizeToAdd}
        options={filterParameters.map(s => ({
          label: `${s} (${ALL_RU_SIZES[s]} p.)`,
          value: s,
        }))}
      ></Select>
    </Modal>
  )
}

export default SizeParameterAddModal
