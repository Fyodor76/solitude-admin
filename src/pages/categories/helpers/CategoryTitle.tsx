import React from 'react'

import Icon from '@/shared/ui/icons/Icon'
import { FolderOutlined } from '@ant-design/icons'

interface CategoryTitleProps {
  name: string
  isShownAsActive?: boolean
  statusLabel?: string | null
  onEdit: () => void
  onDelete: () => void
  onCreate: () => void
}

const CategoryTitle = React.memo(
  ({
    name,
    isShownAsActive = true,
    statusLabel = null,
    onEdit,
    onDelete,
    onCreate,
  }: CategoryTitleProps) => {
    return (
      <div className={`category${isShownAsActive ? '' : ' category--inactive'}`}>
        <div className="category-main">
          <FolderOutlined className="category-icon" />
          <span className="category-name">{name}</span>
          {statusLabel ? <span className="category-status">{statusLabel}</span> : null}
        </div>
        <div className="btn-category">
          <button type="button" className="btn-edit" onClick={onEdit}>
            <Icon name="editing" color="#1a1a1a" />
          </button>
          <button type="button" className="btn-delete" onClick={onDelete}>
            <Icon name="delete" color="#1a1a1a" />
          </button>
          <button type="button" className="btn-add" onClick={onCreate}>
            <Icon color="#1a1a1a" name="add" />
          </button>
        </div>
      </div>
    )
  },
  (prevProps, nextProps) =>
    prevProps.name === nextProps.name &&
    prevProps.isShownAsActive === nextProps.isShownAsActive &&
    prevProps.statusLabel === nextProps.statusLabel &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onCreate === nextProps.onCreate
)

CategoryTitle.displayName = 'CategoryTitle'

export default CategoryTitle
